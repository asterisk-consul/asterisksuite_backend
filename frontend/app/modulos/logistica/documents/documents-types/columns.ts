import { h } from 'vue'
import { UBadge, UCheckbox, UInput } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type {
  DocumentType,
  DocumentEntity
} from '~/modulos/logistica/documents/documents-types/document-types.types'
import StatusToggle from '@/components/ui/PopoverTableActive.vue'
import '@tanstack/vue-table'

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData, TValue> {
    filterType?: 'text' | 'date-range'
  }
}
type OptionValue = string | boolean

type BadgeColor =
  | 'error'
  | 'primary'
  | 'warning'
  | 'secondary'
  | 'success'
  | 'info'
  | 'neutral'

const entityConfig: Record<
  DocumentEntity,
  { label: string; color: BadgeColor }
> = {
  VEHICLE: { label: 'Vehículo', color: 'primary' },
  DRIVER: { label: 'Chofer', color: 'warning' }
}

type EditableField = 'name'
type EditableValue = string | null | undefined

type Row = DocumentType & { locations?: any }

const editing = ref<{ id: string; field: string } | null>(null)

const startEdit = (id: string, field: string) => (editing.value = { id, field })

const stopEdit = () => (editing.value = null)

const isEditing = (id: string, field: string) =>
  editing.value?.id === id && editing.value?.field === field

export const transportDocumentTypeColumns = (actions: {
  onToggleActive?: (row: Row, value: boolean) => void
  onToggleEntity?: (row: Row, value: DocumentEntity) => void
  onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value)
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value)
      })
  },
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => {
      const id = row.getValue('id') as string

      return h(
        'button',
        {
          class: 'text-primary hover:underline font-mono hover:cursor-pointer',
          onClick: () => actions.onEdit?.(row.original)
        },
        `#${id.slice(0, 8)}`
      )
    }
  },

  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      const id = row.original.id
      const value = row.original.name

      if (isEditing(id, 'name')) {
        return h(UInput as unknown as Component, {
          modelValue: value,
          size: 'lg',
          autofocus: true,
          'onUpdate:modelValue': (v: string) => (row.original.name = v),
          onBlur: () => {
            actions.onInlineSave?.(
              row.original,
              'name' as EditableField,
              row.original.name
            )
            stopEdit()
          }
        })
      }

      return h(
        'div',
        {
          class:
            'cursor-pointer hover:bg-primary/5 hover:text-primary px-2 py-1 rounded',
          onClick: () => startEdit(id, 'name')
        },
        value
      )
    }
  },
  {
    accessorKey: 'entity',
    header: 'Entidad',
    accessorFn: (row) => entityConfig[row.entity as DocumentEntity]?.label,
    cell: ({ row }) =>
      h(StatusToggle, {
        modelValue: row.original.entity,
        title: 'Cambiar entidad',
        options: [
          { label: 'Vehículo', value: 'VEHICLE', color: 'primary' },
          { label: 'Chofer', value: 'DRIVER', color: 'warning' }
        ],
        'onUpdate:modelValue': (value: OptionValue) =>
          actions.onToggleEntity?.(row.original, value as DocumentEntity)
      })
  },

  {
    accessorKey: 'active',
    header: 'Estado',

    accessorFn: (row) => (row.active ? 'activo' : 'inactivo'),
    cell: ({ row }) =>
      h(StatusToggle, {
        modelValue: row.original.active,
        title: 'Cambiar estado',
        options: [
          { label: 'Activo', value: true, color: 'success' },
          { label: 'Inactivo', value: false, color: 'error' }
        ],
        'onUpdate:modelValue': (value: OptionValue) =>
          actions.onToggleActive?.(row.original, value as boolean)
      })
  },

  {
    accessorKey: 'created_at',
    header: 'Creado',
    meta: { filterType: 'date-range' },
    filterFn: (row, columnId, value) => {
      if (!value?.start || !value?.end) return true

      const raw = row.getValue<string>(columnId)
      if (!raw) return false

      const date = new Date(raw)

      const start = new Date(value.start)
      start.setHours(0, 0, 0, 0)

      const end = new Date(value.end)
      end.setHours(23, 59, 59, 999)

      return date >= start && date <= end
    },
    cell: ({ row }) => {
      const date = row.original.created_at

      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  }
]
