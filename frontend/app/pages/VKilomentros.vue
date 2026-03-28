<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import { ref, computed } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useKilometrosStore } from '@/stores/useKilometrosStore'
import DialogEnvioFlow from '@/components/kilometros/DialogEnvioFlow.vue'

const csvStore = useKilometrosStore()
const fileInput = ref<File | null>(null)

// ✅ Solución: Usar any para evitar errores de tipado
const table = useTemplateRef<any>('table')

const selectedCamiones = ref<string[]>([])
const dialogEnvio = ref(false)
const downloadMenu = ref(false)
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const headers = [
  {
    accessorKey: 'id',
    header: '#'
  },
  {
    accessorKey: 'descripcion',
    header: 'Patente'
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha'
  },
  {
    accessorKey: 'kilometros',
    header: 'Kilómetros'
  }
]

// ✅ Computed properties para la paginación (solución más limpia)
const currentPage = computed(
  () => (table.value?.tableApi?.getState().pagination.pageIndex ?? 0) + 1
)

const itemsPerPage = computed(
  () => table.value?.tableApi?.getState().pagination.pageSize ?? 10
)

const totalItems = computed(
  () => table.value?.tableApi?.getFilteredRowModel().rows.length ?? 0
)

const handlePageChange = (page: number) => {
  table.value?.tableApi?.setPageIndex(page - 1)
}

const selectedCamionesForSelect = computed({
  get: () => selectedCamiones.value.map((p) => ({ label: p, value: p })),
  set: (vals: { label: string; value: string }[]) => {
    selectedCamiones.value = vals.map((v) => v.value)
  }
})

async function handleFileUpload(event: any) {
  const file = event?.target?.files?.[0]
  if (!file) return
  await csvStore.loadFile(file)

  if (csvStore.detectedPairs.length > 0) {
    selectedCamiones.value = csvStore.detectedPairs.map((p) => p.patente)
  }
}

const filteredData = computed(() => {
  let data = csvStore.transformedData

  if (selectedCamiones.value.length > 0) {
    data = data.filter((row) =>
      selectedCamiones.value.includes(row.descripcion)
    )
  }
  console.log(data)
  return data
})

const camionesOptions = computed(() =>
  csvStore.detectedPairs.map((pair) => ({
    label: `${pair.camion} (${pair.patente})`,
    value: pair.patente
  }))
)

const isSelected = (patente: string) => {
  return selectedCamiones.value.includes(patente)
}

const selectedItems = computed(() => {
  return camionesOptions.value.filter((option) =>
    selectedCamiones.value.includes(option.value)
  )
})

const toggleItem = (item: { label: string; value: string }) => {
  const index = selectedCamiones.value.indexOf(item.value)
  if (index === -1) {
    selectedCamiones.value.push(item.value)
  } else {
    selectedCamiones.value.splice(index, 1)
  }
}

const removeItem = (patente: string) => {
  selectedCamiones.value = selectedCamiones.value.filter((p) => p !== patente)
}

function toggleSelectAll() {
  if (selectedCamiones.value.length === csvStore.detectedPairs.length) {
    selectedCamiones.value = []
  } else {
    selectedCamiones.value = csvStore.detectedPairs.map((p) => p.patente)
  }
}

function resetAndLoadNew() {
  csvStore.reset()
  selectedCamiones.value = []
  fileInput.value = null
}

function downloadCSV() {
  csvStore.exportCSV(filteredData.value)
  downloadMenu.value = false
}

function downloadXLSX() {
  csvStore.exportXLSX(filteredData.value)
  downloadMenu.value = false
}

function downloadJSON() {
  csvStore.exportJSON(filteredData.value)
  downloadMenu.value = false
}

const filteredPairs = computed(() =>
  csvStore.detectedPairs.filter((pair) =>
    selectedCamiones.value.includes(pair.patente)
  )
)

const rows = computed(() => filteredData.value)

const handleTransform = () => {
  csvStore.transformData()
}

const hasLoadedFile = computed(() => csvStore.csvData.length > 0)
const hasTransformedData = computed(() => csvStore.transformedData.length > 0)
const hasPairsDetected = computed(() => csvStore.detectedPairs.length > 0)
</script>

<template>
  <UDashboardPanel id="kilometros">
    <template #header>
      <UDashboardNavbar title="Kilómetros" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        class="p-8 max-w-6xl mx-auto bg-background-color-default rounded-2xl shadow-xl w-full"
      >
        <h1 class="text-3xl font-bold mb-2">🚚 Kilómetros</h1>
        <p class="text-color-dimmed mb-6">
          Convierte automáticamente tu CSV de kilómetros en formato de flujo.
        </p>

        <!-- Subir Archivo -->
        <div v-if="!hasLoadedFile" class="mb-6">
          <label
            class="block p-6 border-2 border-dashed border-color-default rounded-xl cursor-pointer hover:border-primary-500 transition"
          >
            <div class="text-center text-gray-500">
              Haz click para cargar tu CSV o Excel
            </div>
            <input
              type="file"
              class="hidden"
              accept=".csv,.xlsx,.xls"
              @change="handleFileUpload"
            />
          </label>
        </div>

        <!-- Éxito al cargar -->
        <UAlert
          v-if="hasLoadedFile && !hasTransformedData && !csvStore.loading"
          title="✅ Archivo cargado correctamente"
          :description="`${csvStore.csvData.length} filas detectadas`"
          color="success"
          variant="soft"
          class="mb-6"
          :actions="[
            {
              label: 'Cargar otro archivo',
              color: 'info',
              variant: 'outline',
              size: 'sm',
              onClick: resetAndLoadNew
            }
          ]"
        />

        <!-- Error -->
        <UAlert
          v-if="csvStore.error"
          :title="csvStore.error"
          color="error"
          variant="soft"
          class="mb-4"
          closable
          @close="csvStore.error = null"
        />

        <!-- Cargando -->
        <div v-if="csvStore.loading" class="text-center mb-8">
          <UProgress animation="swing" size="lg" class="w-40 mx-auto" />
          <p class="mt-3 text-gray-500">Procesando archivo...</p>
        </div>

        <!-- Selector de camiones -->
        <div v-if="hasPairsDetected" class="mb-6">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-semibold">🚚 Seleccionar Camiones</span>
                <UButton size="xs" variant="ghost" @click="toggleSelectAll">
                  {{
                    selectedCamiones.length === csvStore.detectedPairs.length
                      ? 'Deseleccionar'
                      : 'Seleccionar'
                  }}
                  todos
                </UButton>
              </div>
            </template>
            <UPopover :ui="{ content: 'w-(--reka-popper-anchor-width) p-4' }">
              <UButton
                variant="outline"
                color="primary"
                class="w-full justify-start min-h-[38px] h-auto py-1.5"
                block
              >
                <div class="flex items-center gap-1 flex-wrap w-full">
                  <template v-if="selectedItems.length === 0">
                    <span class="text-gray-400">🚚 Seleccione camiones</span>
                  </template>
                  <UBadge
                    v-for="item in selectedItems"
                    :key="item.value"
                    variant="soft"
                    size="sm"
                    class="my-0.5"
                  >
                    {{ item.label }}
                    <button
                      class="ml-1 hover:text-red-500 font-bold"
                      @click.stop="removeItem(item.value)"
                    >
                      ×
                    </button>
                  </UBadge>
                </div>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="ml-auto shrink-0"
                />
              </UButton>

              <template #content="{ close }">
                <div class="p-2 max-h-64 overflow-y-auto w-full">
                  <div class="space-y-1">
                    <button
                      v-for="item in camionesOptions"
                      :key="item.value"
                      class="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center justify-between"
                      @click="toggleItem(item)"
                    >
                      <UBadge variant="soft">
                        {{ item.label }}
                      </UBadge>
                      <UIcon
                        v-if="isSelected(item.value)"
                        name="i-heroicons-check-20-solid"
                        class="text-primary"
                      />
                    </button>
                  </div>
                </div>
              </template>
            </UPopover>
            <UAlert
              v-if="selectedCamiones.length === 0"
              color="warning"
              variant="soft"
              class="mt-3"
              title="No se seleccionaron camiones"
            />
          </UCard>
        </div>

        <!-- Botón Transformar -->
        <UButton
          v-if="
            hasLoadedFile && !hasTransformedData && selectedCamiones.length > 0
          "
          class="w-full mb-6"
          size="lg"
          color="info"
          @click="handleTransform"
        >
          Transformar Datos ({{ selectedCamiones.length }} camiones)
        </UButton>

        <!-- Tabla -->
        <div v-if="hasTransformedData" class="mt-6">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-semibold">
                  ✅ Datos filtrados ({{ filteredData.length }} /
                  {{ csvStore.transformedData.length }})
                </span>

                <div class="flex gap-2">
                  <UButton
                    color="info"
                    variant="outline"
                    size="xs"
                    :disabled="filteredData.length === 0"
                    @click="dialogEnvio = true"
                  >
                    Enviar a Flow
                  </UButton>

                  <UPopover
                    v-model:open="downloadMenu"
                    :popper="{ placement: 'bottom-end' }"
                  >
                    <UButton color="secondary" variant="outline" size="xs">
                      Descargar ▼
                    </UButton>

                    <template #content>
                      <div class="p-2 space-y-1">
                        <UButton variant="ghost" block @click="downloadCSV">
                          CSV
                        </UButton>
                        <UButton variant="ghost" block @click="downloadXLSX">
                          Excel
                        </UButton>
                        <UButton variant="ghost" block @click="downloadJSON">
                          JSON
                        </UButton>
                      </div>
                    </template>
                  </UPopover>
                </div>
              </div>
            </template>

            <UTable
              ref="table"
              v-model:pagination="pagination"
              :columns="headers"
              :data="filteredData"
              :pagination-options="{
                getPaginationRowModel: getPaginationRowModel()
              }"
              loading-animation="carousel"
            />

            <!-- ✅ Paginación mejorada con computed properties -->
            <div class="flex justify-center border-t border-default pt-4 mt-4">
              <UPagination
                :default-page="currentPage"
                :items-per-page="itemsPerPage"
                :total="totalItems"
                @update:page="handlePageChange"
              />
            </div>
          </UCard>

          <!-- Resumen -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <UCard v-for="pair in filteredPairs" :key="pair.patente">
              <div class="text-sm text-gray-500 mb-1">
                {{ pair.camion }}
              </div>
              <div class="text-xl font-bold text-primary-200">
                {{
                  csvStore.transformedData
                    .filter((d) => d.descripcion === pair.patente)
                    .reduce((sum, d) => sum + Number(d.kilometros), 0)
                    .toFixed(2)
                }}
                km
              </div>
              <div class="text-sm text-gray-400">
                {{
                  csvStore.transformedData.filter(
                    (d) => d.descripcion === pair.patente
                  ).length
                }}
                registros
              </div>
            </UCard>
          </div>

          <!-- Reset -->
          <div class="text-center mt-6">
            <UButton variant="outline" color="info" @click="resetAndLoadNew">
              Cargar otro archivo
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <UModal
    v-model:open="dialogEnvio"
    title="Enviando registros a Flow"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }"
  >
    <template #body>
      <DialogEnvioFlow :registros="filteredData" />
    </template>
  </UModal>
</template>
