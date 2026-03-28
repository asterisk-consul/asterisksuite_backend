export interface Company {
  id: string
  name: string
  taxId?: string
  address?: string
  phone?: string
  email?: string
  active?: boolean
  created_at?: string
  updated_at?: string
}

export type CreateCompanyInput = Omit<
  Company,
  'id' | 'active' | 'created_at' | 'updated_at'
>

export type UpdateCompanyInput = Partial<CreateCompanyInput>
