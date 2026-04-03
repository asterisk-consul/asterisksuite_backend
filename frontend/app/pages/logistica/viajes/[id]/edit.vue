<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})

import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'
import type { CreateTripInput } from '~/modulos/logistica/transport/trips/types/trips.types'
import TripsForm from '~/modulos/logistica/transport/trips/components/TripsForm.vue'
import TripOrderPlanner from '~/modulos/logistica/transport/trips/planners/TripOrderPlanner.vue'

const route = useRoute()
const router = useRouter()
const store = useTripsStore()

const id = route.params.id as string
const loading = ref(true)
const tripSaved = ref(false)

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>

const trip = computed(() => store.current)

onMounted(async () => {
  try {
    await store.fetchOne(id)
  } finally {
    loading.value = false
    // En edit el trip ya existe, mostramos el planner directamente
    tripSaved.value = true
  }
})

const submit = async (dto: CreateTripInput) => {
  await store.update(id, dto)
  tripSaved.value = true
}

const handleOrdersSaved = () => {
  router.push('/logistica/viajes/')
}
</script>

<template>
  <div v-if="loading" class="flex justify-center py-24">
    <UIcon name="i-lucide-loader" class="animate-spin text-3xl text-gray-400" />
  </div>

  <UPage v-else-if="trip">
    <div class="flex flex-col">
      <UButton
        icon="i-lucide-layout-panel-left"
        variant="ghost"
        color="neutral"
        label="Menu"
        @click="moduleCollapsed = !moduleCollapsed"
      />
      <UPageHeader title="Editar viaje" />
    </div>

    <!-- Datos del viaje -->
    <UCard title="Viaje">
      <TripsForm
        :trip="trip ?? undefined"
        @submit="submit"
        @cancel="router.back()"
      />
    </UCard>

    <!-- Asignación de órdenes — visible apenas carga (trip ya existe) -->
    <Transition name="fade-down">
      <div v-if="tripSaved" class="mt-6 space-y-2">
        <div class="flex items-center gap-2 px-1">
          <UIcon name="i-lucide-package" class="text-primary-500" />
          <p class="text-sm text-gray-500">
            Órdenes asignadas a este viaje. Podés modificarlas o
            <UButton
              variant="link"
              color="neutral"
              class="px-0"
              @click="router.push('/logistica/viajes/')"
            >
              volver al listado
            </UButton>
          </p>
        </div>

        <UCard title="Asignación de órdenes">
          <TripOrderPlanner
            :trip-id="id"
            :initial-stops="trip.trip_stops"
            @saved="handleOrdersSaved"
          />
        </UCard>
      </div>
    </Transition>
  </UPage>
</template>

<style scoped>
.fade-down-enter-active {
  transition: all 0.35s ease;
}
.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
