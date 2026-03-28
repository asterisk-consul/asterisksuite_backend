import { h } from 'vue'
import { UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type {
  Vehicle,
  VehicleDocument
} from '~/modulos/logistica/transport/vehicles/vehicles.types'
import StatusToggle from '@/components/ui/PopoverTableActive.vue'
import {
  useInlineEdit,
  type EditableValue
} from '~/composables/table/useInlineEdit'

type OptionValue = string | boolean

type EditableField = 'plate'

import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'
import { useDateColumn } from '~/composables/table/useDateColumn'

const { editableCell } = useInlineEdit<Vehicle, EditableField>()
const createdDate = useDateColumn('es-AR')

function getDocumentColor(expiration: string) {
  const today = new Date()
  const exp = new Date(expiration)

  const diff = Math.ceil(
    (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diff < 0) return 'error'
  if (diff < 30) return 'warning'

  return 'success'
}
type Row = Vehicle
export const vehiclesColumns = (actions: {
  onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onToggleActive?: (row: Row, value: boolean) => void
  onToggleRefrigeration?: (row: Row, value: boolean) => void
  onToggleType?: (row: Row, value: 'CAMION' | 'SEMI') => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  // ♻️ si querés selección múltiple
  useSelectColumn<Row>(),

  // ♻️ si Driver tiene id:string y querés click para editar
  useIdColumn<Row>(actions.onEdit),

  {
    accessorKey: 'plate',
    header: 'Patente',
    cell: ({ row }) => editableCell('plate', row.original, actions)
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }: { row: { original: Vehicle } }) =>
      h(StatusToggle, {
        modelValue: row.original.type, // 'CAMION' | 'SEMI'
        title: 'Cambiar tipo de vehículo',
        options: [
          { label: 'Camión', value: 'CAMION', color: 'primary' },
          { label: 'Semi', value: 'SEMI', color: 'warning' }
        ],
        'onUpdate:modelValue': (value: OptionValue) =>
          actions.onToggleType?.(row.original, value as 'CAMION' | 'SEMI')
      })
  },

  {
    id: 'vehicle',
    header: 'Vehículo',
    cell: ({ row }) => {
      const brand = row.original.brand ?? ''
      const model = row.original.model ?? ''

      return `${brand} ${model}`.trim() || '—'
    }
  },

  {
    accessorKey: 'refrigeration',
    header: 'Refrigeración',
    cell: ({ row }: { row: { original: Vehicle } }) =>
      h(StatusToggle, {
        modelValue: row.original.refrigeration,
        title: 'Cambiar tipo de refrigeración',
        options: [
          {
            label: 'Refrigerado',
            value: true,
            color: 'info',
            disabled: row.original.type === 'CAMION'
          },
          { label: 'Normal', value: false, color: 'neutral' }
        ],
        'onUpdate:modelValue': (value: OptionValue) =>
          actions.onToggleRefrigeration?.(row.original, value as boolean)
      })
  },

  {
    id: 'documents',
    header: 'Documentos',
    cell: ({ row }) => {
      const docs = row.original.vehicleDocuments

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
            () => doc.transport_document_types.name
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
        modelValue: !!row.original.active,
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
