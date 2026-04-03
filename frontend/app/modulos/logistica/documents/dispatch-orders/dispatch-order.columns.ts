import type { TableColumn } from '@nuxt/ui'
import type {
  DispatchOrder,
  DispatchStatus
} from '~/modulos/logistica/documents/dispatch-orders/types/dispatch-orders.types'

import StatusToggle from '@/components/ui/PopoverTableActive.vue'

import { createTableBuilder } from '@/composables/table/createColumns'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'
type Row = DispatchOrder
import type { EditableValue } from '~/composables/table/useInlineEdit'

type BadgeColor =
  | 'error'
  | 'primary'
  | 'warning'
  | 'secondary'
  | 'success'
  | 'info'
  | 'neutral'

export type EditableField = 'order_number'

const dispatchStatusConfig: Record<
  DispatchStatus,
  { label: string; color: BadgeColor }
> = {
  PENDING: { label: 'Pendiente', color: 'warning' },
  ASSIGNED: { label: 'Asignado', color: 'info' },
  IN_PROGRESS: { label: 'En curso', color: 'primary' },
  COMPLETED: { label: 'Completado', color: 'success' },
  CANCELLED: { label: 'Cancelado', color: 'error' }
}

export const dispatchOrdersColumns = (actions: {
  onToggleStatus?: (row: Row, value: DispatchStatus) => void
  onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => {
  const build = createTableBuilder<Row>({ locale: 'es-AR' })

  return [
    useSelectColumn<Row>(),
    useIdColumn<Row>(actions.onEdit),

    ...build([
      {
        key: 'order_number',
        label: 'N° Orden',
        sortable: true,
        editable: true,
        editField: 'order_number'
      },

      {
        key: 'status',
        label: 'Estado',
        sortable: true,

        enum: {
          options: Object.entries(dispatchStatusConfig).map(
            ([value, config]) => ({
              value,
              label: config.label,
              color: config.color
            })
          ),
          toggle: {
            component: StatusToggle,
            title: 'Cambiar estado',
            onChange: (row, value) =>
              actions.onToggleStatus?.(row, value as DispatchStatus)
          }
        }
      },

      {
        key: 'requires_stock',
        label: 'Stock',
        badge: {
          resolve: (row) => ({
            label: row.requires_stock ? 'Requiere' : 'No requiere',
            color: row.requires_stock ? 'warning' : 'neutral'
          })
        }
      },

      {
        id: 'customer',
        label: 'Cliente',
        cell: ({ row }) => row.original.customers?.name || '—'
      },

      {
        id: 'origin',
        label: 'Origen',
        cell: ({ row }) => row.original.origin_location?.city || '—'
      },

      {
        id: 'destination',
        label: 'Destino',
        cell: ({ row }) => row.original.destination_location?.city || '—'
      },

      {
        key: 'planned_date',
        label: 'Fecha planificada',
        sortable: true,
        date: true
      },

      {
        key: 'created_at',
        label: 'Creado',
        sortable: true,
        date: true
      }
    ])
  ]
}
