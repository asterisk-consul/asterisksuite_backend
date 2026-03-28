export interface VehicleCombination {
  id: string
  company_id: string
  tractor_id: string
  trailer_id?: string | null
  driver_id?: string | null
  unit_number?: string | null
  valid_from: string
  valid_until?: string | null
  created_at: string
  deleted_at?: string | null
  deleted_by?: string | null
  tractor?: { id: string; plate: string; brand?: string; model?: string } // ✅ corregido
  trailer?: { id: string; plate: string; brand?: string; model?: string } // ✅ corregido
  drivers?: { id: string; first_name: string; last_name: string } // ✅ corregido
}

export interface CreateVehicleCombinationInput {
  company_id: string
  tractor_id: string
  trailer_id?: string
  driver_id?: string
  unit_number?: string
  valid_from: string
  valid_until?: string
}

export interface UpdateVehicleCombinationInput extends Partial<CreateVehicleCombinationInput> {}
