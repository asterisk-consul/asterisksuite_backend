import { computed, type Ref } from 'vue'
import type { PartyContact } from '../types/contacts.types'

export interface SelectItem {
  label: string
  value: string
}

export function usePartyContacts(contacts: Ref<PartyContact[]>) {
  /**
   * Nombre completo (reutilizable en toda la app)
   */
  const getFullName = (contact: PartyContact) => {
    return `${contact.first_name} ${contact.last_name}`
  }

  /**
   * Label enriquecido (para selects o listas)
   */
  const getLabel = (contact: PartyContact) => {
    const name = getFullName(contact)

    if (contact.role) {
      return `${name} (${contact.role})`
    }

    return name
  }

  /**
   * Items para USelect
   */
  const items = computed<SelectItem[]>(() =>
    contacts.value.map((contact) => ({
      label: getLabel(contact),
      value: contact.id
    }))
  )

  /**
   * Map rápido por id (lookup O(1))
   */
  const mapById = computed<Record<string, PartyContact>>(() => {
    return Object.fromEntries(contacts.value.map((c) => [c.id, c]))
  })

  /**
   * Buscar contacto por id (útil en forms)
   */
  const findById = (id?: string | null) => {
    if (!id) return null
    return mapById.value[id] ?? null
  }

  /**
   * Filtrar por party (clave en tu caso)
   */
  const filterByParty = (party_id: string) => {
    return contacts.value.filter((c) => c.party_id === party_id)
  }

  /**
   * Búsqueda simple (para autocompletes)
   */
  const search = (term: string) => {
    const t = term.toLowerCase()

    return contacts.value.filter((c) => {
      return (
        c.first_name.toLowerCase().includes(t) ||
        c.last_name.toLowerCase().includes(t) ||
        c.email?.toLowerCase().includes(t)
      )
    })
  }

  return {
    items,
    getFullName,
    getLabel,
    findById,
    filterByParty,
    search
  }
}
