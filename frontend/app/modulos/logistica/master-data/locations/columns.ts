import type { TableColumn } from '@nuxt/ui'
import type { Location } from '~/modulos/logistica/master-data/locations/types/locations.types'

import { useInlineEdit } from '~/composables/table/useInlineEdit'
import { useDateColumn } from '~/composables/table/useDateColumn'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

type Row = Location
type EditableField = 'city' | 'province' | 'country' | 'postalCode' | 'address'
type EditableValue = string | null | undefined

const { editableCell } = useInlineEdit<Location, EditableField>()
const createdDate = useDateColumn('es-AR')

export const LocationColumns = (actions: {
  onToggleActive?: (row: Row, value: boolean) => void
  onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  useSelectColumn<Row>(),
  useIdColumn<Row>(actions.onEdit),
  {
    accessorKey: 'address',
    header: 'Dirección',
    cell: ({ row }) => editableCell('address', row.original, actions)
  },

  {
    accessorKey: 'city',
    header: 'Ciudad',
    cell: ({ row }) => editableCell('city', row.original, actions)
  },
  {
    accessorKey: 'province',
    header: 'Provincia',
    cell: ({ row }) => editableCell('province', row.original, actions)
  },
  {
    accessorKey: 'country',
    header: 'País',
    cell: ({ row }) => editableCell('country', row.original, actions)
  },
  {
    accessorKey: 'postalCode',
    header: 'CP',
    cell: ({ row }) => editableCell('postalCode', row.original, actions)
  },
  {
    id: 'coordinates',
    header: 'Coordenadas',
    cell: ({ row }) => `${row.original.latitude}, ${row.original.longitude}`
  },
  {
    accessorKey: 'created_at',
    header: 'Creado',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('created_at'))
  }
]
