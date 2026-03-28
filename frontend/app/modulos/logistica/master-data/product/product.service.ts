import type {
  Product,
  CreateProductInput,
  UpdateProductInput
} from '~/modulos/logistica/master-data/product/product.types'

export const useProductsService = () => {
  const findAll = (company_id: string) =>
    $fetch<Product[]>('/api/logistica/master-data/products', {
      query: { company_id }
    })

  const findOne = (id: string) =>
    $fetch<Product>(`/api/logistica/master-data/products/${id}`)

  const create = (payload: CreateProductInput) =>
    $fetch<Product>('/api/logistica/master-data/products', {
      method: 'POST',
      body: payload
    })

  const update = (id: string, payload: UpdateProductInput) =>
    $fetch<Product>(`/api/logistica/master-data/products/${id}`, {
      method: 'PATCH',
      body: payload
    })

  const remove = (id: string) =>
    $fetch<void>(`/api/logistica/master-data/products/${id}`, {
      method: 'DELETE'
    })

  return {
    findAll,
    findOne,
    create,
    update,
    remove
  }
}
