<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import type { ButtonProps } from '@nuxt/ui'
import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'
import { useLocationsStore } from '~/modulos/logistica/master-data/locations/store/locations.store'
import { useLocations } from '~/modulos/logistica/master-data/locations/composables/useLocations'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const store = useTripsStore()

const id = route.params.id as string
const loading = ref(true)

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>

const trip = computed(() => store.current)

// Locations para resolver nombres
const locationsStore = useLocationsStore()
const { items: locationsList } = storeToRefs(locationsStore)
const { items: locationItems } = useLocations(locationsList)

const locationName = (locationId: string | null | undefined) => {
  if (!locationId) return '—'
  return (
    locationItems.value.find((l) => l.value === locationId)?.label ?? locationId
  )
}

// Formato de fecha legible
const formatDate = (date: string | null | undefined) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

// Badge de estado
type BadgeColor =
  | 'error'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'primary'
  | 'secondary'

const statusConfig: Record<string, { color: BadgeColor; label: string }> = {
  PLANNED: { color: 'neutral', label: 'Planificado' },
  IN_TRANSIT: { color: 'info', label: 'En tránsito' },
  COMPLETED: { color: 'success', label: 'Completado' },
  CANCELLED: { color: 'error', label: 'Cancelado' }
}

const statusBadge = computed<{ color: BadgeColor; label: string }>(() => {
  const s = trip.value?.status ?? ''
  return statusConfig[s] ?? { color: 'neutral' as BadgeColor, label: s }
})

onMounted(async () => {
  await Promise.all([store.fetchOne(id), locationsStore.fetchAll()])
  loading.value = false
})
const onEdit = () => {
  router.push(`/logistica/viajes/${id}/edit`)
}
const links = ref<ButtonProps[]>([
  {
    label: 'Editar',
    icon: 'i-lucide-pencil',
    onClick: onEdit,
    color: 'primary',
    variant: 'solid'
  }
])
</script>

<template>
  <div v-if="loading" class="flex justify-center py-24">
    <UIcon name="i-lucide-loader" class="animate-spin text-3xl text-gray-400" />
  </div>

  <UPage v-else-if="trip">
    <!-- Header -->
    <div class="flex flex-col">
      <UButton
        icon="i-lucide-layout-panel-left"
        variant="ghost"
        color="neutral"
        label="Menu"
        @click="moduleCollapsed = !moduleCollapsed"
      />
      <UPageHeader
        :title="`Viaje ${trip.reference_number ?? id}`"
        :links="links"
      />
    </div>

    <div class="space-y-6 mt-4">
      <!-- Datos generales -->
      <UCard>
        <template #header>
          <span class="font-medium text-sm">Datos del viaje</span>
        </template>

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Referencia
            </span>
            <span class="font-medium">{{ trip.reference_number ?? '—' }}</span>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Semana
            </span>
            <span class="font-medium">{{ trip.week ?? '—' }}</span>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Estado
            </span>
            <UBadge :color="statusBadge.color" variant="soft" class="w-fit">
              {{ statusBadge.label }}
            </UBadge>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Unidad
            </span>
            <span class="font-medium">
              {{ trip.vehicle_combination?.unit_number ?? '—' }}
            </span>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Salida
            </span>
            <span class="font-medium">
              {{ formatDate(trip.departure_time) }}
            </span>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Llegada
            </span>
            <span class="font-medium">{{ formatDate(trip.arrival_time) }}</span>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Origen
            </span>
            <span class="font-medium">
              {{ locationName(trip.origin_location_id) }}
            </span>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-400 uppercase tracking-wide">
              Destino
            </span>
            <span class="font-medium">
              {{ locationName(trip.destination_location_id) }}
            </span>
          </div>
        </div>
      </UCard>

      <!-- Paradas y órdenes -->
      <UCard v-if="trip.trip_stops?.length">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium text-sm">Paradas y órdenes</span>
            <UBadge variant="soft" color="neutral">
              {{ trip.trip_stops.length }} paradas
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="(stop, index) in trip.trip_stops"
            :key="stop.id"
            class="flex gap-4"
          >
            <!-- Línea de tiempo -->
            <div class="flex flex-col items-center">
              <div
                class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-600 shrink-0"
              >
                {{ index + 1 }}
              </div>
              <div
                v-if="index < trip.trip_stops.length - 1"
                class="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1"
              />
            </div>

            <!-- Contenido del stop -->
            <div class="flex-1 pb-4">
              <p class="font-medium text-sm text-gray-800 dark:text-gray-200">
                {{ locationName(stop.location_id) }}
              </p>
              <p v-if="stop.stop_type" class="text-xs text-gray-400 mb-2">
                {{ stop.stop_type }}
              </p>

              <!-- Órdenes del stop -->
              <div v-if="stop.trip_orders?.length" class="mt-2 space-y-1.5">
                <div
                  v-for="order in stop.trip_orders"
                  :key="order.dispatch_order_id"
                  class="flex items-center gap-2 rounded-md border border-gray-100 dark:border-gray-800 px-3 py-2 text-xs"
                >
                  <!-- Badge PICKUP / DELIVERY -->
                  <UBadge
                    :color="order.action === 'PICKUP' ? 'success' : 'info'"
                    variant="soft"
                    size="xs"
                  >
                    {{ order.action === 'PICKUP' ? 'Carga' : 'Descarga' }}
                  </UBadge>

                  <!-- Número de orden -->
                  <span class="font-medium">
                    {{ order.order_number }}
                  </span>

                  <!-- Cliente -->
                  <span class="text-gray-400">
                    {{ order.customer_name ?? '—' }}
                  </span>
                </div>
              </div>

              <p v-else class="text-xs text-gray-400 mt-1">
                Sin órdenes asignadas
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <UAlert
        v-else
        color="neutral"
        variant="soft"
        icon="i-lucide-package-open"
        title="Sin órdenes asignadas"
        description="Este viaje no tiene órdenes asignadas todavía."
      >
        <template #actions>
          <UButton
            size="xs"
            variant="outline"
            @click="router.push(`/logistica/viajes/${id}/edit`)"
          >
            Asignar órdenes
          </UButton>
        </template>
      </UAlert>
    </div>
  </UPage>
</template>
