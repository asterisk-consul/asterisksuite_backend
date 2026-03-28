export interface File {
  id: string
  storage_provider?: string
  file_path: string
  public_url?: string
  file_name?: string
  mime_type?: string
  file_size?: number
  uploaded_by?: string
  created_at: string
  updated_at: string
}

export interface CreateFileDto {
  storage_provider?: string
  file_path: string
  public_url?: string
  file_name?: string
  mime_type?: string
  file_size?: number
  uploaded_by?: string
}

export interface UpdateFileDto extends Partial<CreateFileDto> {}

export interface QueryFileInput {
  file_name?: string
  mime_type?: string
  uploaded_by?: string
}
