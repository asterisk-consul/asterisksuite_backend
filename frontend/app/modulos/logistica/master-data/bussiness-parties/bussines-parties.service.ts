import type { BusinessParty } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'
const urlBase = '/api/logistica/master-data/business-parties'
export const useBusinessPartiesService = () => {
  const findAll = (company_id: string) => {
    return $fetch<BusinessParty[]>(`${urlBase}`, {
      query: { company_id }
    })
  }

  const findOne = (id: string) => {
    return $fetch<BusinessParty>(`${urlBase}/${id}`)
  }

  const create = (data: Partial<BusinessParty>) => {
    return $fetch<BusinessParty>(`${urlBase}`, {
      method: 'POST',
      body: data
    })
  }

  const update = (id: string, data: Partial<BusinessParty>) => {
    return $fetch<BusinessParty>(`${urlBase}/${id}`, {
      method: 'PATCH',
      body: data
    })
  }

  const remove = (id: string) => {
    return $fetch<void>(`${urlBase}/${id}`, {
      method: 'DELETE'
    })
  }
  return { findAll, findOne, create, update, remove }
}
