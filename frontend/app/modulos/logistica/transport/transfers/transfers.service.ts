import type {
  Transfer,
  TransferItem,
  CreateTransferInput,
  AddTransferItemInput
} from '~/modulos/logistica/transport/transfers/transfers'

export const useTransfersService = () => {
  const create = (data: CreateTransferInput) =>
    $fetch<Transfer>('/api/logistica/transport/transfers', {
      method: 'POST',
      body: data
    })

  const addItem = (transferId: string, data: AddTransferItemInput) =>
    $fetch<TransferItem>(
      `/api/logistica/transport/transfers/${transferId}/items`,
      {
        method: 'POST',
        body: data
      }
    )

  return {
    create,
    addItem
  }
}
