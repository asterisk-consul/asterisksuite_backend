export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'switch'
  | 'select'
  | 'autocomplete'
  | 'date'
  | 'file'

export interface Option {
  label: string
  value: any
}

export interface FieldConfig {
  name: string
  label: string
  type: FieldType

  placeholder?: string
  required?: boolean
  disabled?: boolean

  // Select estático
  options?: Option[]

  // Select remoto / autocomplete
  fetchOptions?: (query?: string, state?: any) => Promise<Option[]>

  // Dependencias
  dependsOn?: string[]
  visible?: (state: any) => boolean

  // Upload
  accept?: string

  // Layout
  col?: number
}

export interface SectionConfig {
  title?: string
  fields: FieldConfig[]
}

export interface FormConfig {
  sections: SectionConfig[]
  initial?: Record<string, any>

  load?: (id: string) => Promise<any> // modo edit
  submit: (data: any, id?: string) => Promise<void>
}
