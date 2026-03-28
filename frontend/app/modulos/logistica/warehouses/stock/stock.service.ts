import type {
  WarehouseStockItem,
  StockMovement,
  CreateStockMovementInput
} from '~/modulos/logistica/warehouses/stock/stock.types'

export const useStockService = () => {
  const getStock = (warehouseId: string) =>
    $fetch<WarehouseStockItem[]>(
      `/api/logistica/warehouse/stock/${warehouseId}`
    )

  const getMovements = (warehouseId: string) =>
    $fetch<StockMovement[]>(
      `/api/logistica/warehouse/stock/${warehouseId}/movements`
    )

  const createMovement = (body: CreateStockMovementInput) =>
    $fetch<StockMovement>('/api/logistica/warehouse/stock/movement', {
      method: 'POST',
      body
    })

  return {
    getStock,
    getMovements,
    createMovement
  }
}
