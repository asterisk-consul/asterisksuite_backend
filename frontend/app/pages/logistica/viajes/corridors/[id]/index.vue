<script setup lang="ts">
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
definePageMeta({
  middleware: ['auth'],
  layout: 'logistica'
})

import { useCorridorsStore } from '~/modulos/logistica/transport/corridors/corridors.store'
import CorridorRouteTimeline from '~/modulos/logistica/transport/corridors/components/CorridorRouteTimeLine.vue'
import CorridorMap from '~/modulos/logistica/transport/corridors/components/CorridorMap.vue'
import type { ButtonProps } from '@nuxt/ui'

const route = useRoute()
const store = useCorridorsStore()

const id = route.params.id as string

await Promise.all([store.fetchCorridor(id), store.fetchRoute(id)])

const corridor = computed(() => store.currentCorridor)
const routeData = computed(() => store.currentRoute)

const originName = computed(() => {
  if (!routeData.value?.route?.length) return ''
  return routeData.value.route[0]?.city
})

const destinationName = computed(() => {
  if (!routeData.value?.route?.length) return ''
  return routeData.value.route[routeData.value.route.length - 1]?.city
})

const routeStats = ref({
  distanceKm: 0,
  durationHours: 0
})

function handleRouteInfo(info: { distanceKm: number; durationHours: number }) {
  routeStats.value = info
}

const durationFormatted = computed(() => {
  const totalMinutes = Math.round(routeStats.value.durationHours * 60)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
})

const distanceFormatted = computed(() => routeStats.value.distanceKm.toFixed(1))
const mapPoints = computed(() => {
  if (!routeData.value?.route) return []

  return routeData.value.route
    .filter((p: any) => p.latitude && p.longitude)
    .map((p: any) => ({
      lat: Number(p.latitude),
      lng: Number(p.longitude),
      city: p.city ?? 'Sin ciudad'
    }))
})
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}

const link = computed<ButtonProps[]>(() => {
  if (!corridor.value) return []

  return [
    {
      label: 'Editar',
      icon: 'i-lucide-pencil',
      to: `/logistica/viajes/corridors/${corridor.value.id}/edit`,
      color: 'primary',
      variant: 'solid'
    }
  ]
})
</script>

<template>
  <UPage v-if="corridor && routeData">
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
      <UPageHeader
        :title="corridor?.name || 'Corredor'"
        :description="`${originName} → ${destinationName}`"
        :links="link"
      />
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- MAPA -->
      <UCard class="col-span-2">
        <div class="h-96">
          <ClientOnly fallback-tag="div">
            <CorridorMap
              v-if="routeData?.route?.length"
              :points="mapPoints"
              @routeInfo="handleRouteInfo"
            />
          </ClientOnly>
        </div>
      </UCard>

      <!-- TIMELINE -->
      <CorridorRouteTimeline
        :route="routeData?.route"
        :total-distance="routeStats.distanceKm"
        :estimated-minutes="routeStats.durationHours * 60"
      />
    </div>
  </UPage>

  <div v-else class="flex justify-center py-24">
    <UIcon name="i-lucide-loader" class="animate-spin text-3xl text-gray-400" />
  </div>
</template>
