import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePickingService } from '~/modulos/logistica/warehouses/picking/pickings.service'
import type {
  CreatePickingInput,
  TransferPalletInput,
  PickingResponse
} from '~/modulos/logistica/warehouses/picking/picking.types'

export const usePickingStore = defineStore('picking', () => {
  const service = usePickingService()

  const loading = ref(false)
  const lastPicking = ref<PickingResponse | null>(null)

  // =========================
  // CREATE PICKING
  // =========================
  const createPicking = async (payload: CreatePickingInput) => {
    try {
      loading.value = true
      const result = await service.create(payload)
      lastPicking.value = result
      return result
    } finally {
      loading.value = false
    }
  }

  // =========================
  // TRANSFER PALLET
  // =========================
  const transferPallet = async (payload: TransferPalletInput) => {
    try {
      loading.value = true
      await service.transfer(payload)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    lastPicking,
    createPicking,
    transferPallet
  }
})
