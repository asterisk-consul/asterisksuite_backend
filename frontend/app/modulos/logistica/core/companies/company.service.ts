import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput
} from '~/modulos/logistica/core/companies/company.types'

export const useCompaniesService = () => {
  const urlBase = '/api/companies'
  const findAll = () => $fetch<Company[]>(`${urlBase}`)

  const findOne = (id: string) => $fetch<Company>(`${urlBase}/${id}`)

  const create = (payload: CreateCompanyInput) =>
    $fetch<Company>(`${urlBase}`, {
      method: 'POST',
      body: payload
    })

  const update = (id: string, payload: UpdateCompanyInput) =>
    $fetch<Company>(`${urlBase}/${id}`, {
      method: 'PATCH',
      body: payload
    })

  const deactivate = (id: string) =>
    $fetch<void>(`${urlBase}/${id}`, {
      method: 'DELETE'
    })

  return {
    findAll,
    findOne,
    create,
    update,
    deactivate
  }
}
