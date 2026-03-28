import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDeliveryNotesService } from '~/modulos/logistica/documents/delivery-notes/delivery-notes.service'
import type {
  DeliveryNote,
  CreateDeliveryNoteInput,
  UpdateDeliveryNoteInput,
  QueryDeliveryNoteInput
} from '~/modulos/logistica/documents/delivery-notes/delivery-notes.types'

export const useDeliveryNotesStore = defineStore('deliveryNotes', () => {
  const service = useDeliveryNotesService()

  const items = ref<DeliveryNote[]>([])
  const current = ref<DeliveryNote | null>(null)
  const loading = ref(false)

  // =========================
  // LOAD LIST
  // =========================
  const fetchAll = async (query?: QueryDeliveryNoteInput) => {
    try {
      loading.value = true
      items.value = await service.findAll(query)
    } finally {
      loading.value = false
    }
  }

  // =========================
  // LOAD ONE
  // =========================
  const fetchOne = async (id: string) => {
    try {
      loading.value = true
      const data = await service.findOne(id)
      current.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // =========================
  // CREATE
  // =========================
  const create = async (payload: CreateDeliveryNoteInput) => {
    const created = await service.create(payload)
    items.value.unshift(created)
    return created
  }

  // =========================
  // UPDATE
  // =========================
  const update = async (id: string, payload: UpdateDeliveryNoteInput) => {
    const updated = await service.update(id, payload)

    const index = items.value.findIndex((i) => i.id === id)
    if (index !== -1) {
      items.value[index] = updated
    }

    if (current.value?.id === id) {
      current.value = updated
    }

    return updated
  }

  // =========================
  // CONFIRM
  // =========================
  const confirm = async (id: string) => {
    const updated = await service.confirm(id)

    const index = items.value.findIndex((i) => i.id === id)
    if (index !== -1) {
      items.value[index] = updated
    }

    if (current.value?.id === id) {
      current.value = updated
    }

    return updated
  }

  // =========================
  // DELETE
  // =========================
  const remove = async (id: string) => {
    await service.remove(id)

    items.value = items.value.filter((i) => i.id !== id)

    if (current.value?.id === id) {
      current.value = null
    }
  }

  return {
    items,
    current,
    loading,
    fetchAll,
    fetchOne,
    create,
    update,
    confirm,
    remove
  }
})
