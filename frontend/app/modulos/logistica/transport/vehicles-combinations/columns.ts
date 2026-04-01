import type { TableColumn } from '@nuxt/ui'
import type { VehicleCombination } from '~/modulos/logistica/transport/vehicles-combinations/types/vehicles-combinations.types'
import StatusToggle from '@/components/ui/PopoverTableActive.vue'

import { createTableBuilder } from '@/composables/table/createColumns'
import { useSelectColumn } from '@/composables/table/useSelectColumn'
import { useIdColumn } from '@/composables/table/useIdColumn'

type Row = VehicleCombination

export const VehicleCombinationColumns = (actions: {
  onInlineSave?: (row: Row, field: 'unit_number', value: any) => void
  onToggleActive?: (row: Row, value: boolean) => void
  onEdit?: (row: Row) => void
}): TableColumn<Row>[] => {
  const build = createTableBuilder<Row>({ locale: 'es-AR' })

  return [
    useSelectColumn<Row>(),
    useIdColumn<Row>(actions.onEdit),

    ...build([
      {
        key: 'unit_number',
        label: 'N° Unidad',
        sortable: true,
        editable: true,
        editField: 'unit_number'
      },

      {
        key: 'status',
        label: 'Estado',
        sortable: true,

        enum: {
          options: [
            { label: 'Activo', value: true, color: 'success' },
            { label: 'Histórico', value: false, color: 'neutral' }
          ],
          toggle: {
            component: StatusToggle,
            title: 'Cambiar estado',
            onChange: (row) => {
              const isActive =
                !row.valid_until || new Date(row.valid_until) >= new Date()

              actions.onToggleActive?.(row, !isActive)
            }
          }
        }
      },

      {
        id: 'tractor',
        label: 'Tractor',
        cell: ({ row }) => {
          const t = row.original.tractor
          if (!t) return '—'
          const details = [t.brand, t.model].filter(Boolean).join(' ')
          return details ? `${t.plate} - ${details}` : t.plate
        }
      },

      {
        id: 'trailer',
        label: 'Trailer',
        cell: ({ row }) => {
          const t = row.original.trailer
          if (!t) return '—'
          const details = [t.brand, t.model].filter(Boolean).join(' ')
          return details ? `${t.plate} - ${details}` : t.plate
        }
      },

      {
        id: 'driver',
        label: 'Chofer',
        cell: ({ row }) => {
          const d = row.original.drivers
          return d ? `${d.first_name} ${d.last_name}` : '—'
        }
      },

      {
        key: 'valid_from',
        label: 'Válido desde',
        sortable: true,
        date: true
      },

      {
        key: 'valid_until',
        label: 'Válido hasta',
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
