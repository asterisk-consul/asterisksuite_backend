import type { BaseField } from '@/types/form.types'
export const warehouseFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  {
    name: 'companyId',
    type: 'hidden'
  },

  {
    label: 'Nombre del depósito',
    name: 'name',
    type: 'text',
    placeholder: 'Depósito Central'
    // required: true
  },

  {
    label: 'Código interno',
    name: 'code',
    type: 'text',
    placeholder: 'WH-CENTRAL'
  },

  {
    label: 'Ubicación',
    name: 'locationId',
    type: 'select',
    options: [] // se inyectan dinámicamente
  }
]
