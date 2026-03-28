import type {
  BusinessPartyForm,
  CreateBusinessPartyInput,
  BusinessParty
} from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'
export const mapFormToBusinessPartyDto = (
  form: BusinessPartyForm
): CreateBusinessPartyInput => {
  return {
    company_id: form.company_id,
    type: form.type,
    name: form.name,
    tax_id: form.tax_id,
    phone: form.phone,
    email: form.email,

    locations: form.locations
      .filter((l) => l.location_id)
      .map((l) => ({
        location_id: l.location_id,
        label: l.label
      })),

    contacts: form.contacts
      .filter((c) => c.first_name || c.email)
      .map((c) => ({
        first_name: c.first_name,
        last_name: c.last_name,
        role: c.role,
        phone: c.phone,
        email: c.email
      }))
  }
}
export const mapBusinessPartyToForm = (
  party: BusinessParty
): BusinessPartyForm => {
  return {
    id: party.id,
    company_id: party.company_id,
    type: party.type?.toLowerCase() as 'client' | 'supplier',

    name: party.name,
    tax_id: party.tax_id ?? '',
    phone: party.phone ?? '',
    email: party.email ?? '',

    locations:
      party.party_locations?.map((l) => ({
        location_id: l.location_id ?? '',
        label: l.label ?? ''
      })) ?? [],

    contacts:
      party.party_contacts?.map((c) => ({
        first_name: c.first_name ?? '',
        last_name: c.last_name ?? '',
        role: c.role ?? '',
        phone: c.phone ?? '',
        email: c.email ?? ''
      })) ?? []
  }
}
