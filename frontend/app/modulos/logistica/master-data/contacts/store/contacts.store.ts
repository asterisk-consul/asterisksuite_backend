import { defineStore } from 'pinia'
import { partyContactsService } from '../service/contacts.service'
import type {
  PartyContact,
  CreatePartyContactDto,
  UpdatePartyContactDto
} from '../types/contacts.types'

export const usePartyContactsStore = defineStore('partyContacts', {
  state: () => ({
    contacts: [] as PartyContact[],
    current: null as PartyContact | null,
    loading: false
  }),

  actions: {
    async fetchAll(party_id?: string) {
      this.loading = true
      try {
        this.contacts = await partyContactsService.getAll(party_id)
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id: string) {
      this.loading = true
      try {
        this.current = await partyContactsService.getById(id)
      } finally {
        this.loading = false
      }
    },

    async create(data: CreatePartyContactDto) {
      const newItem = await partyContactsService.create(data)
      this.contacts.unshift(newItem)
      return newItem
    },

    async update(id: string, data: UpdatePartyContactDto) {
      const updated = await partyContactsService.update(id, data)

      const index = this.contacts.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.contacts[index] = updated
      }

      if (this.current?.id === id) {
        this.current = updated
      }

      return updated
    },

    async remove(id: string) {
      await partyContactsService.remove(id)

      this.contacts = this.contacts.filter((c) => c.id !== id)

      if (this.current?.id === id) {
        this.current = null
      }
    }
  }
})
