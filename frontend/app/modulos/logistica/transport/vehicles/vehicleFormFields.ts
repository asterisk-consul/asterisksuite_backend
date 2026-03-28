import type { BaseField } from '@/types/form.types'

export const vehicleFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  {
    label: 'Tipo',
    name: 'type',
    type: 'select',
    options: [
      { label: 'Camión', value: 'CAMION' },
      { label: 'Semi', value: 'SEMI' }
    ]
  },

  {
    label: 'Patente',
    name: 'plate',
    type: 'text',
    placeholder: 'ABC123'
  },

  {
    label: 'Marca',
    name: 'brand',
    type: 'text',
    placeholder: 'Scania'
  },

  {
    label: 'Modelo',
    name: 'model',
    type: 'text',
    placeholder: 'R450'
  },

  {
    label: 'Año',
    name: 'year',
    type: 'number',
    placeholder: '2022'
  },

  {
    label: 'Peso Máximo (kg)',
    name: 'maxWeight',
    type: 'number'
  },

  {
    label: 'Volumen Máximo',
    name: 'maxVolume',
    type: 'number'
  },

  {
    label: 'Refrigeración',
    name: 'refrigeration',
    type: 'checkbox',
    disabled: (state) => state.type === 'CAMION'
  },

  /* ---------------- DOCUMENTOS ---------------- */

  {
    label: 'Documento 1',
    name: 'doc1Type',
    type: 'select',
    options: []
  },

  {
    label: 'Vencimiento Doc 1',
    name: 'doc1Expiration',
    type: 'date'
  },

  {
    label: 'Documento 2',
    name: 'doc2Type',
    type: 'select',
    options: []
  },

  {
    label: 'Vencimiento Doc 2',
    name: 'doc2Expiration',
    type: 'date'
  },

  {
    label: 'Documento 3',
    name: 'doc3Type',
    type: 'select',
    options: []
  },

  {
    label: 'Vencimiento Doc 3',
    name: 'doc3Expiration',
    type: 'date'
  },

  {
    label: 'Documento 4',
    name: 'doc4Type',
    type: 'select',
    options: []
  },

  {
    label: 'Vencimiento Doc 4',
    name: 'doc4Expiration',
    type: 'date'
  }
]
