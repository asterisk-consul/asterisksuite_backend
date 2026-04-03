import type { TableColumn } from '@nuxt/ui'
import { UBadge } from '#components'
import type { Trip } from '~/modulos/logistica/transport/trips/types/trips.types'
import StatusToggle from '@/components/ui/PopoverTableActive.vue'

import { createTableBuilder } from '@/composables/table/createColumns'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

type Row = Trip

export type TripStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

type BadgeColor =
  | 'error'
  | 'primary'
  | 'warning'
  | 'secondary'
  | 'success'
  | 'info'
  | 'neutral'

const tripStatusConfig: Record<
  TripStatus,
  { label: string; color: BadgeColor }
> = {
  PLANNED: { label: 'Planificado', color: 'info' },
  IN_PROGRESS: { label: 'En curso', color: 'warning' },
  COMPLETED: { label: 'Completado', color: 'success' },
  CANCELLED: { label: 'Cancelado', color: 'error' }
}

export const tripsColumns = (actions: {
  onToggleStatus?: (row: Row, value: TripStatus) => void
  onInlineSave?: (row: Row, field: any, value: any) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => {
  const build = createTableBuilder<Row>({ locale: 'es-AR' })

  return [
    useSelectColumn<Row>(),
    useIdColumn<Row>(actions.onEdit),

    ...build([
      {
        key: 'reference_number',
        label: 'Referencia de Viaje',
        sortable: true,
        editable: true,
        editField: 'reference_number'
      },

      {
        key: 'week',
        label: 'Semana',
        sortable: true,
        editable: true,
        editField: 'week'
      },

      {
        key: 'status',
        label: 'Estado',
        sortable: true,

        enum: {
          options: Object.entries(tripStatusConfig).map(([value, config]) => ({
            value,
            label: config.label,
            color: config.color
          })),
          toggle: {
            component: StatusToggle,
            title: 'Cambiar estado',
            onChange: (row, value) =>
              actions.onToggleStatus?.(row, value as TripStatus)
          }
        }
      },
      {
        id: 'origin',
        label: 'Origen',
        cell: ({ row }) =>
          row.original.locations_trips_origin_location_idTolocations?.city ??
          '—'
      },
      {
        id: 'destination',
        label: 'Destino',
        cell: ({ row }) =>
          row.original.locations_trips_destination_location_idTolocations
            ?.city ?? '—'
      },
      {
        id: 'orders',
        label: 'Órdenes / Clientes',
        cell: ({ row }) => {
          const ordersList = row.original.unique_orders ?? []

          if (!ordersList.length) return '—'

          return h(
            'div',
            { class: 'flex flex-wrap gap-1' },
            ordersList.map((o) =>
              h(
                UBadge,
                {
                  variant: 'subtle',

                  class: 'text-xs'
                },
                () => {
                  return `${o.order_number} (${o.customer_name}) `
                }
              )
            )
          )
        }
      },
      {
        id: 'vehicle_combination',
        label: 'Combinación',
        cell: ({ row }) => {
          const vc = row.original.vehicle_combination
          if (!vc) return '—'
          return vc.unit_number || `VC-${vc.id.slice(0, 8)}`
        }
      },

      // {
      //   key: 'kilometers',
      //   label: 'Km',
      //   sortable: true,
      //   cell: ({ row }) =>
      //     row.original.corridors?.total_distance_km
      //       ? `${row.original.corridors.total_distance_km} km`
      //       : '—'
      // },

      {
        key: 'departure_time',
        label: 'Salida',
        sortable: true,
        date: true
      },

      {
        key: 'arrival_time',
        label: 'Llegada',
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
