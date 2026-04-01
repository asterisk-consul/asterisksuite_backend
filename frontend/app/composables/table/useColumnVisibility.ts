import { ref, computed, type Ref } from 'vue'

/* ========================
   Tipos
======================== */
type ColumnApi = {
  id: string
  getIsVisible: () => boolean
  getCanHide: () => boolean
  toggleVisibility: (value?: boolean) => void

  columnDef?: {
    header?: unknown
    meta?: {
      label?: string
      disableColumnVisibility?: boolean
    }
  }
}

type TableApiLike = {
  getAllColumns: () => ColumnApi[]
}

type TableRefLike<TTableApi> = {
  tableApi: TTableApi | null
}

/* ========================
   Helper label
======================== */
function resolveColumnLabel(col: ColumnApi): string {
  // 1. meta.label (mejor opción)
  if (col.columnDef?.meta?.label) {
    return col.columnDef.meta.label
  }

  // 2. header string
  if (typeof col.columnDef?.header === 'string') {
    return col.columnDef.header
  }

  // 3. fallback técnico
  return col.id
}

/* ========================
   Composable
======================== */
export function useColumnVisibility<TTableApi extends TableApiLike>(
  table: Ref<TableRefLike<TTableApi> | null | undefined>,
  options?: {
    storageKey?: string
  }
) {
  const columnVisibility = ref<Record<string, boolean>>({})

  const columnVisibilityItems = computed(() => {
    const api = table.value?.tableApi
    if (!api) return []

    return api
      .getAllColumns()
      .filter((col) => {
        if (!col.getCanHide()) return false
        if (col.columnDef?.meta?.disableColumnVisibility) return false
        return true
      })
      .map((col) => ({
        label: resolveColumnLabel(col),
        type: 'checkbox' as const,
        checked: col.getIsVisible(),
        onUpdateChecked(checked: boolean) {
          col.toggleVisibility(!!checked)
        },
        onSelect(e?: Event) {
          e?.preventDefault()
        }
      }))
  })

  return {
    columnVisibility,
    columnVisibilityItems
  }
}
