<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TableColumn } from '@nuxt/ui'

// --- TIPOS ---
interface Trip {
  id: string
  driver: string
  vehicle: string
  status: 'En Ruta' | 'En Depósito' | 'Entregado'
  progress: number // 0 a 100%
  x: number // Coordenada X en el mapa (0-100)
  y: number // Coordenada Y en el mapa (0-100)
  destination: string
}

interface StockItem {
  id: string
  sku: string
  name: string
  total: number
  picked: number
  location: string
}

// --- ESTADO GLOBAL SIMULADO ---
const activeTab = ref('dashboard')
const isSidebarOpen = ref(true)

// Datos de Viajes (Flota)
const trips = ref<Trip[]>([
  {
    id: 'TR-101',
    driver: 'Juan P.',
    vehicle: 'Ford F-150',
    status: 'En Ruta',
    progress: 30,
    x: 20,
    y: 30,
    destination: 'Rosario'
  },
  {
    id: 'TR-102',
    driver: 'Ana G.',
    vehicle: 'Mercedes Actros',
    status: 'En Ruta',
    progress: 75,
    x: 80,
    y: 20,
    destination: 'Mendoza'
  },
  {
    id: 'TR-103',
    driver: 'Carlos M.',
    vehicle: 'VW Delivery',
    status: 'En Depósito',
    progress: 0,
    x: 50,
    y: 50,
    destination: 'Córdoba'
  },
  {
    id: 'TR-104',
    driver: 'Lucía R.',
    vehicle: 'Iveco Daily',
    status: 'Entregado',
    progress: 100,
    x: 90,
    y: 90,
    destination: 'Salta'
  }
])

// Datos de Depósito (Stock)
const stockItems = ref<StockItem[]>([
  {
    id: '1',
    sku: 'SKU-001',
    name: 'Neumáticos R15',
    total: 500,
    picked: 120,
    location: 'A-12'
  },
  {
    id: '2',
    sku: 'SKU-002',
    name: 'Aceite 5W30',
    total: 1200,
    picked: 800,
    location: 'B-04'
  },
  {
    id: '3',
    sku: 'SKU-003',
    name: 'Filtros de Aire',
    total: 300,
    picked: 50,
    location: 'C-01'
  },
  {
    id: '4',
    sku: 'SKU-004',
    name: 'Pastillas de Freno',
    total: 800,
    picked: 790,
    location: 'A-05'
  }
])

// --- LÓGICA DE NEGOCIO ---

// Simulación de movimiento en tiempo real (El "Corazón" de la demo)
let simulationInterval: any = null

const startSimulation = () => {
  simulationInterval = setInterval(() => {
    trips.value.forEach((trip) => {
      if (trip.status === 'En Ruta') {
        // Mover camión aleatoriamente hacia la derecha/abajo
        trip.x = Math.min(100, trip.x + Math.random() * 2)
        trip.y = Math.min(100, trip.y + Math.random() * 2)
        trip.progress = Math.min(100, trip.progress + 1)

        if (trip.progress >= 100) {
          trip.status = 'Entregado'
        }
      }
    })

    // Simular picking automático lento
    if (Math.random() > 0.7) {
      const item =
        stockItems.value[Math.floor(Math.random() * stockItems.value.length)]
      if (item.picked < item.total) item.picked++
    }
  }, 1000)
}

onMounted(() => {
  startSimulation()
})

onUnmounted(() => {
  clearInterval(simulationInterval)
})

// Acciones Manuales
const dispatchTrip = (trip: Trip) => {
  trip.status = 'En Ruta'
  trip.progress = 0
  trip.x = 10
  trip.y = 10
}

const pickItem = (item: StockItem) => {
  if (item.picked < item.total) {
    item.picked++
  }
}

const resetStock = (item: StockItem) => {
  item.picked = 0
}

// --- CONFIGURACIÓN DE TABLAS ---
const tripColumns: TableColumn<Trip>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'driver', header: 'Chofer' },
  { accessorKey: 'vehicle', header: 'Vehículo' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'progress', header: 'Progreso' },
  { accessorKey: 'actions', header: 'Acciones' }
]

const stockColumns: TableColumn<StockItem>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'name', header: 'Producto' },
  { accessorKey: 'location', header: 'Ubicación' },
  { accessorKey: 'picked', header: 'Picking' },
  { accessorKey: 'actions', header: 'Acción' }
]

// Helpers de UI
const getStatusColor = (status: string) => {
  switch (status) {
    case 'En Ruta':
      return 'primary'
    case 'En Depósito':
      return 'neutral'
    case 'Entregado':
      return 'success'
    default:
      return 'neutral'
  }
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return 'warning'
  if (progress < 70) return 'primary'
  return 'success'
}

// KPIs Calculados
const kpiActiveTrips = computed(
  () => trips.value.filter((t) => t.status === 'En Ruta').length
)
const kpiPendingStock = computed(() =>
  stockItems.value.reduce((acc, item) => acc + (item.total - item.picked), 0)
)
const kpiEfficiency = computed(() => {
  const total = stockItems.value.reduce((acc, i) => acc + i.total, 0)
  const picked = stockItems.value.reduce((acc, i) => acc + i.picked, 0)
  return total === 0 ? 0 : Math.round((picked / total) * 100)
})
</script>

<template>
  <div
    class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans"
  >
    <!-- SIDEBAR -->
    <aside
      :class="[
        'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col',
        isSidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <div
        class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-2 font-bold text-xl text-blue-600">
          <UIcon name="i-heroicons-cube-transparent" class="w-8 h-8" />
          <span v-if="isSidebarOpen">
            LOGI
            <span class="text-gray-800 dark:text-white">SAAS</span>
          </span>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <UButton
          v-for="tab in ['dashboard', 'mapa', 'deposito', 'flota']"
          :key="tab"
          :label="
            isSidebarOpen ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''
          "
          :icon="`i-heroicons-${tab === 'dashboard' ? 'chart-bar' : tab === 'mapa' ? 'map' : tab === 'deposito' ? 'building-storefront' : 'truck'}`"
          variant="ghost"
          class="w-full justify-start"
          :class="{
            'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400':
              activeTab === tab
          }"
          @click="activeTab = tab"
        />
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          class="w-full"
          @click="isSidebarOpen = !isSidebarOpen"
        />
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- TOP BAR -->
      <header
        class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6"
      >
        <h2 class="text-lg font-semibold capitalize">
          {{ activeTab }} Operativo
        </h2>
        <div class="flex items-center gap-4">
          <UBadge
            color="success"
            variant="soft"
            label="Sistema Online"
            class="animate-pulse"
          />
          <UAvatar src="https://i.pravatar.cc/100?img=3" size="sm" />
        </div>
      </header>

      <!-- SCROLLABLE AREA -->
      <div class="flex-1 overflow-auto p-6">
        <!-- VISTA: DASHBOARD -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UCard
              class="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-blue-100 text-sm">Viajes Activos</div>
                  <div class="text-4xl font-bold mt-2">
                    {{ kpiActiveTrips }}
                  </div>
                </div>
                <UIcon name="i-heroicons-truck" class="w-8 h-8 text-blue-200" />
              </div>
            </UCard>
            <UCard>
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-gray-500 text-sm">Eficiencia Picking</div>
                  <div
                    class="text-4xl font-bold mt-2 text-gray-800 dark:text-white"
                  >
                    {{ kpiEfficiency }}%
                  </div>
                </div>
                <UIcon
                  name="i-heroicons-clipboard-document-check"
                  class="w-8 h-8 text-orange-500"
                />
              </div>
              <UProgress :value="kpiEfficiency" color="warning" class="mt-4" />
            </UCard>
            <UCard>
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-gray-500 text-sm">Stock Pendiente</div>
                  <div
                    class="text-4xl font-bold mt-2 text-gray-800 dark:text-white"
                  >
                    {{ kpiPendingStock }}
                  </div>
                </div>
                <UIcon
                  name="i-heroicons-archive-box"
                  class="w-8 h-8 text-purple-500"
                />
              </div>
            </UCard>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <h3 class="font-bold">Actividad Reciente</h3>
              </template>
              <ul class="space-y-4">
                <li
                  v-for="i in 5"
                  :key="i"
                  class="flex items-center gap-3 text-sm"
                >
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  <span class="text-gray-600 dark:text-gray-300">
                    Viaje #TR-10{{ i }} actualizado estado a
                    <strong>En Ruta</strong>
                  </span>
                  <span class="ml-auto text-gray-400 text-xs">
                    {{ i }}m ago
                  </span>
                </li>
              </ul>
            </UCard>
            <UCard>
              <template #header>
                <h3 class="font-bold">Alertas de Stock</h3>
              </template>
              <div class="space-y-3">
                <div
                  v-for="item in stockItems.filter(
                    (i) => i.picked > i.total * 0.9
                  )"
                  :key="item.id"
                  class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <div>
                    <div
                      class="font-bold text-red-700 dark:text-red-400 text-sm"
                    >
                      {{ item.name }}
                    </div>
                    <div class="text-xs text-red-600 dark:text-red-300">
                      Quedan {{ item.total - item.picked }} unidades
                    </div>
                  </div>
                  <UButton size="xs" color="error" variant="solid">
                    Reponer
                  </UButton>
                </div>
                <div
                  v-if="
                    stockItems.filter((i) => i.picked > i.total * 0.9)
                      .length === 0
                  "
                  class="text-center text-gray-400 py-4"
                >
                  Todo el stock está saludable
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- VISTA: MAPA (TRACKING) -->
        <div v-if="activeTab === 'mapa'" class="h-full flex flex-col">
          <UCard
            class="flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-800 border-none shadow-inner"
          >
            <!-- Grid de fondo para simular mapa -->
            <div
              class="absolute inset-0 opacity-10"
              style="
                background-image: radial-gradient(#666 1px, transparent 1px);
                background-size: 20px 20px;
              "
            ></div>

            <!-- Marcadores de Camiones -->
            <div
              v-for="trip in trips"
              :key="trip.id"
              class="absolute transition-all duration-1000 ease-linear flex flex-col items-center group cursor-pointer"
              :style="{
                left: trip.x + '%',
                top: trip.y + '%',
                transform: 'translate(-50%, -50%)'
              }"
            >
              <div class="relative">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-700',
                    trip.status === 'En Ruta'
                      ? 'bg-blue-600 animate-bounce'
                      : 'bg-gray-500'
                  ]"
                >
                  <UIcon name="i-heroicons-truck" class="w-6 h-6 text-white" />
                </div>
                <!-- Tooltip -->
                <div
                  class="absolute bottom-full mb-2 hidden group-hover:block bg-white dark:bg-gray-700 p-2 rounded shadow-xl w-40 z-10 text-xs"
                >
                  <div class="font-bold">{{ trip.id }}</div>
                  <div>{{ trip.driver }}</div>
                  <div class="text-gray-500">{{ trip.destination }}</div>
                  <UProgress
                    :value="trip.progress"
                    size="xs"
                    class="mt-1"
                    :color="getProgressColor(trip.progress)"
                  />
                </div>
              </div>
              <span
                class="mt-1 bg-white/80 dark:bg-gray-900/80 px-2 py-0.5 rounded text-xs font-bold backdrop-blur-sm"
              >
                {{ trip.vehicle }}
              </span>
            </div>

            <!-- Controles Flotantes -->
            <div class="absolute bottom-6 right-6 flex flex-col gap-2">
              <UButton icon="i-heroicons-plus" color="neutral" shadow />
              <UButton icon="i-heroicons-minus" color="neutral" shadow />
              <UButton
                icon="i-heroicons-location-marker"
                color="neutral"
                shadow
              />
            </div>
          </UCard>
        </div>

        <!-- VISTA: DEPOSITO (PICKING) -->
        <div v-if="activeTab === 'deposito'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg">Órdenes de Picking Activas</h3>
            <UButton icon="i-heroicons-printer" variant="outline">
              Imprimir Lista
            </UButton>
          </div>

          <UTable :rows="stockItems" :columns="stockColumns" class="w-full">
            <template #picked-data="{ row }">
              <div class="flex items-center gap-3 w-48">
                <UProgress
                  :value="(row.picked / row.total) * 100"
                  size="md"
                  :color="row.picked / row.total > 0.8 ? 'success' : 'primary'"
                  class="flex-1"
                />
                <span class="text-xs font-mono w-12 text-right">
                  {{ row.picked }}/{{ row.total }}
                </span>
              </div>
            </template>
            <template #actions-data="{ row }">
              <UButton
                size="xs"
                :color="row.picked >= row.total ? 'gray' : 'green'"
                :disabled="row.picked >= row.total"
                @click="pickItem(row)"
              >
                {{ row.picked >= row.total ? 'Completo' : 'Picking +1' }}
              </UButton>
              <UButton
                size="xs"
                variant="ghost"
                color="red"
                icon="i-heroicons-arrow-path"
                @click="resetStock(row)"
              />
            </template>
          </UTable>
        </div>

        <!-- VISTA: FLOTA -->
        <div v-if="activeTab === 'flota'" class="space-y-4">
          <UTable :rows="trips" :columns="tripColumns">
            <template #status-data="{ row }">
              <UBadge :color="getStatusColor(row.status)" variant="subtle">
                {{ row.status }}
              </UBadge>
            </template>
            <template #progress-data="{ row }">
              <div class="w-32">
                <UProgress
                  :value="row.progress"
                  :color="getProgressColor(row.progress)"
                />
              </div>
            </template>
            <template #actions-data="{ row }">
              <UButton
                v-if="row.status !== 'En Ruta'"
                size="xs"
                color="info"
                variant="outline"
                @click="dispatchTrip(row)"
              >
                Despachar
              </UButton>
              <span v-else class="text-xs text-gray-400">En movimiento...</span>
            </template>
          </UTable>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Animaciones custom para la demo */
@keyframes pulse-dot {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
</style>
