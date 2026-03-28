import type {
  PartyContact,
  CreatePartyContactDto,
  UpdatePartyContactDto
} from '../types/contacts.types'

const urlBase = '/api/logistica/master-data/contacts'

export const partyContactsService = {
  async getAll(party_id?: string) {
    return $fetch<PartyContact[]>(`${urlBase}`, {
      query: party_id ? { party_id } : undefined
    })
  },

  async getById(id: string) {
    return $fetch<PartyContact>(`${urlBase}/${id}`)
  },

  async create(data: CreatePartyContactDto) {
    return $fetch<PartyContact>(`${urlBase}`, {
      method: 'POST',
      body: data
    })
  },

  async update(id: string, data: UpdatePartyContactDto) {
    return $fetch<PartyContact>(`${urlBase}/${id}`, {
      method: 'PATCH',
      body: data
    })
  },

  async remove(id: string) {
    return $fetch<void>(`${urlBase}/${id}`, {
      method: 'DELETE'
    })
  }
}
