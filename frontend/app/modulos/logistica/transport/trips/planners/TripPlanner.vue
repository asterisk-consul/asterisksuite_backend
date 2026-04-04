<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})

import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'
import { useDispatchOrdersStore } from '~/modulos/logistica/documents/dispatch-orders/store/dispatch-orders.store'
import { useLocationsStore } from '~/modulos/logistica/master-data/locations/store/locations.store'
import { useLocations } from '~/modulos/logistica/master-data/locations/composables/useLocations'
import { useTripPlannerStore } from '~/modulos/logistica/transport/trips/planners/trip-planer.store'
import { storeToRefs } from 'pinia'
import type { Trip } from '~/modulos/logistica/transport/trips/types/trips.types'
import type { DispatchOrder } from '~/modulos/logistica/documents/dispatch-orders/types/dispatch-orders.types'

// ─── Stores ───────────────────────────────────────────────────────────────────
const tripsStore = useTripsStore()
const ordersStore = useDispatchOrdersStore()
const locationsStore = useLocationsStore()
const plannerStore = useTripPlannerStore()

const { items: trips, loading: loadingTrips } = storeToRefs(tripsStore)
const { dispatchOrders, loading: loadingOrders } = storeToRefs(ordersStore)
const { items: locationsList } = storeToRefs(locationsStore)
const { items: locationItems } = useLocations(locationsList)

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>

// ─── Helpers ──────────────────────────────────────────────────────────────────
const locationName = (id: string | null | undefined) => {
  if (!id) return '—'
  return locationItems.value.find((l) => l.value === id)?.label ?? id
}

const formatDate = (d: string | null | undefined) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short'
  })
}

// ─── Órdenes agrupadas ────────────────────────────────────────────────────────
const pendingOrders = computed(() =>
  dispatchOrders.value.filter((o) => o.status === 'PENDING')
)
const assignedOrders = computed(() =>
  dispatchOrders.value.filter((o) => o.status !== 'PENDING')
)

// ─── Viajes agrupados por estado ──────────────────────────────────────────────
type TripStatus = 'PLANNED' | 'IN_TRANSIT' | 'COMPLETED'

const tripStatusConfig: Record<
  TripStatus,
  { label: string; color: string; headerColor: string }
> = {
  PLANNED: {
    label: 'Planificados',
    color: 'border-blue-200 dark:border-blue-800',
    headerColor:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
  },
  IN_TRANSIT: {
    label: 'En tránsito',
    color: 'border-amber-200 dark:border-amber-800',
    headerColor:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
  },
  COMPLETED: {
    label: 'Completados',
    color: 'border-green-200 dark:border-green-800',
    headerColor:
      'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300'
  }
}

const tripsByStatus = computed(() =>
  (Object.keys(tripStatusConfig) as TripStatus[]).map((status) => ({
    status,
    ...tripStatusConfig[status],
    trips: (trips.value ?? []).filter((t) => t.status === status)
  }))
)

// ─── Drag & Drop ──────────────────────────────────────────────────────────────
const draggingOrder = ref<DispatchOrder | null>(null)
const draggingFrom = ref<'pending' | 'assigned' | null>(null)
const dragOverTripId = ref<string | null>(null)
const saving = ref<string | null>(null) // tripId en proceso

const onDragStart = (order: DispatchOrder, from: 'pending' | 'assigned') => {
  draggingOrder.value = order
  draggingFrom.value = from
}

const onDragEnd = () => {
  draggingOrder.value = null
  draggingFrom.value = null
  dragOverTripId.value = null
}

const onDragOverTrip = (tripId: string) => {
  dragOverTripId.value = tripId
}

const onDragLeaveTrip = () => {
  dragOverTripId.value = null
}

const onDropOnTrip = async (trip: Trip) => {
  const order = draggingOrder.value
  if (!order) return

  dragOverTripId.value = null
  saving.value = trip.id

  try {
    // Construir stops a partir de la orden + stops existentes del viaje
    plannerStore.init(trip.id)

    // Cargar stops existentes del viaje si los hay
    const existingStops = trip.trip_stops ?? []

    // Mapear stops existentes al store
    existingStops.forEach((s) => {
      s.trip_orders.forEach((o) => {
        // Ya están en el servidor, los reconstruimos para el payload
      })
    })

    // Agregar la nueva orden al plannerStore usando buildStopsFromOrders
    // pero combinando con las órdenes ya asignadas al viaje
    const existingOrderIds = existingStops.flatMap((s) =>
      s.trip_orders.map((o) => o.dispatch_order_id)
    )

    // Construir el payload manualmente combinando stops existentes + nueva orden
    const stopMap = new Map<
      string,
      {
        location_id: string
        orders: { dispatch_order_id: string; action: 'PICKUP' | 'DELIVERY' }[]
      }
    >()

    // Re-agregar stops existentes
    existingStops.forEach((s) => {
      if (!stopMap.has(s.location_id)) {
        stopMap.set(s.location_id, { location_id: s.location_id, orders: [] })
      }
      s.trip_orders.forEach((o) => {
        stopMap.get(s.location_id)!.orders.push({
          dispatch_order_id: o.dispatch_order_id,
          action: o.action as 'PICKUP' | 'DELIVERY'
        })
      })
    })

    // Agregar nueva orden (PICKUP en origen, DELIVERY en destino)
    const origin = order.origin_location_id
    const destination = order.destination_location_id

    if (origin) {
      if (!stopMap.has(origin))
        stopMap.set(origin, { location_id: origin, orders: [] })
      stopMap
        .get(origin)!
        .orders.push({ dispatch_order_id: order.id, action: 'PICKUP' as const })
    }
    if (destination) {
      if (!stopMap.has(destination))
        stopMap.set(destination, { location_id: destination, orders: [] })
      stopMap.get(destination)!.orders.push({
        dispatch_order_id: order.id,
        action: 'DELIVERY' as const
      })
    }

    const stops = Array.from(stopMap.values()).map((s, i) => ({
      location_id: s.location_id,
      stop_order: i + 1,
      orders: s.orders
    }))

    await tripsStore.assignOrders(trip.id, { stops })

    // Refrescar datos
    await Promise.all([tripsStore.fetchAll(), ordersStore.fetchAll()])
  } finally {
    saving.value = null
    onDragEnd()
  }
}

// Drop en zona PENDING → desasignar
const onDropOnPending = async () => {
  const order = draggingOrder.value
  if (!order || draggingFrom.value !== 'assigned') return

  saving.value = 'pending'
  try {
    await ordersStore.update(order.id, { status: 'PENDING' } as any)
    await Promise.all([tripsStore.fetchAll(), ordersStore.fetchAll()])
  } finally {
    saving.value = null
    onDragEnd()
  }
}

const dragOverPending = ref(false)

// ─── Init ─────────────────────────────────────────────────────────────────────
const loading = computed(() => loadingTrips.value || loadingOrders.value)

onMounted(async () => {
  await Promise.all([
    tripsStore.fetchAll(),
    ordersStore.fetchAll(),
    locationsStore.fetchAll()
  ])
})
function handleDropPending() {
  onDropOnPending()
  dragOverPending.value = false
}
</script>

<template>
  <UPage>
    <!-- Header -->
    <div class="flex flex-col mb-6">
      <UButton
        icon="i-lucide-layout-panel-left"
        variant="ghost"
        color="neutral"
        label="Menu"
        class="w-fit"
        @click="moduleCollapsed = !moduleCollapsed"
      />
      <UPageHeader title="Planificación">
        <template #description>
          Arrastrá órdenes a los viajes para asignarlas
        </template>
      </UPageHeader>
    </div>

    <div v-if="loading" class="flex justify-center py-24">
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-3xl text-gray-400"
      />
    </div>

    <div v-else class="space-y-8">
      <!-- ═══════════════════════════════════════════
           ZONA ÓRDENES
      ════════════════════════════════════════════ -->
      <section class="space-y-3">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Órdenes de despacho
        </h2>

        <div class="grid grid-cols-2 gap-4">
          <!-- PENDING -->
          <div
            class="rounded-xl border-2 transition-colors p-3 space-y-2 min-h-30"
            :class="[
              dragOverPending
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/20'
                : 'border-dashed border-gray-200 dark:border-gray-700'
            ]"
            @dragover.prevent="dragOverPending = true"
            @dragleave="dragOverPending = false"
            @drop.prevent="handleDropPending"
          >
            <div class="flex items-center justify-between px-1">
              <span
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                Pendientes
              </span>
              <UBadge color="neutral" variant="soft" size="xs">
                {{ pendingOrders.length }}
              </UBadge>
            </div>

            <p
              v-if="!pendingOrders.length"
              class="text-xs text-gray-400 text-center py-4"
            >
              Sin órdenes pendientes
            </p>

            <div class="flex flex-wrap gap-2">
              <div
                v-for="order in pendingOrders"
                :key="order.id"
                draggable="true"
                class="group cursor-grab active:cursor-grabbing select-none rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-3 py-2 shadow-sm hover:shadow-md transition-all text-xs space-y-1 w-55"
                :class="{
                  'opacity-40 scale-95': draggingOrder?.id === order.id
                }"
                @dragstart="onDragStart(order, 'pending')"
                @dragend="onDragEnd"
              >
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="font-semibold text-gray-800 dark:text-gray-200 truncate"
                  >
                    {{ order.order_number ?? `#${order.id.slice(0, 6)}` }}
                  </span>
                  <UIcon
                    name="i-lucide-grip-vertical"
                    class="text-gray-300 group-hover:text-gray-400 shrink-0"
                  />
                </div>
                <p v-if="order.customers?.name" class="text-gray-400 truncate">
                  {{ order.customers.name }}
                </p>
                <div class="flex items-center gap-1 text-gray-400">
                  <span class="truncate max-w-20">
                    {{ locationName(order.origin_location_id) }}
                  </span>
                  <UIcon name="i-lucide-arrow-right" class="shrink-0" />
                  <span class="truncate max-w-20">
                    {{ locationName(order.destination_location_id) }}
                  </span>
                </div>
                <p
                  v-if="order.planned_date ?? order.created_at"
                  class="text-gray-400"
                >
                  {{ formatDate(order.planned_date ?? order.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- ASSIGNED -->
          <div
            class="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-3 space-y-2 min-h-30"
          >
            <div class="flex items-center justify-between px-1">
              <span
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                Asignadas
              </span>
              <UBadge color="success" variant="soft" size="xs">
                {{ assignedOrders.length }}
              </UBadge>
            </div>

            <p
              v-if="!assignedOrders.length"
              class="text-xs text-gray-400 text-center py-4"
            >
              Sin órdenes asignadas
            </p>

            <div class="flex flex-wrap gap-2">
              <div
                v-for="order in assignedOrders"
                :key="order.id"
                draggable="true"
                class="group cursor-grab active:cursor-grabbing select-none rounded-lg border bg-white dark:bg-gray-900 border-green-200 dark:border-green-800 px-3 py-2 shadow-sm hover:shadow-md transition-all text-xs space-y-1 w-55"
                :class="{
                  'opacity-40 scale-95': draggingOrder?.id === order.id
                }"
                @dragstart="onDragStart(order, 'assigned')"
                @dragend="onDragEnd"
              >
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="font-semibold text-gray-800 dark:text-gray-200 truncate"
                  >
                    {{ order.order_number ?? `#${order.id.slice(0, 6)}` }}
                  </span>
                  <UIcon
                    name="i-lucide-grip-vertical"
                    class="text-gray-300 group-hover:text-gray-400 shrink-0"
                  />
                </div>
                <p v-if="order.customers?.name" class="text-gray-400 truncate">
                  {{ order.customers.name }}
                </p>
                <div class="flex items-center gap-1 text-gray-400">
                  <span class="truncate max-w-20">
                    {{ locationName(order.origin_location_id) }}
                  </span>
                  <UIcon name="i-lucide-arrow-right" class="shrink-0" />
                  <span class="truncate max-w-20">
                    {{ locationName(order.destination_location_id) }}
                  </span>
                </div>
                <p
                  v-if="order.planned_date ?? order.created_at"
                  class="text-gray-400"
                >
                  {{ formatDate(order.planned_date ?? order.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════
           ZONA VIAJES
      ════════════════════════════════════════════ -->
      <section class="space-y-3">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Viajes
        </h2>

        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="group in tripsByStatus"
            :key="group.status"
            class="rounded-xl border-2 overflow-hidden"
            :class="group.color"
          >
            <!-- Columna header -->
            <div
              class="px-4 py-2.5 flex items-center justify-between"
              :class="group.headerColor"
            >
              <span class="text-xs font-bold uppercase tracking-wide">
                {{ group.label }}
              </span>
              <UBadge color="neutral" variant="soft" size="xs">
                {{ group.trips.length }}
              </UBadge>
            </div>

            <!-- Cards de viajes -->
            <div class="p-3 space-y-2 min-h-40">
              <p
                v-if="!group.trips.length"
                class="text-xs text-gray-400 text-center py-6"
              >
                Sin viajes
              </p>

              <div
                v-for="trip in group.trips"
                :key="trip.id"
                class="rounded-lg border bg-white dark:bg-gray-900 p-3 text-xs space-y-2 transition-all relative"
                :class="[
                  dragOverTripId === trip.id
                    ? 'border-primary-400 shadow-lg ring-2 ring-primary-300 dark:ring-primary-700 scale-[1.01]'
                    : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md',
                  saving === trip.id ? 'opacity-60 pointer-events-none' : ''
                ]"
                @dragover.prevent="onDragOverTrip(trip.id)"
                @dragleave="onDragLeaveTrip"
                @drop.prevent="onDropOnTrip(trip)"
              >
                <!-- Saving spinner -->
                <div
                  v-if="saving === trip.id"
                  class="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70 dark:bg-gray-900/70 z-10"
                >
                  <UIcon
                    name="i-lucide-loader-circle"
                    class="animate-spin text-primary-500 text-lg"
                  />
                </div>

                <!-- Referencia -->
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="font-semibold text-gray-800 dark:text-gray-200 truncate"
                  >
                    {{
                      trip.reference_number ?? `Viaje ${trip.id.slice(0, 6)}`
                    }}
                  </span>
                  <UButton
                    icon="i-lucide-external-link"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    :to="`/logistica/viajes/${trip.id}`"
                    @click.stop
                  />
                </div>

                <!-- Unidad -->
                <div class="flex items-center gap-1.5 text-gray-500">
                  <UIcon name="i-lucide-truck" class="shrink-0" />
                  <span>
                    {{ trip.vehicle_combination?.unit_number ?? 'Sin unidad' }}
                  </span>
                </div>

                <!-- Fechas -->
                <div class="flex items-center gap-1.5 text-gray-500">
                  <UIcon name="i-lucide-calendar" class="shrink-0" />
                  <span>{{ formatDate(trip.departure_time) }}</span>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="shrink-0 text-gray-300"
                  />
                  <span>{{ formatDate(trip.arrival_time) }}</span>
                </div>

                <!-- Origen → Destino -->
                <div class="flex items-center gap-1.5 text-gray-500">
                  <UIcon name="i-lucide-map-pin" class="shrink-0" />
                  <span class="truncate max-w-20">
                    {{ locationName(trip.origin_location_id) }}
                  </span>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="shrink-0 text-gray-300"
                  />
                  <span class="truncate max-w-20">
                    {{ locationName(trip.destination_location_id) }}
                  </span>
                </div>

                <!-- Cantidad de órdenes -->
                <div
                  class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800"
                >
                  <div class="flex items-center gap-1.5 text-gray-400">
                    <UIcon name="i-lucide-package" class="shrink-0" />
                    <span>
                      {{ trip.unique_orders?.length ?? 0 }}
                      órdenes
                    </span>
                  </div>
                  <!-- Indicador drop -->
                  <span
                    v-if="dragOverTripId === trip.id"
                    class="text-primary-500 font-medium animate-pulse"
                  >
                    Soltar aquí
                  </span>
                  <span v-else class="text-gray-300 italic">← soltar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </UPage>
</template>
