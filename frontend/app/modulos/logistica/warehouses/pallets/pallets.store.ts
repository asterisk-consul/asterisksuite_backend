import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePalletsService } from '~/modulos/logistica/warehouses/pallets/pallets.service'
import type {
  Pallet,
  CreatePalletInput,
  UpdatePalletInput
} from '~/modulos/logistica/warehouses/pallets/pallets.types'

export const usePalletsStore = defineStore('pallets', () => {
  const service = usePalletsService()

  const pallets = ref<Pallet[]>([])
  const currentPallet = ref<Pallet | null>(null)
  const loading = ref(false)

  // =========================
  // FETCH ALL
  // =========================
  const fetchPallets = async (company_id: string) => {
    try {
      loading.value = true
      const data = await service.getAll(company_id)
      pallets.value = data
    } finally {
      loading.value = false
    }
  }

  // =========================
  // FETCH ONE
  // =========================
  const fetchPalletById = async (id: string) => {
    const pallet = await service.getById(id)
    currentPallet.value = pallet
    return pallet
  }

  // =========================
  // CREATE
  // =========================
  const createPallet = async (payload: CreatePalletInput) => {
    const pallet = await service.create(payload)
    pallets.value.push(pallet)
    return pallet
  }

  // =========================
  // UPDATE
  // =========================
  const updatePallet = async (id: string, payload: UpdatePalletInput) => {
    const updated = await service.update(id, payload)

    const index = pallets.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      pallets.value[index] = updated
    }

    if (currentPallet.value?.id === id) {
      currentPallet.value = updated
    }

    return updated
  }

  // =========================
  // DELETE (softDelete backend)
  // =========================
  const removePallet = async (id: string) => {
    await service.remove(id)

    // Si tu backend hace softDelete y devuelve active=false,
    // podrías refrescar en vez de eliminar.
    pallets.value = pallets.value.filter((p) => p.id !== id)

    if (currentPallet.value?.id === id) {
      currentPallet.value = null
    }
  }

  return {
    pallets,
    currentPallet,
    loading,
    fetchPallets,
    fetchPalletById,
    createPallet,
    updatePallet,
    removePallet
  }
})
