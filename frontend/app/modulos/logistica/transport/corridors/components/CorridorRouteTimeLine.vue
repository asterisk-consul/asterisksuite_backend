<script setup lang="ts">
import { computed } from 'vue'
import type { RoutePoint } from '~/modulos/logistica/transport/corridors/types/corridors.types'

const props = defineProps<{
  route?: RoutePoint[]
  totalDistance?: number | null
  estimatedMinutes?: number | null
}>()

const locationName = (point: RoutePoint) => {
  return [point.address, point.city, point.province].filter(Boolean).join(', ')
}

const distanceFormatted = computed(() => {
  if (props.totalDistance == null) return '-'
  return `${props.totalDistance.toFixed(1)} km`
})

const durationFormatted = computed(() => {
  if (props.estimatedMinutes == null) return '-'

  const total = Math.round(props.estimatedMinutes)

  const hours = Math.floor(total / 60)
  const minutes = total % 60

  if (hours === 0) return `${minutes}m`

  return `${hours}h ${minutes}m`
})
</script>

<template>
  <UCard>
    <h3 class="font-semibold mb-6">Ruta del corredor</h3>

    <div class="relative pl-6">
      <!-- línea vertical -->
      <div class="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />

      <div
        v-for="(point, index) in route || []"
        :key="index"
        class="relative mb-6 flex items-start"
      >
        <!-- punto -->
        <div
          class="absolute -left-0.5 w-4 h-4 rounded-full border-2 bg-white"
          :class="{
            'border-green-500': point.type === 'origin',
            'border-red-500': point.type === 'destination',
            'border-blue-400': point.type === 'stop'
          }"
        />

        <!-- contenido -->
        <div class="ml-6">
          <p class="font-medium text-sm">
            {{
              point.type === 'origin'
                ? 'Origen'
                : point.type === 'destination'
                  ? 'Destino'
                  : `Parada ${index}`
            }}
          </p>

          <p class="text-sm text-gray-700">
            {{ point.name }}
          </p>

          <p class="text-xs text-gray-500">
            {{ locationName(point) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 text-sm text-gray-500 space-y-1 border-t pt-4">
      <p>
        Distancia:
        {{ distanceFormatted }}
      </p>

      <p>
        Tiempo estimado:
        {{ durationFormatted }}
      </p>
    </div>
  </UCard>
</template>
