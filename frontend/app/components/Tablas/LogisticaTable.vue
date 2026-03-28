<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch, onMounted } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useDebounceFn } from '@vueuse/core'
import type { TableColumn } from '@nuxt/ui'
import type { ComponentPublicInstance } from 'vue'

import DeleteConfirmModal from './DeleteConfirmModal.vue'
import TableSelectionBar from './TableSelectionBar.vue'
import DateRangePicker, {
  type DateRange
} from '@/components/compras/FiltroDateCompras.vue'

/* ========================
   Tipos
======================== */
type FilterType = 'text' | 'date-range'

type ExtendedColumn<T> = TableColumn<T> & {
  accessorKey?: string
  meta?: {
    filterType?: FilterType
  }
}
interface TableApi<T> {
  getState: () => {
    pagination: {
      pageIndex: number
      pageSize: number
    }
  }

  setPageIndex: (index: number) => void

  getFilteredSelectedRowModel: () => {
    rows: Array<{ original: T }>
  }

  getFilteredRowModel: () => {
    rows: Array<{ original: T }>
  }

  getColumn: (id: string) =>
    | {
        setFilterValue: (v: unknown) => void
      }
    | undefined

  setGlobalFilter: (v: unknown) => void
}
interface UTableInstance<T> extends ComponentPublicInstance {
  tableApi: TableApi<T> | null
}

/* ========================
   Props / Emits
======================== */
const props = defineProps<{
  data: T[]
  columns: ExtendedColumn<T>[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'delete:rows': [rows: T[]]
}>()

/* ========================
   Tabla
======================== */
const table = useTemplateRef<UTableInstance<T>>('table')
const rowSelection = ref<Record<string, boolean>>({})
const showDeleteModal = ref(false)

/* ========================
   Filtros dinámicos
======================== */
const selectedColumn = ref<string>('__global__')

const searchText = ref<string>('')

const searchRange = ref<DateRange>({
  start: new Date(),
  end: new Date()
})

const columnFilters = ref<any[]>([])
const globalFilter = ref<string>('')

const filterableColumns = computed(() =>
  props.columns
    .filter((c) => c.accessorKey)
    .map((c) => ({
      label: String((c as any).header ?? c.accessorKey),
      value: String(c.accessorKey)
    }))
)

const columnOptions = computed(() => [
  { label: 'Todas', value: '__global__' },
  ...filterableColumns.value
])

const selectedColumnDef = computed(() =>
  props.columns.find((c) => c.accessorKey === selectedColumn.value)
)

const isDateRangeFilter = computed(
  () => selectedColumnDef.value?.meta?.filterType === 'date-range'
)

/* ========================
   Aplicar filtros texto
======================== */
function applyTextFilter(value: string, column: string) {
  const api = table.value?.tableApi
  if (!api) return

  if (column === '__global__') {
    filterableColumns.value.forEach((c) => {
      api.getColumn(c.value)?.setFilterValue(undefined)
    })
    globalFilter.value = value
    return
  }

  globalFilter.value = ''

  filterableColumns.value.forEach((c) => {
    if (c.value !== column) {
      api.getColumn(c.value)?.setFilterValue(undefined)
    }
  })

  api.getColumn(column)?.setFilterValue(value || undefined)
}

/* ========================
   Aplicar filtros fecha rango
======================== */
function applyDateRangeFilter(column: string, range: DateRange) {
  const api = table.value?.tableApi
  if (!api) return

  globalFilter.value = ''

  filterableColumns.value.forEach((c) => {
    if (c.value !== column) {
      api.getColumn(c.value)?.setFilterValue(undefined)
    }
  })

  api.getColumn(column)?.setFilterValue({
    start: range.start,
    end: range.end
  })
}

/* ========================
   Debounce texto
======================== */
const DEBOUNCE_MS = 300

const applyTextFilterDebounced = useDebounceFn(
  (v: string, c: string) => applyTextFilter(v, c),
  DEBOUNCE_MS
)

/* ========================
   Watchers
======================== */
watch([searchText, selectedColumn], ([v, c]) => {
  if (isDateRangeFilter.value) return
  applyTextFilterDebounced(v, c)
})

watch(
  [searchRange, selectedColumn],
  ([range, col]) => {
    if (!isDateRangeFilter.value) return
    applyDateRangeFilter(col, range)
  },
  { deep: true }
)

watch(selectedColumn, () => {
  searchText.value = ''
  searchRange.value = { start: new Date(), end: new Date() }
})

onMounted(() => {
  applyTextFilter('', selectedColumn.value)
})

watch(
  () => table.value?.tableApi,
  (api) => {
    if (!api) return
    applyTextFilter('', selectedColumn.value)
  },
  { immediate: true }
)

watch(
  () => props.data,
  () => applyTextFilter('', selectedColumn.value)
)

/* ========================
   Selección
======================== */
const selectedRows = computed<T[]>(
  () =>
    table.value?.tableApi
      ?.getFilteredSelectedRowModel()
      .rows.map((r) => r.original) ?? []
)

const selectedCount = computed<number>(() => selectedRows.value.length)

const totalCount = computed<number>(
  () => table.value?.tableApi?.getFilteredRowModel().rows.length ?? 0
)

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

/* ========================
   Acciones
======================== */
function confirmDelete(): void {
  emit('delete:rows', selectedRows.value)
  rowSelection.value = {}
  showDeleteModal.value = false
}
</script>

<template>
  <div class="flex-1 w-full pb-20">
    <!-- Buscador dinámico -->
    <div class="flex items-center gap-2 px-4 py-3.5 border-b border-accented">
      <USelect v-model="selectedColumn" :items="columnOptions" class="w-44" />

      <!-- Texto -->
      <UInput
        v-if="!isDateRangeFilter"
        v-model="searchText"
        placeholder="Buscar..."
        class="max-w-sm"
        icon="i-lucide-search"
      />

      <!-- Rango fechas -->
      <DateRangePicker v-else v-model="searchRange" />
    </div>

    <!-- Tabla -->
    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:row-selection="rowSelection"
      v-model:column-filters="columnFilters"
      v-model:global-filter="globalFilter"
      sticky
      :data="props.data"
      :columns="props.columns"
      :loading="props.loading"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      :class="[
        'border border-default',
        selectedCount > 0 ? 'rounded-b-lg rounded-t-none' : 'rounded-lg'
      ]"
    />

    <!-- Footer -->

    <div
      class="flex items-center justify-between border-t border-default bg-muted/30 px-4 py-2"
    >
      <div class="text-xs text-muted">
        {{ selectedCount }} seleccionadas • {{ totalCount }} totales
      </div>
      <UPagination
        size="sm"
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="totalCount"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
    <!-- Barra selección -->
    <TableSelectionBar
      :count="selectedCount"
      @open-delete="showDeleteModal = true"
    />

    <!-- Modal eliminar -->
    <DeleteConfirmModal
      :open="showDeleteModal"
      :count="selectedCount"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>
