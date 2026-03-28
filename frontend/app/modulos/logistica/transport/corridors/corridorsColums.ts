import { h } from 'vue'
import { UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'

import type { Corridor } from './types/corridors.types'

import { useDateColumn } from '~/composables/table/useDateColumn'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

const createdDate = useDateColumn('es-AR')

type Row = Corridor

export const corridorsColumns = (actions: {
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  // selección múltiple
  useSelectColumn<Row>(),

  // columna ID reusable
  useIdColumn<Row>(actions.onEdit),

  {
    accessorKey: 'name',
    header: 'Corredor',
    cell: ({ row }) => row.original.name ?? '—'
  },

  {
    id: 'route',
    header: 'Ruta',
    cell: ({ row }) => {
      const c = row.original

      return h('div', { class: 'flex items-center gap-2 text-sm' }, [
        h(
          'span',
          { class: 'font-medium' },
          c.origin_location?.city ?? 'Origen'
        ),
        h('span', { class: 'text-gray-400' }, '→'),
        h(
          'span',
          { class: 'font-medium' },
          c.destination_location?.city ?? 'Destino'
        )
      ])
    }
  },

  {
    id: 'stops',
    header: 'Paradas',
    cell: ({ row }) => row.original.corridorStops?.length ?? 0
  },

  {
    id: 'distance',
    header: 'Distancia',
    cell: ({ row }) =>
      row.original.total_distance_km
        ? `${row.original.total_distance_km} km`
        : '—'
  },

  {
    id: 'time',
    header: 'Tiempo',
    cell: ({ row }) =>
      row.original.estimated_minutes
        ? `${row.original.estimated_minutes} min`
        : '—'
  },

  {
    accessorKey: 'is_template',
    header: 'Tipo',
    cell: ({ row }) =>
      h(
        UBadge,
        {
          variant: 'subtle',
          color: row.original.is_template ? 'info' : 'neutral'
        },
        () => (row.original.is_template ? 'Template' : 'Corredor')
      )
  },

  {
    accessorKey: 'created_at',
    header: 'Creado',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('created_at'))
  }
]
