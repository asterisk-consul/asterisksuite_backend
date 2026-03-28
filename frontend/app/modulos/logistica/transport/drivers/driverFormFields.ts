import type { BaseField } from '@/types/form.types'

export const driverFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  /* ---------------- DATOS CHOFER ---------------- */

  {
    label: 'Nombre',
    name: 'first_name',
    type: 'text',
    placeholder: 'Juan'
  },

  {
    label: 'Apellido',
    name: 'last_name',
    type: 'text',
    placeholder: 'Pérez'
  },

  {
    label: 'Documento',
    name: 'document',
    type: 'text',
    placeholder: '30123456'
  },

  {
    label: 'Teléfono',
    name: 'phone',
    type: 'text',
    placeholder: '3515551234'
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
