<script setup lang="ts">
import type { PlannerOrder, PlannerStop } from './TripPlanner.types'
import { useLocations } from '~/modulos/logistica/master-data/locations/composables/useLocations'
import { useLocationsStore } from '~/modulos/logistica/master-data/locations/store/locations.store'
import { useDispatchOrdersStore } from '~/modulos/logistica/documents/dispatch-orders/store/dispatch-orders.store'
import { useTripPlannerStore } from './trip-planer.store'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  tripId: string
  initialStops?: any[]
}>()

const emit = defineEmits<{
  saved: []
}>()

/**
 * STORES
 */
const plannerStore = useTripPlannerStore()
const { stops, selectedOrders } = storeToRefs(plannerStore)

const locationsStore = useLocationsStore()
const { items: locations } = storeToRefs(locationsStore)
const { items: locationItems } = useLocations(locations)

const dispatchOrdersStore = useDispatchOrdersStore()
const { dispatchOrders, loading: loadingOrders } =
  storeToRefs(dispatchOrdersStore)

/**
 * HELPERS
 */
const locationName = (id?: string | null): string => {
  if (!id) return '—'

  const loc = locations.value.find((l) => l.id === id)
  if (!loc) return id

  return [loc.city, loc.province].filter(Boolean).join(' - ')
}

const isOrderSelected = (orderId: string) =>
  selectedOrders.value.some((o) => o.id === orderId)

const toggleOrder = (order: any) => {
  plannerStore.toggleOrder(order)
}

/**
 * LABELS
 */
const actionLabel: Record<string, string> = {
  PICKUP: 'Carga',
  DELIVERY: 'Descarga'
}

/**
 * PREVIEW reactivo
 */
const previewStops = computed<PlannerStop[]>(() => {
  const map = new Map<string, PlannerStop>()

  selectedOrders.value.forEach((o) => {
    const origin = o.origin_location_id?.trim().toLowerCase()
    const destination = o.destination_location_id?.trim().toLowerCase()

    if (origin) {
      if (!map.has(origin)) {
        map.set(origin, {
          id: origin,
          location_id: origin,
          stop_order: 0,
          orders: []
        })
      }

      map.get(origin)!.orders.push({
        dispatch_order_id: o.id,
        order_number: o.order_number,
        customer_name: o.customers?.name,
        action: 'PICKUP'
      })
    }

    if (destination) {
      if (!map.has(destination)) {
        map.set(destination, {
          id: destination,
          location_id: destination,
          stop_order: 0,
          orders: []
        })
      }

      map.get(destination)!.orders.push({
        dispatch_order_id: o.id,
        order_number: o.order_number,
        customer_name: o.customers?.name,
        action: 'DELIVERY'
      })
    }
  })

  return Array.from(map.values()).map((s, i) => ({
    ...s,
    stop_order: i + 1
  }))
})

/**
 * BUILD & SAVE
 */
const saving = ref(false)
const saved = ref(false)

const buildAndSave = async () => {
  plannerStore.buildStopsFromOrders()

  saving.value = true
  saved.value = false
  try {
    await plannerStore.save()
    saved.value = true
    emit('saved')
  } finally {
    saving.value = false
  }
}

/**
 * INIT + 🔥 FIX EDIT
 */
onMounted(async () => {
  plannerStore.init(props.tripId)

  await Promise.all([locationsStore.fetchAll(), dispatchOrdersStore.fetchAll()])

  // 🔥 usar initialStops (no stops del store)
  if (props.initialStops?.length) {
    const existingOrderIds = props.initialStops.flatMap((s: any) =>
      (s.trip_orders ?? []).map((o: any) => o.dispatch_order_id)
    )

    plannerStore.selectedOrders = dispatchOrders.value.filter((o) =>
      existingOrderIds.includes(o.id)
    )
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-semibold">Asignación de órdenes</h3>
        <p class="text-sm text-gray-500">
          Seleccioná las órdenes a incluir en este viaje
        </p>
      </div>

      <UButton
        :loading="saving"
        :disabled="selectedOrders.length === 0"
        icon="i-lucide-save"
        @click="buildAndSave"
      >
        Guardar asignación
      </UButton>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- IZQUIERDA -->
      <UCard>
        <template #header>
          <div class="flex justify-between">
            <span class="text-sm font-medium">Órdenes</span>
            <UBadge>{{ selectedOrders.length }}</UBadge>
          </div>
        </template>

        <div v-if="loadingOrders" class="py-8 text-center">
          <UIcon name="i-lucide-loader" class="animate-spin" />
        </div>

        <div v-else class="space-y-2 max-h-120 overflow-y-auto">
          <div
            v-for="order in dispatchOrders"
            :key="order.id"
            class="border rounded p-2 cursor-pointer"
            :class="isOrderSelected(order.id) ? 'bg-primary-900' : ''"
            @click="toggleOrder(order)"
          >
            <div class="flex items-center gap-2">
              <UCheckbox
                :model-value="isOrderSelected(order.id)"
                @click.stop
                @update:model-value="toggleOrder(order)"
              />

              <span class="text-sm text-neutral-200">
                {{ order.order_number ?? order.id }}
              </span>
              <span class="text-lg text-neutral-200">
                {{ order.customers?.name }}
              </span>
            </div>

            <div class="text-xs pl-6 text-neutral-400">
              {{ locationName(order.origin_location_id) }}
              →
              {{ locationName(order.destination_location_id) }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- DERECHA -->
      <UCard>
        <template #header>
          <span class="text-sm font-medium">Paradas</span>
        </template>

        <div v-if="!selectedOrders.length" class="text-sm text-gray-400">
          Seleccioná órdenes
        </div>

        <div v-else class="space-y-3">
          <div v-for="(stop, i) in previewStops" :key="stop.id">
            <p class="text-sm font-medium">
              {{ locationName(stop.location_id) }}
            </p>

            <div
              v-for="o in stop.orders"
              :key="o.dispatch_order_id"
              class="flex items-center gap-2 text-xs"
            >
              <!-- acción -->
              <span class="font-medium">
                {{ actionLabel[o.action] ?? o.action }}
              </span>

              <!-- número de orden -->
              <span>
                {{ o.order_number }}
              </span>

              <!-- cliente -->
              <span class="text-gray-400">
                {{ o.customer_name }}
              </span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <UAlert v-if="saved" color="success">Guardado correctamente</UAlert>
  </div>
</template>
