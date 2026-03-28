import type { TableColumn } from '@nuxt/ui'
import type { PartyContact } from './types/contacts.types'

import { useInlineEdit } from '~/composables/table/useInlineEdit'
import { useDateColumn } from '~/composables/table/useDateColumn'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

type Row = PartyContact

type EditableField = 'first_name' | 'last_name' | 'role' | 'phone' | 'email'

type EditableValue = string | null | undefined

const { editableCell } = useInlineEdit<PartyContact, EditableField>()
const createdDate = useDateColumn('es-AR')

export const PartyContactColumns = (actions: {
  onToggleActive?: (row: Row, value: boolean) => void
  onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  useSelectColumn<Row>(),

  useIdColumn<Row>(actions.onEdit),
  {
    id: 'business_party_name',
    header: 'Empresa',
    cell: ({ row }) => row.original.business_parties?.name ?? '—'
  },

  {
    accessorKey: 'first_name',
    header: 'Nombre',
    cell: ({ row }) => editableCell('first_name', row.original, actions)
  },
  {
    accessorKey: 'last_name',
    header: 'Apellido',
    cell: ({ row }) => editableCell('last_name', row.original, actions)
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => editableCell('role', row.original, actions)
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: ({ row }) => editableCell('phone', row.original, actions)
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => editableCell('email', row.original, actions)
  },

  /**
   * Columna derivada: nombre completo
   */
  {
    id: 'full_name',
    header: 'Nombre completo',
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`
  },

  /**
   * Fecha de creación
   */
  {
    accessorKey: 'created_at',
    header: 'Creado',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('created_at'))
  }
]
