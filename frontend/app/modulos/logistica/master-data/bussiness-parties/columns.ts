import { h } from 'vue'
import { UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type { BusinessParty } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'

import { useInlineEdit } from '~/composables/table/useInlineEdit'
import type { EditableValue } from '~/composables/table/useInlineEdit'
import { useDateColumn } from '~/composables/table/useDateColumn'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

type Row = BusinessParty
type EditableField = 'city' | 'province' | 'country' | 'postalCode'

const { editableCell } = useInlineEdit<BusinessParty, EditableField>()
const createdDate = useDateColumn('es-AR')

export const BusinessPartyColumns = (actions: {
  // onToggleActive?: (row: Row, value: boolean) => void
  // onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  useSelectColumn<Row>(),
  useIdColumn<Row>(actions.onEdit),

  {
    accessorKey: 'name',
    header: 'Razón Social'
  },

  {
    accessorKey: 'tax_id',
    header: 'CUIT'
  },

  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('type') as 'client' | 'supplier'

      const config = {
        client: { label: 'Cliente', color: 'primary' },
        supplier: { label: 'Proveedor', color: 'warning' }
      } as const

      const cfg = config[type]

      return h(
        UBadge,
        {
          variant: 'subtle',
          color: cfg.color
        },
        () => cfg.label
      )
    }
  },

  {
    accessorKey: 'active',
    header: 'Estado',
    cell: ({ row }) => {
      const active = row.getValue('active') as boolean

      return h(
        UBadge,
        {
          variant: 'subtle',
          color: active ? 'success' : 'error'
        },
        () => (active ? 'Activo' : 'Inactivo')
      )
    }
  },

  {
    accessorKey: 'created_at',
    header: 'Creado',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string

      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  }
]
