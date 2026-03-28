import type { BaseField } from '@/types/form.types'

export const transferRatesFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  {
    label: 'Nombre',
    name: 'name',
    type: 'text',
    placeholder: 'Por ejemplo: Transferencia cliente'
  },

  {
    label: 'Tipo de tarifa',
    name: 'rate_type',
    type: 'select',
    options: [
      { label: 'Por bulto', value: 'BULTO' },
      { label: 'Kilometros', value: 'KM' }
    ]
  },

  {
    label: 'Descripción',
    name: 'description',
    type: 'text',
    placeholder: 'Descripción opcional'
  }
]
