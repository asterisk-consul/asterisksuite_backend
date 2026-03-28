import { h } from 'vue'
import { UBadge, UCheckbox } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type { Trip } from '~/modulos/logistica/transport/trips/types/trips.types'
import StatusToggle from '@/components/ui/PopoverTableActive.vue'
type OptionValue = string | boolean

import { useInlineEdit } from '~/composables/table/useInlineEdit'
import type { EditableValue } from '~/composables/table/useInlineEdit'
import { useDateColumn } from '~/composables/table/useDateColumn'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

const { editableCell } = useInlineEdit<Trip, EditableField>()

const createdDate = useDateColumn('es-AR')

type TripStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
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

type Row = Trip
type EditableField = 'reference_number' | 'kilometers' | 'week'

export const tripsColumns = (actions: {
  onToggleStatus?: (row: Row, value: TripStatus) => void
  onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  useSelectColumn<Row>(),
  useIdColumn<Row>(actions.onEdit),

  {
    accessorKey: 'reference_number',
    header: 'Referencia de Viaje',
    cell: ({ row }) => editableCell('reference_number', row.original, actions)
  },
  {
    accessorKey: 'week',
    header: 'Semana',
    cell: ({ row }) => editableCell('week', row.original, actions)
  },
  {
    accessorKey: 'status',
    header: 'Estado',

    accessorFn: (row) => tripStatusConfig[row.status as TripStatus]?.label,

    cell: ({ row }) =>
      h(StatusToggle, {
        modelValue: row.original.status,
        title: 'Cambiar estado',
        options: [
          { label: 'Planificado', value: 'PLANNED', color: 'info' },
          { label: 'En curso', value: 'IN_PROGRESS', color: 'warning' },
          { label: 'Completado', value: 'COMPLETED', color: 'success' },
          { label: 'Cancelado', value: 'CANCELLED', color: 'error' }
        ],
        'onUpdate:modelValue': (value: OptionValue) =>
          actions.onToggleStatus?.(row.original, value as TripStatus)
      })
  },
  {
    id: 'business_party',
    header: 'Cliente',
    cell: ({ row }) => row.original.business_party?.name
  },
  {
    id: 'vehicle_combination',
    header: 'Combinación',
    cell: ({ row }) => {
      const vc = row.original.vehicle_combination
      if (!vc) return '—'

      // Mostrá unit_number si existe, sino un ID corto como fallback
      return vc.unit_number || `VC-${vc.id.slice(0, 8)}`
    }
  },
  {
    accessorKey: 'corridos',
    header: 'Corredor',
    cell: ({ row }) => {
      const corridor = row.original.corridors

      return corridor?.name || '—'
    }
  },
  {
    accessorKey: 'kilometers',
    header: 'Km',
    cell: ({ row }) =>
      row.original.corridors?.total_distance_km
        ? `${row.original.corridors?.total_distance_km} km`
        : '—'
  },
  {
    id: 'trip_rates',
    header: 'Tarifas',
    cell: ({ row }) => {
      const rates = row.original.trip_rates
      if (!rates?.length) return '—'

      return h(
        'div',
        { class: 'flex flex-wrap gap-1' },
        rates.map((r) =>
          h(
            UBadge,
            {
              variant: 'subtle',
              color:
                r.transfer_rates.rate_type === 'CLIENT' ? 'info' : 'success'
            },
            () => `${r.transfer_rates.name}: $${r.value}`
          )
        )
      )
    }
  },
  {
    accessorKey: 'departure_time',
    header: 'Salida',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) =>
      createdDate.format(row.getValue<string>('departure_time'))
  },
  {
    accessorKey: 'arrival_time',
    header: 'Llegada',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('arrival_time'))
  },
  {
    accessorKey: 'created_at',
    header: 'Creado',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('created_at'))
  }
]
