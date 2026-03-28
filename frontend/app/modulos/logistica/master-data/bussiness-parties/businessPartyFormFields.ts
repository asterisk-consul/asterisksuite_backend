import type { BaseField } from '@/types/form.types'

export const businessPartyFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  {
    label: 'Tipo',
    name: 'type',
    type: 'select',
    options: [
      { label: 'Cliente', value: 'client' },
      { label: 'Proveedor', value: 'supplier' }
    ]
    // required: true
  },

  {
    label: 'Razón Social',
    name: 'name',
    type: 'text',
    placeholder: 'Cliente Demo SRL'
    // required: true
  },

  {
    label: 'CUIT',
    name: 'tax_id',
    type: 'text',
    placeholder: '30-12345678-9'
    // required: true
  }
]
