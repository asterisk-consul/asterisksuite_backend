import type { BaseField } from '@/types/form.types'
export const productFormFields: BaseField[] = [
  { name: 'id', type: 'hidden' },

  {
    name: 'company_id',
    type: 'hidden'
  },

  {
    label: 'Nombre del producto',
    name: 'name',
    type: 'text',
    placeholder: 'Producto Demo'
    // required: true
  },

  {
    label: 'SKU',
    name: 'sku',
    type: 'text',
    placeholder: 'SKU-001'
  },

  {
    label: '¿Requiere refrigeración?',
    name: 'requires_refrigeration',
    type: 'checkbox'
  }
]
