import type {
  TransferRate,
  CreateTransferRateInput,
  UpdateTransferRateInput
} from '~/modulos/logistica/transport/transfer-rates/transfer-rates.types'

export const useTransferRatesService = () => {
  const base = '/api/logistica/transfer-rate'
  const getAll = (company_id: string) =>
    $fetch<TransferRate[]>(`${base}`, { query: { company_id } })

  const getById = (id: string) => $fetch<TransferRate>(`${base}+${id}`)

  const create = (body: CreateTransferRateInput) =>
    $fetch<TransferRate>(`${base}`, { method: 'POST', body })

  const update = (id: string, body: UpdateTransferRateInput) =>
    $fetch<TransferRate>(`${base}/${id}`, { method: 'PATCH', body })

  const deactivate = (id: string) =>
    $fetch<{ deleted: boolean }>(`${base}/${id}/desactivate`, {
      method: 'PATCH'
    })
  const activate = (id: string) =>
    $fetch<{ deleted: boolean }>(`${base}/${id}/activate`, {
      method: 'PATCH'
    })

  return { getAll, getById, create, update, deactivate, activate }
}
