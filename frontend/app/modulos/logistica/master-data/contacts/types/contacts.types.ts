export interface BusinessParty {
  id: string
  company_id: string
  type: string
  name: string
  tax_id?: string
  phone?: string
  email?: string
  active: boolean
  created_at: string
}

export interface PartyContact {
  id: string
  party_id?: string

  first_name: string
  last_name: string

  role?: string
  phone?: string
  email?: string

  created_at: string
  updated_at?: string

  business_parties?: BusinessParty | null
}

export type CreatePartyContactDto = Omit<
  PartyContact,
  'id' | 'created_at' | 'updated_at' | 'business_parties'
>

export type UpdatePartyContactDto = Partial<CreatePartyContactDto>
