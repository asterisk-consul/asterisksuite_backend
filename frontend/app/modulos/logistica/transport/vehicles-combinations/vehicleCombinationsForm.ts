import type { BaseField } from '@/types/form.types'

export const vehicleCombinationsFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  {
    label: 'N° Unidad',
    name: 'unit_number',
    type: 'text',
    placeholder: 'INT-001'
  },

  {
    label: 'Tractor',
    name: 'tractor_id',
    type: 'select',
    options: [] // <-- opciones dinámicas de vehículos tipo tractor
  },

  {
    label: 'Trailer',
    name: 'trailer_id',
    type: 'select',
    options: [] // <-- opciones dinámicas de trailers
  },

  {
    label: 'Chofer',
    name: 'driver_id',
    type: 'select',
    options: [] // <-- opciones dinámicas de drivers
  },

  {
    label: 'Válido desde',
    name: 'valid_from',
    type: 'date'
  },

  {
    label: 'Válido hasta',
    name: 'valid_until',
    type: 'date'
  }
]
