import { computed, type Ref } from 'vue'
import type { DocumentType } from '~/modulos/logistica/documents/documents-types/document-types.types'

export interface SelectItem {
  label: string
  value: string
}

export function useDocuments(documents: Ref<DocumentType[]>) {
  const vehicleItems = computed<SelectItem[]>(() =>
    documents.value
      .filter((document) => document.entity === 'VEHICLE')
      .map((document) => ({
        label: document.name,
        value: document.id
      }))
  )

  const driverItems = computed<SelectItem[]>(() =>
    documents.value
      .filter((document) => document.entity === 'DRIVER')
      .map((document) => ({
        label: document.name,
        value: document.id
      }))
  )

  return {
    vehicleItems,
    driverItems
  }
}
