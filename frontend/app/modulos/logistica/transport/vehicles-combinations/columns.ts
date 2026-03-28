import { h } from 'vue'
import { UBadge } from '#components'
import type { TableColumn } from '@nuxt/ui'
import type { VehicleCombination } from '~/modulos/logistica/transport/vehicles-combinations/vehicles-combinations.types'
import {
  useInlineEdit,
  type EditableValue
} from '~/composables/table/useInlineEdit'
type Row = VehicleCombination
import StatusToggle from '@/components/ui/PopoverTableActive.vue'

type OptionValue = string | boolean

type EditableField = 'unit_number'

import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'
import { useDateColumn } from '~/composables/table/useDateColumn'

const { editableCell } = useInlineEdit<VehicleCombination, EditableField>()
const createdDate = useDateColumn('es-AR')

export const VehicleCombinationColumns = (actions: {
  onInlineSave?: (row: Row, field: EditableField, value: EditableValue) => void
  onToggleActive?: (row: Row, value: boolean) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => [
  // ♻️ si querés selección múltiple
  useSelectColumn<Row>(),

  // ♻️ si Driver tiene id:string y querés click para editar
  useIdColumn<Row>(actions.onEdit),

  {
    accessorKey: 'unit_number',
    header: 'N° Unidad',
    cell: ({ row }) => editableCell('unit_number', row.original, actions)
  },

  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) =>
      h(StatusToggle, {
        modelValue:
          !row.original.valid_until ||
          new Date(row.original.valid_until) >= new Date(),
        title: 'Cambiar estado',
        options: [
          { label: 'Activo', value: true, color: 'success' },
          { label: 'Histórico', value: false, color: 'neutral' }
        ],
        'onUpdate:modelValue': (value: OptionValue) =>
          actions.onToggleActive?.(row.original, value as boolean)
      })
  },
  {
    id: 'tractor',
    header: 'Tractor',
    cell: ({ row }) => {
      const t = row.original.tractor
      if (!t) return '—'

      // Solo añadir guion si hay brand o model
      const details = [t.brand, t.model].filter(Boolean).join(' ')
      return details ? `${t.plate} - ${details}` : t.plate
    }
  },
  {
    id: 'trailer',
    header: 'Trailer',
    cell: ({ row }) => {
      const t = row.original.trailer
      if (!t) return '—'

      const details = [t.brand, t.model].filter(Boolean).join(' ')
      return details ? `${t.plate} - ${details}` : t.plate
    }
  },
  {
    id: 'driver',
    header: 'Chofer',
    cell: ({ row }) => {
      const d = row.original.drivers

      return d ? `${d.first_name} ${d.last_name}` : '—'
    }
  },

  {
    accessorKey: 'valid_from', // 👈 camelCase si normalizaste API
    header: 'Válido desde',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('valid_from'))
  },
  {
    accessorKey: 'valid_until', // 👈 camelCase si normalizaste API
    header: 'Válido hasta',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('valid_until'))
  },
  {
    accessorKey: 'created_at', // 👈 camelCase si normalizaste API
    header: 'Creado',
    meta: createdDate.meta,
    filterFn: createdDate.filterFn,
    cell: ({ row }) => createdDate.format(row.getValue<string>('created_at'))
  }
]
