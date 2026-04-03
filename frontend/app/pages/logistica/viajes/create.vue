<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})

import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'
import type { CreateTripInput } from '~/modulos/logistica/transport/trips/types/trips.types'

import TripsForm from '~/modulos/logistica/transport/trips/components/TripsForm.vue'
import TripOrderPlanner from '~/modulos/logistica/transport/trips/planners/TripOrderPlanner.vue'

const router = useRouter()
const store = useTripsStore()

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}

/**
 * Paso 1: crear el trip y guardar el id
 */
const savedTripId = ref<string | null>(null)

const submit = async (dto: CreateTripInput) => {
  const trip = await store.create(dto)
  savedTripId.value = trip.id
}

/**
 * Paso 2: órdenes asignadas → navegar
 */
const handleOrdersSaved = () => {
  router.push('/logistica/viajes/')
}
</script>

<template>
  <UPage>
    <div class="flex flex-col">
      <div>
        <UButton
          icon="i-lucide-layout-panel-left"
          variant="ghost"
          color="neutral"
          label="Menu"
          @click="toggleModuleSidebar"
        />
      </div>
      <UPageHeader title="Crear Viaje" />
    </div>

    <!-- Paso 1: datos del viaje -->
    <UCard title="Viaje">
      <TripsForm
        :disabled="!!savedTripId"
        @submit="submit"
        @cancel="router.back()"
      />
    </UCard>

    <!-- Paso 2: asignación de órdenes (aparece al guardar el trip) -->
    <Transition name="fade-down">
      <div v-if="savedTripId" class="mt-6 space-y-2">
        <div class="flex items-center gap-2 px-1">
          <UIcon name="i-lucide-check-circle" class="text-green-500" />
          <p class="text-sm text-gray-500">
            Viaje creado. Ahora podés asignar órdenes o
            <UButton
              variant="link"
              color="neutral"
              class="px-0"
              @click="router.push('/logistica/viajes/')"
            >
              saltar este paso
            </UButton>
          </p>
        </div>

        <UCard title="Asignación de órdenes">
          <TripOrderPlanner :trip-id="savedTripId" @saved="handleOrdersSaved" />
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
