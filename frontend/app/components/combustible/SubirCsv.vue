<script setup lang="ts">
import { sub } from 'date-fns'
import { useFileParser } from '~/composables/useFileParser'
import { useCombustibleImporter } from '~/composables/combustible/useCombustibleImporter'
import { useCombustibleBatchSubmit } from '~/composables/combustible/useCombustibleBatchSubmit'

import DateRangePicker from '~/components/compras/FiltroDateCompras.vue'
import {
  parseExcelDate,
  startOfDay,
  endOfDay
} from '~/composables/useExcelDate'

// ===== Model =====
const open = defineModel<boolean>({ required: true })

// ===== Composables =====
const { parseFile } = useFileParser()
const { processRows } = useCombustibleImporter()

const { submitBatch, running, progress, currentRow } =
  useCombustibleBatchSubmit()

// ===== State =====
const file = ref<File | null>(null)
const loading = ref(false)
const result = ref<any>(null)
const error = ref<string | null>(null)

// ⬅️ filas originales del archivo (FUENTE ÚNICA)
const rawRows = ref<any[][] | null>(null)

// ⬅️ Date range
const dateRange = shallowRef<DateRange>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})

// Simulación de claves existentes
const existingKeys = new Set<string>([])

/* =========================
 * Filtro por rango de fechas
 * ========================= */
const filterRowsByDateRange = (rows: any[][]): any[][] => {
  if (!dateRange.value.start || !dateRange.value.end) return rows

  const from = startOfDay(dateRange.value.start)
  const to = endOfDay(dateRange.value.end)

  return rows.filter((row, index) => {
    // mantener header
    if (index === 0) return true
    if (!Array.isArray(row)) return false

    const date = parseExcelDate(row[0])
    if (!date) return false

    return date >= from && date <= to
  })
}

/* =========================
 * Recalcular preview
 * ========================= */
const recalculate = () => {
  if (!rawRows.value) return

  const filteredRows = filterRowsByDateRange(rawRows.value)
  result.value = processRows(filteredRows, existingKeys)
}

/* =========================
 * File handler
 * ========================= */
const onFileChange = async (files: FileList | null) => {
  if (!files || !files.length) return

  file.value = files[0]
  loading.value = true
  error.value = null
  result.value = null

  try {
    const parsed = await parseFile(file.value)
    rawRows.value = parsed.rows

    // ⬅️ primer cálculo
    recalculate()
  } catch (err: any) {
    error.value = err.message || 'Error procesando el archivo'
  } finally {
    loading.value = false
  }
}

/* =========================
 * Recalcular al cambiar fecha
 * ========================= */
watch(
  dateRange,
  () => {
    recalculate()
  },
  { deep: true }
)

/* =========================
 * Confirm import
 * ========================= */
const onConfirmImport = async () => {
  if (!result.value?.valid?.length) return

  try {
    await submitBatch(result.value.valid)
    open.value = false
  } catch (e: any) {
    error.value = e.message ?? 'Error durante la importación'
  }
}

/* =========================
 * Reset
 * ========================= */
const resetState = () => {
  file.value = null
  rawRows.value = null
  result.value = null
  error.value = null
}

watch(open, (isOpen) => {
  if (!isOpen) resetState()
})

/* =========================
 * Accordion
 * ========================= */
const accordionItems = computed(() => [
  {
    label: `Válidos (${result.value?.summary.valid || 0})`,
    disabled: !result.value?.summary.valid
  },
  {
    label: `Duplicados (${result.value?.summary.duplicated || 0})`,
    disabled: !result.value?.summary.duplicated
  },
  {
    label: `Inválidos (${result.value?.summary.invalid || 0})`,
    disabled: !result.value?.summary.invalid
  }
])
onMounted(async () => {
  const perfiles = usePerfiles()
  await perfiles.load(undefined, true)
})
</script>

<template>
  <UModal v-model:open="open">
    <template #header>
      <h2 class="text-lg font-semibold">Importar combustible</h2>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- Date picker -->
        <DateRangePicker v-model="dateRange" class="-ms-1" />

        <!-- File input -->
        <UInput
          type="file"
          accept=".xlsx,.csv,.json"
          @change="onFileChange(($event.target as HTMLInputElement).files)"
        />

        <!-- Loader -->
        <UAlert v-if="loading" title="Procesando archivo..." color="neutral" />

        <!-- Error -->
        <UAlert v-if="error" color="error" :title="error" />

        <!-- Resultado -->
        <UAccordion v-if="result" :items="accordionItems">
          <template #content="{ index }">
            <!-- VÁLIDOS -->
            <div v-if="index === 0">
              <ul class="text-sm">
                <li
                  v-for="r in result.valid"
                  :key="r._key"
                  class="border-b py-1"
                >
                  {{ r.fecha }} – {{ r.patente }} – {{ r.chofer }}
                  <span
                    class="ml-2 px-2 py-0.5 rounded text-xs"
                    :class="
                      r.tipo === 'CARGA'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    "
                  >
                    {{ r.tipo }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- DUPLICADOS -->
            <div v-else-if="index === 1">
              <ul class="text-sm text-yellow-700">
                <li
                  v-for="r in result.duplicated"
                  :key="r._rowIndex"
                  class="border-b py-1"
                >
                  {{ r.fecha }} – {{ r.patente }} – {{ r.chofer }}
                </li>
              </ul>
            </div>

            <!-- INVÁLIDOS -->
            <div v-else-if="index === 2">
              <ul class="text-sm text-red-700">
                <li
                  v-for="r in result.invalid"
                  :key="r._rowIndex"
                  class="border-b py-1"
                >
                  Fila {{ r._rowIndex }} – Datos inválidos
                </li>
              </ul>
            </div>
          </template>
        </UAccordion>
      </div>
      <UProgress v-if="running" :value="progress" />

      <p v-if="currentRow" class="text-sm text-gray-500">
        Procesando fila {{ currentRow }}
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="soft"
          @click="open = false"
        />

        <UButton
          label="Importar"
          color="primary"
          :disabled="!result?.valid?.length || running"
          @click="onConfirmImport"
        />
      </div>
    </template>
    <UAlert v-if="error" color="error" :title="error" />
  </UModal>
</template>

<!-- @click="onConfirmImport" -->
