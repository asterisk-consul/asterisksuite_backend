import { h } from 'vue'
import { UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type { Driver } from '~/modulos/logistica/transport/drivers/drivers.types'
import StatusToggle from '@/components/ui/PopoverTableActive.vue'

import { useDateColumn } from '~/composables/table/useDateColumn'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

const createdDate = useDateColumn('es-AR')

type OptionValue = string | boolean

type BadgeColor =
  | 'error'
  | 'primary'
  | 'warning'
  | 'secondary'
  | 'success'
  | 'info'
  | 'neutral'

function getDocumentColor(expiration?: string | null) {
  if (!expiration) return 'neutral'

  const today = new Date()
  const exp = new Date(expiration)

  const diff = Math.ceil(
    (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diff < 0) return 'error'
  if (diff < 30) return 'warning'
  return 'success'
}
type Row = Driver
export const driversColumns = (actions: {
  onToggleActive?: (row: Row, value: boolean) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  // ♻️ si querés selección múltiple
  useSelectColumn<Driver>(),

  // ♻️ si Driver tiene id:string y querés click para editar
  useIdColumn<Driver>(actions.onEdit),

  {
    id: 'driver',
    header: 'Chofer',
    cell: ({ row }) => {
      const d = row.original
      return `${d.first_name} ${d.last_name}`
    }
  },

  {
    accessorKey: 'document',
    header: 'Documento'
  },

  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: ({ row }) => row.original.phone ?? '—'
  },

  {
    id: 'documents',
    header: 'Documentos',
    cell: ({ row }) => {
      const docs = row.original.driverDocuments
      if (!docs?.length) return '—'

      return h(
        'div',
        { class: 'flex flex-wrap gap-1' },
        docs.map((doc) =>
          h(
            UBadge,
            {
              variant: 'subtle',
              color: getDocumentColor(doc.expiration_date)
            },
            () => doc.transport_document_types?.name ?? 'Documento'
          )
        )
      )
    }
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

  // ♻️ fecha reusable
  {
    accessorKey: 'created_at', // 👈 camelCase si normalizaste API
    header: 'Creado',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('created_at'))
  }
]
