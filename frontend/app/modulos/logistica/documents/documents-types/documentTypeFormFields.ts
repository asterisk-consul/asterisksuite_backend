import type { BaseField } from '@/types/form.types'
export const documentTypeFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  {
    label: 'Nombre del documento',
    name: 'name',
    type: 'text',
    placeholder: 'VTV'
    // required: true
  },

  {
    label: 'Entidad',
    name: 'entity',
    type: 'select',
    // required: true,
    options: [
      { label: 'Vehículo', value: 'VEHICLE' },
      { label: 'Chofer', value: 'DRIVER' }
    ]
  }
]
