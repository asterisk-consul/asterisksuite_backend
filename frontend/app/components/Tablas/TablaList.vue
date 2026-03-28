//HOLA
<script setup lang="ts">
import {
  h,
  resolveComponent,
  computed,
  ref,
  onMounted,
  watch,
  nextTick,
  shallowRef
} from 'vue'
import {
  getPaginationRowModel,
  getFilteredRowModel,
  type FilterFn
} from '@tanstack/vue-table'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import { useDraggable } from 'vue-draggable-plus'
import FiltroDateCompras from '../compras/FiltroDateCompras.vue'
import { sub } from 'date-fns'

/* UI */
const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')
const UKbd = resolveComponent('UKbd')
const UIcon = resolveComponent('UIcon')
const UInput = resolveComponent('UInput')
const USelectMenu = resolveComponent('USelectMenu')

/* PROPS */
const props = defineProps<{
  data: {
    rows: Record<string, any>[]
    total: number
  } | null
  loading?: boolean
  selectable?: boolean
  deletable?: boolean
  tableKey: string
  pageSize?: number
}>()

/* EMITS */
const emit = defineEmits<{
  (e: 'delete-selected', rows: any[]): void
  (e: 'reorder', rows: any[]): void
}>()

/* ESTADO */
const tableRef = ref<any>(null)
const rowSelection = ref({})
const pagination = ref({
  pageIndex: 0,
  pageSize: props.pageSize || 10
})

/* RANGO DE FECHAS */
const range = shallowRef<DateRange>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})

/* COLUMNA DE FECHA A FILTRAR */
const dateColumn = ref<{ label: string; value: string }>({
  label: 'Sin Filtro',
  value: 'sinFiltro'
})

const dateColumns = [
  { label: 'Sin Filtro', value: 'sinFiltro' },
  { label: 'Fecha', value: 'fecha' },
  { label: 'Fecha compromiso', value: 'fechacompromiso' },
  { label: 'Fecha vencimiento', value: 'fechavencimiento' },
  { label: 'Creación', value: 'creationdate' }
]

/* BÚSQUEDA */
const searchScopes = ref<string[]>([])
const searchQuery = ref('')

const searchColumns = [
  { label: 'ID', value: 'id' },
  { label: 'Cliente', value: 'clientname' },
  { label: 'Referencia', value: 'referenciatexto' },
  { label: 'Total', value: 'total' }
]
const useGlobalSearch = computed(() => {
  return searchScopes.value.length === 0
})

/* FILTRO FECHA (TanStack) */
const dateRangeFilter: FilterFn<any> = (row, columnId, value) => {
  if (!value?.start || !value?.end) return true
  const raw = row.getValue(columnId)
  if (!raw) return false
  const d = new Date(raw)
  return d >= value.start && d <= value.end
}

/* FILTROS DERIVADOS */
const globalFilter = computed(() =>
  useGlobalSearch.value ? searchQuery.value : ''
)
const columnFilters = computed(() => {
  const filters: { id: string; value: unknown }[] = []

  // 🔹 Filtro de fecha
  if (
    dateColumn.value.value !== 'sinFiltro' &&
    range.value?.start &&
    range.value?.end
  ) {
    filters.push({
      id: dateColumn.value.value,
      value: range.value
    })
  }

  // 🔹 Búsqueda avanzada OR
  if (
    !useGlobalSearch.value &&
    searchQuery.value &&
    searchScopes.value.length
  ) {
    filters.push({
      id: 'multiSearch',
      value: {
        query: searchQuery.value,
        scopes: searchScopes.value
      }
    })
  }

  return filters
})

/* DATA LOCAL (para drag) */
const tableData = ref([...(props.data?.rows || [])])

watch(
  () => props.data?.rows,
  (rows) => {
    tableData.value = [...(rows || [])]
  },
  { deep: true }
)

/* COLUMNAS */
const DRAG_COLUMN: TableColumn<any> = {
  id: 'drag',
  header: '',
  cell: () =>
    h('div', { class: 'drag-handle cursor-grab flex justify-center' }, [
      h(UIcon, {
        name: 'i-lucide-grip-vertical',
        class: 'w-5 h-5 text-gray-400'
      })
    ])
}

const SELECT_COLUMN: TableColumn<any> = {
  id: 'select',
  header: ({ table }) =>
    h(UCheckbox, {
      modelValue: table.getIsSomePageRowsSelected()
        ? 'indeterminate'
        : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (v) => table.toggleAllPageRowsSelected(!!v)
    }),
  cell: ({ row }) =>
    h(UCheckbox, {
      modelValue: row.getIsSelected(),
      'onUpdate:modelValue': (v) => row.toggleSelected(!!v)
    })
}

const DATA_COLUMNS: TableColumn<any>[] = [
  { accessorKey: 'auditorid', header: 'Auditor' },
  { accessorKey: 'clientid', header: 'Cliente id' },
  { accessorKey: 'clientname', header: 'Cliente' },
  {
    accessorKey: 'creationdate',
    header: 'Creación',
    filterFn: dateRangeFilter
  },
  { accessorKey: 'descrip', header: 'Descripción' },
  { accessorKey: 'ejecutorid', header: 'Ejecutor' },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    filterFn: dateRangeFilter
  },
  {
    accessorKey: 'fechacompromiso',
    header: 'Fecha compromiso',
    filterFn: dateRangeFilter
  },
  { accessorKey: 'id', header: 'ID' },

  { accessorKey: 'parteinteresadatipo', header: 'Parte interesado tipo' },
  { accessorKey: 'procesoid', header: 'Proceso id' },
  { accessorKey: 'puestotrabajo', header: 'Puesto de trabajo' },
  { accessorKey: 'referenciatexto', header: 'Referencia' },
  { accessorKey: 'totalimpuestos', header: 'Total impuestos' },
  { accessorKey: 'totalprecio', header: 'Total precio' },
  { accessorKey: 'vendedorid', header: 'Vendedor id' }
]

const multiColumnSearchFilter: FilterFn<any> = (row, _columnId, value) => {
  const { query, scopes } = value || {}
  if (!query || !scopes?.length) return true

  const q = String(query).toLowerCase()

  return scopes.some((scope: any) => {
    const columnId = typeof scope === 'string' ? scope : scope?.value // ← clave real

    if (!columnId) return false

    const cell = row.getValue(columnId)
    return String(cell ?? '')
      .toLowerCase()
      .includes(q)
  })
}

const SEARCH_COLUMN: TableColumn<any> = {
  id: 'multiSearch',
  header: '',
  filterFn: multiColumnSearchFilter
}

/* COLUMNAS VISIBLES & REORDENAMIENTO */
// Estado local de las columnas de datos para permitir reordenamiento y visibilidad
  const dataColumns = ref(
    DATA_COLUMNS.map((c) => ({
      ...c,
      p_visible: true,
      id: c.accessorKey,
      // Render function para el header: Icono + Texto
      header: ({ column }: any) =>
        h('div', { class: 'flex items-center gap-1' }, [
          h(UIcon, {
            name: 'i-lucide-grip-vertical',
            class:
              'col-drag-handle w-4 h-4 text-gray-400 cursor-grab opacity-50 hover:opacity-100'
          }),
          h('span', typeof c.header === 'function' ? c.header : c.header)
        ])
    }))
  )

// Actualizar visibilidad
const updateColumnVisibility = (col: any, val: boolean) => {
  col.p_visible = val
}

const tableColumns = computed(() => {
  const cols = []

  // 1. Columna Drag (siempre primera)
  cols.push(DRAG_COLUMN)

  // 2. Columna de Búsqueda (Lógica interna del usuario)
  cols.push(SEARCH_COLUMN)

  // 3. Columna Select (siempre visible si se requiere)
  if (props.selectable) cols.push(SELECT_COLUMN)

  // 4. Columnas de Datos (según orden y visibilidad en dataColumns)
  dataColumns.value.forEach((Col) => {
    if (Col.p_visible) {
      cols.push(Col)
    }
  })

  return cols
})

/* DRAG */
// Drag de Filas
onMounted(async () => {
  await nextTick()
  const tbody = tableRef.value?.$el.querySelector('tbody')
  if (tbody) {
    useDraggable(tbody, tableData, {
      handle: '.drag-handle',
      draggable: 'tr',
      animation: 150,
      onEnd: () => emit('reorder', tableData.value)
    })
  }
})

// Drag de Columnas (Headers)
onMounted(async () => {
  await nextTick()

  const headerRow = tableRef.value?.$el.querySelector('thead tr')
  if (!headerRow) return

  useDraggable(headerRow, dataColumns, {
    handle: '.col-drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost',

    // Solo permitir drag horizontal
    direction: 'horizontal',

    onMove: (evt) => {
      // Bloquear columnas fijas
      const fixedCount =
        1 + // drag
        1 + // search
        (props.selectable ? 1 : 0)

      if (!evt.relatedContext) return true

      // Solo prohibir mover HACIA las columnas fijas (izquierda)
      const targetIndex = evt.relatedContext.index
      return targetIndex >= fixedCount
    },

    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt

      console.log('DRAG END', { oldIndex, newIndex })

      const fixedCount =
        1 + // drag
        1 + // search
        (props.selectable ? 1 : 0)

      const realOldIndex = (oldIndex || 0) - fixedCount
      const realNewIndex = (newIndex || 0) - fixedCount

      console.log('REAL INDICES', {
        realOldIndex,
        realNewIndex,
        total: dataColumns.value.length
      })

      if (
        realOldIndex < 0 ||
        realNewIndex < 0 ||
        realOldIndex === realNewIndex ||
        realOldIndex >= dataColumns.value.length ||
        realNewIndex >= dataColumns.value.length
      ) {
        console.warn('Índices inválidos para reordenar', {
          realOldIndex,
          realNewIndex
        })
        return
      }

      // Reordenar
      const newData = [...dataColumns.value]
      const [moved] = newData.splice(realOldIndex, 1)
      newData.splice(realNewIndex, 0, moved)
      dataColumns.value = newData

      console.log('Reordenamiento aplicado.')
    }
  })
})

/* SELECCIÓN */
const selectedCount = computed(() => Object.keys(rowSelection.value).length)

const handleDeleteConfirm = () => {
  const selectedRows =
    tableRef.value?.tableApi
      ?.getSelectedRowModel()
      .rows.map((r: any) => r.original) || []
  emit('delete-selected', selectedRows)
  rowSelection.value = {}
}

/* PAGINACIÓN */
const getPaginationInfo = () => {
  const table = tableRef.value?.tableApi
  if (!table) return { page: 1, size: 10, total: 0 }

  return {
    page: table.getState().pagination.pageIndex + 1,
    size: table.getState().pagination.pageSize,
    total: props.data?.total || 0
  }
}
watch(
  () => props.data?.rows,
  (rows) => {
    tableData.value = [...(rows || [])]

    nextTick(() => {
      pagination.value.pageIndex = 0
      tableRef.value?.tableApi?.setPageIndex(0)
    })
  }
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-end gap-4">
      <TablasDeleteModal
        v-if="deletable && selectable"
        :count="selectedCount"
        @confirm="handleDeleteConfirm"
      >
        <UButton
          v-show="selectedCount > 0"
          label="Eliminar"
          color="error"
          variant="subtle"
          icon="i-lucide-trash"
        >
          <template #trailing>
            <UKbd>{{ selectedCount }}</UKbd>
          </template>
        </UButton>
      </TablasDeleteModal>

      <UPopover :ui="{ width: 'w-72', ring: '', shadow: 'shadow-xl' }">
        <UButton
          label="Columnas"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-columns"
        />

        <template #content>
          <div
            class="p-4 space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
          >
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Configurar Columnas
            </h4>
            <div class="space-y-1 max-h-64 overflow-y-auto">
              <div
                v-for="(col, index) in dataColumns"
                :key="col.id"
                class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <!-- Checkbox Visibility -->
                <UCheckbox
                  v-model="col.p_visible"
                  @update:model-value="(v) => updateColumnVisibility(col, v)"
                  :ui="{ wrapper: 'flex items-center' }"
                />

                <!-- Label -->
                <span class="text-sm truncate select-none">
                  {{ col.header }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </UPopover>
    </div>
    <div>
      <FiltroDateCompras v-model="range" class="-ms-1" />

      <USelectMenu
        v-model="dateColumn"
        :items="dateColumns"
        option-attribute="label"
        value-attribute="value"
        class="w-52"
      />
    </div>

    <div class="flex items-center gap-2 mb-4">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        placeholder="Buscar..."
        class="w-full max-w-sm"
      />
      <USelectMenu
        v-model="searchScopes"
        :items="searchColumns"
        option-attribute="label"
        value-attribute="value"
        multiple
        placeholder="Búsqueda avanzada (opcional)"
        class="w-64"
      />
    </div>

    <UTable
      ref="tableRef"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      v-model:global-filter="globalFilter"
      v-model:column-filters="columnFilters"
      :data="tableData"
      :columns="tableColumns"
      :loading="loading"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :get-filtered-row-model="getFilteredRowModel()"
      sticky
      class="border border-default rounded-lg"
    ></UTable>

    <div
      class="flex justify-between items-center border-t border-default py-4 px-4"
    >
      <div v-if="selectable" class="text-sm text-muted">
        {{ selectedCount }} fila(s) seleccionadas
      </div>

      <UPagination
        :page="getPaginationInfo().page"
        :items-per-page="getPaginationInfo().size"
        :total="getPaginationInfo().total"
        @update:page="(p) => tableRef?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
/* Estilo para la fila que se está moviendo */
:deep(.sortable-ghost) {
  opacity: 0.4;
  background: rgb(var(--color-primary-500) / 0.1);
}

:deep(.sortable-chosen) {
  background: rgb(var(--color-neutral-100));
}
</style>
