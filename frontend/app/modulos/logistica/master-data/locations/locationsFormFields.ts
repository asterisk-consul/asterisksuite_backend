import type { BaseField } from '@/types/form.types'
export const locationFormFields: BaseField[] = [
  // {
  //   label: 'Dirección',
  //   name: 'address',
  //   type: 'text',
  //   placeholder: 'Nueva Dirección 999'
  // },
  {
    label: 'Ciudad',
    name: 'city',
    type: 'text',
    placeholder: 'Córdoba Capital'
  },
  {
    label: 'Provincia',
    name: 'province',
    type: 'text',
    placeholder: 'Córdoba'
  },
  {
    label: 'País',
    name: 'country',
    type: 'text',
    placeholder: 'Argentina'
  },
  {
    label: 'Código Postal',
    name: 'postal_code',
    type: 'text',
    placeholder: '5000'
  }
  // {
  //   label: 'Latitud',
  //   name: 'latitude',
  //   type: 'text',
  //   placeholder: '-31.4201'
  // },
  // {
  //   label: 'Longitud',
  //   name: 'longitude',
  //   type: 'text',
  //   placeholder: '-64.1888'
  // }
]
