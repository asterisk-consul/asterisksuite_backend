<script setup lang="ts">
import { nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import type { Map } from 'leaflet'

interface RoutePoint {
  lat: number
  lng: number
  city: string
}

const TRUCK_AVG_SPEED = 70

const props = defineProps<{
  points: RoutePoint[]
}>()

const emit = defineEmits<{
  routeInfo: [{ distanceKm: number; durationHours: number }]
}>()

const mapEl = ref<HTMLElement | null>(null)
let mapInstance: Map | null = null

onMounted(async () => {
  if (!props.points?.length || !mapEl.value) return
  if (mapInstance) return

  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  mapInstance = L.map(mapEl.value, {
    zoomControl: true,
    scrollWheelZoom: true
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance)

  const coords = props.points.map((p) => `${p.lng},${p.lat}`).join(';')

  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
  )

  const data = await res.json()

  const latlngs = props.points.map((p) => [p.lat, p.lng] as [number, number])

  if (data.code === 'Ok') {
    const route = data.routes[0]

    const routeLayer = L.geoJSON(route.geometry, {
      style: { color: '#3B82F6', weight: 4, opacity: 0.9 }
    }).addTo(mapInstance)

    mapInstance.fitBounds(routeLayer.getBounds(), { padding: [30, 30] })

    const distanceKm = route.distance / 1000
    const durationHours = distanceKm / TRUCK_AVG_SPEED

    emit('routeInfo', { distanceKm, durationHours })
  } else {
    L.polyline(latlngs, { color: '#3B82F6', weight: 3 }).addTo(mapInstance)
    mapInstance.fitBounds(latlngs, { padding: [30, 30] })
  }

  const first = props.points[0]
  const last = props.points.at(-1)

  if (!mapInstance) return

  // origen
  if (first) {
    L.circleMarker([first.lat, first.lng], {
      radius: 8,
      fillColor: '#22C55E',
      color: '#fff',
      weight: 2,
      fillOpacity: 1
    })
      .bindTooltip(first.city)
      .addTo(mapInstance)
  }

  // destino (evita duplicar si hay solo 1 punto)
  if (last && last !== first) {
    L.circleMarker([last.lat, last.lng], {
      radius: 8,
      fillColor: '#EF4444',
      color: '#fff',
      weight: 2,
      fillOpacity: 1
    })
      .bindTooltip(last.city)
      .addTo(mapInstance)
  }

  // intermedios
  props.points.slice(1, -1).forEach((p) => {
    if (!mapInstance) return

    L.circleMarker([p.lat, p.lng], {
      radius: 5,
      fillColor: '#3B82F6',
      color: '#fff',
      weight: 2,
      fillOpacity: 1
    })
      .bindTooltip(p.city)
      .addTo(mapInstance)
  })

  await nextTick()

  setTimeout(() => {
    mapInstance?.invalidateSize()
  }, 200)
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <div ref="mapEl" class="h-full w-full rounded-lg" />
</template>
