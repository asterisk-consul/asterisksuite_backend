export interface Location {
  id: string
  address?: string
  city?: string
  province?: string
  country?: string
  postalCode?: string
  latitude?: number
  longitude?: number
  created_at?: string
  updated_at?: string
}

export type CreateLocationInput = Omit<
  Location,
  'id' | 'created_at' | 'updated_at'
>

export type UpdateLocationInput = Partial<CreateLocationInput>
