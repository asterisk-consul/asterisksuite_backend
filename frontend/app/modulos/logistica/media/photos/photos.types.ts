export interface Photo {
  id: string
  entity_type: string
  entity_id: string
  file_id: string
  photo_type?: string
  created_at: string
  updated_at: string
}

export interface CreatePhotoDto {
  entity_type: string
  entity_id: string
  file_id: string
  photo_type?: string
}
