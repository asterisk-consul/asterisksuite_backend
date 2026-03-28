// stores/transfers.store.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTransfersService } from '~/modulos/logistica/transport/transfers/transfers.service'
import type {
  Transfer,
  CreateTransferInput,
  AddTransferItemInput
} from '~/modulos/logistica/transport/transfers/transfers'

export const useTransfersStore = defineStore('transfers', () => {
  const service = useTransfersService()

  const transfers = ref<Transfer[]>([])
  const loading = ref(false)
  const currentTransfer = ref<Transfer | null>(null)

  const createTransfer = async (payload: CreateTransferInput) => {
    try {
      loading.value = true
      const transfer = await service.create(payload)

      transfers.value.push(transfer)
      currentTransfer.value = transfer

      return transfer
    } finally {
      loading.value = false
    }
  }

  const addItemToTransfer = async (
    transferId: string,
    payload: AddTransferItemInput
  ) => {
    const item = await service.addItem(transferId, payload)

    const transfer = transfers.value.find((t) => t.id === transferId)
    if (transfer) {
      if (!transfer.items) transfer.items = []
      transfer.items.push(item)
    }

    return item
  }

  return {
    transfers,
    currentTransfer,
    loading,
    createTransfer,
    addItemToTransfer
  }
})
