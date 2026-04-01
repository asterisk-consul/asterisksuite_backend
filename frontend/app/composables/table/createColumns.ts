import { h } from 'vue'
import { UButton, UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'

import { useInlineEdit } from '@/composables/table/useInlineEdit'
import { useDateColumn } from '@/composables/table/useDateColumn'

/* ========================
   Badge Colors (TIPADO CORRECTO)
======================== */
export type BadgeColor =
  | 'error'
  | 'primary'
  | 'warning'
  | 'secondary'
  | 'success'
  | 'info'
  | 'neutral'

const VALID_COLORS = [
  'error',
  'primary',
  'warning',
  'secondary',
  'success',
  'info',
  'neutral'
] as const

function isBadgeColor(v: any): v is BadgeColor {
  return VALID_COLORS.includes(v)
}

/* ========================
   Tipos
======================== */
type EnumOption<T = any> = {
  label: string
  value: T
  color?: BadgeColor
}

type BuilderConfig<T> = {
  locale?: string
}

type ColumnConfig<T> = {
  key?: keyof T | string
  id?: string

  label: string
  sortable?: boolean

  /* ===== behaviors ===== */
  editable?: boolean
  editField?: keyof T

  date?: boolean

  enum?: {
    options: EnumOption[]
    toggle?: {
      component: any
      onChange?: (row: T, value: any) => void
      title?: string
    }
  }

  badge?: {
    resolve: (row: T) => { label: string; color?: BadgeColor }
  }

  component?: {
    is: any
    props?: (row: T) => Record<string, any>
  }

  cell?: TableColumn<T>['cell']
  header?: TableColumn<T>['header']

  meta?: Record<string, any>
  filterFn?: TableColumn<T>['filterFn']

  column?: Partial<TableColumn<T>>
}

/* ========================
   Builder
======================== */
export function createTableBuilder<T extends { id: string }>(
  config?: BuilderConfig<T>
) {
  const { editableCell } = useInlineEdit<T, any>()
  const dateCol = useDateColumn(config?.locale || 'es-AR')

  return function build(cols: ColumnConfig<T>[]): TableColumn<T>[] {
    return cols.map((col) => {
      const accessorKey = col.key as string | undefined

      /* ========================
         HEADER (sortable)
      ======================== */
      let header: TableColumn<T>['header']

      if (col.header) {
        header = col.header
      } else if (col.sortable && accessorKey) {
        header = ({ column }: any) => {
          const isSorted = column.getIsSorted()

          return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label: col.label,
            icon: isSorted
              ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
              : 'i-lucide-arrow-up-down',
            class: '-mx-2.5',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
          })
        }
      } else {
        header = col.label
      }

      /* ========================
         CELL
      ======================== */
      let cell = col.cell

      // editable
      if (!cell && col.editable && col.editField) {
        cell = ({ row }) =>
          editableCell(col.editField as any, row.original, (row as any).actions)
      }

      // date
      if (!cell && col.date && accessorKey) {
        cell = ({ row }) => dateCol.format(row.getValue<string>(accessorKey))
      }

      // enum display
      if (!cell && col.enum && accessorKey) {
        cell = ({ row }) => {
          const value = row.original[accessorKey as keyof T]
          const opt = col.enum!.options.find((o) => o.value === value)
          return opt?.label ?? '—'
        }
      }

      // enum toggle
      if (col.enum?.toggle) {
        const Comp = col.enum.toggle.component

        cell = ({ row }) =>
          h(Comp, {
            modelValue: row.original[accessorKey as keyof T],
            title: col.enum!.toggle?.title,
            options: col.enum!.options,
            'onUpdate:modelValue': (value: unknown) =>
              col.enum!.toggle?.onChange?.(row.original, value)
          })
      }

      // badge
      if (!cell && col.badge) {
        cell = ({ row }) => {
          const { label, color } = col.badge!.resolve(row.original)

          return h(
            UBadge,
            {
              variant: 'subtle',
              color: isBadgeColor(color) ? color : 'neutral'
            },
            () => label
          )
        }
      }

      // custom component
      if (col.component) {
        const componentDef = col.component

        const Comp = componentDef.is

        cell = ({ row }) => h(Comp, componentDef.props?.(row.original) || {})
      }

      /* ========================
         META / FILTER
      ======================== */
      const meta = {
        label: col.label,
        ...(col.date ? dateCol.meta : {}),
        ...(col.meta || {})
      }

      const filterFn = col.date ? dateCol.filterFn : col.filterFn

      return {
        id: col.id,
        accessorKey,

        header,
        cell,

        meta,
        filterFn,

        ...(col.column || {})
      } as TableColumn<T>
    })
  }
}
