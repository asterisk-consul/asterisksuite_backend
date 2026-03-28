import type {
  PartyContact,
  CreatePartyContactDto
} from '../types/contacts.types'

export interface SelectMenuItem {
  label: string
  value: string
}

export type ContactForm = CreatePartyContactDto & {
  party?: SelectMenuItem
}

/**
 * Limpia strings vacíos
 */
export const clean = (value?: string) =>
  value && value.trim() !== '' ? value : undefined

/**
 * Entity → Form
 */
export const mapContactToForm = (
  c: PartyContact,
  items: SelectMenuItem[]
): ContactForm => {
  const party = items.find((i) => i.value === c.party_id)

  return {
    party_id: c.party_id ?? undefined,
    first_name: c.first_name,
    last_name: c.last_name,
    role: c.role ?? undefined,
    phone: c.phone ?? undefined,
    email: c.email ?? undefined,
    party
  }
}

/**
 * Form → DTO
 */
export const mapFormToDto = (c: ContactForm): CreatePartyContactDto => ({
  party_id: c.party?.value,
  first_name: c.first_name,
  last_name: c.last_name,
  role: clean(c.role),
  phone: clean(c.phone),
  email: clean(c.email)
})
