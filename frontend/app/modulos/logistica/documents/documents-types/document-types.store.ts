import { defineStore } from 'pinia'
import { useDocumentTypesService } from '~/modulos/logistica/documents/documents-types/document-types.service'
import type {
  DocumentType,
  CreateDocumentTypeInput,
  DocumentEntity,
  UpdateDocumentTypeInput
} from '~/modulos/logistica/documents/documents-types/document-types.types'

export const useDocumentTypesStore = defineStore('documentTypes', () => {
  // ========================================
  // STATE
  // ========================================
  const items = ref<DocumentType[]>([])
  const current = ref<DocumentType | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = useDocumentTypesService()

  // ========================================
  // GETTERS (derivados profesionales)
  // ========================================

  const activeItems = computed(() => items.value.filter((dt) => dt.active))

  const byEntity = (entity: DocumentEntity) =>
    computed(() =>
      items.value.filter((dt) => dt.entity === entity && dt.active)
    )

  const getById = (id: string) =>
    computed(() => items.value.find((dt) => dt.id === id) ?? null)

  // ========================================
  // ACTIONS
  // ========================================

  const fetchAll = async (entity?: DocumentEntity) => {
    loading.value = true
    error.value = null

    try {
      const data = await service.getAll(entity)
      items.value = data
    } catch (err: any) {
      error.value = err?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateDocumentTypeInput) => {
    loading.value = true
    error.value = null

    try {
      const created = await service.create(payload)

      // evitar duplicados si se vuelve a fetch
      const exists = items.value.some((i) => i.id === created.id)
      if (!exists) {
        items.value.push(created)
      }

      return created
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const update = async (id: string, payload: UpdateDocumentTypeInput) => {
    loading.value = true
    error.value = null

    try {
      const updated = await service.update(id, payload)

      const index = items.value.findIndex((i) => i.id === id)
      if (index !== -1) {
        items.value[index] = updated
      }

      if (current.value?.id === id) {
        current.value = updated
      }

      return updated
    } catch (err: any) {
    } finally {
      loading.value = false
    }
  }

  const deactivate = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await service.deactivate(id)

      const item = items.value.find((i) => i.id === id)

      if (item) {
        item.active = false
      }
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const activate = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await service.activate(id)

      const item = items.value.find((i) => i.id === id)

      if (item) {
        item.active = true // ✅ sin riesgo de undefined
      }
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrent = (id: string | null) => {
    current.value = id ? (items.value.find((i) => i.id === id) ?? null) : null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // state
    items,
    current,
    loading,
    error,

    // getters
    activeItems,
    byEntity,
    getById,

    // actions
    fetchAll,
    create,
    update,
    activate,
    deactivate,
    setCurrent,
    clearError
  }
})
