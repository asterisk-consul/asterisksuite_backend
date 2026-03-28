export interface Product {
  id: string
  company_id: string
  name: string
  sku?: string
  requires_refrigeration?: boolean
  created_at?: string
  updated_at?: string
}

export type CreateProductInput = Omit<
  Product,
  'id' | 'created_at' | 'updated_at'
>

export type UpdateProductInput = Partial<CreateProductInput>
