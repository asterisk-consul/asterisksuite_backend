export interface ImportRowError {
  row: number
  errors: string[]
}

export interface ImportResult {
  success: boolean
  total: number
  parsed: number
  saved: number
  failed: number
  errors?: ImportRowError[]
  message?: string
}

export const FileService = {
  async apiPostFile(file: File): Promise<ImportResult> {
    const config = useRuntimeConfig()

    const formData = new FormData()
    formData.append('file', file)

    return await $fetch<ImportResult>(
      `${config.public.apiBase}/api/data-import/articulo-precio`,
      {
        method: 'POST',
        body: formData
      }
    )
  }
}
