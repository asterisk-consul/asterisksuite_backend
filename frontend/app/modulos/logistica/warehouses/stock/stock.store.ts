import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStockService } from '~/modulos/logistica/warehouses/stock/stock.service'
import type {
  WarehouseStockItem,
  StockMovement,
  CreateStockMovementInput
} from '~/modulos/logistica/warehouses/stock/stock.types'

export const useStockStore = defineStore('stock', () => {
  const service = useStockService()

  const stock = ref<WarehouseStockItem[]>([])
  const movements = ref<StockMovement[]>([])
  const loading = ref(false)

  const currentWarehouseId = ref<string | null>(null)

  // =========================
  // LOAD STOCK
  // =========================
  const fetchStock = async (warehouseId: string) => {
    try {
      loading.value = true
      currentWarehouseId.value = warehouseId
      stock.value = await service.getStock(warehouseId)
    } finally {
      loading.value = false
    }
  }

  // =========================
  // LOAD MOVEMENTS
  // =========================
  const fetchMovements = async (warehouseId: string) => {
    try {
      loading.value = true
      movements.value = await service.getMovements(warehouseId)
    } finally {
      loading.value = false
    }
  }

  // =========================
  // CREATE MOVEMENT
  // =========================
  const createMovement = async (payload: CreateStockMovementInput) => {
    const movement = await service.createMovement(payload)

    // agregar al historial
    movements.value.unshift(movement)

    // actualizar stock local si coincide warehouse
    if (payload.warehouse_id === currentWarehouseId.value) {
      const item = stock.value.find((s) => s.product_id === payload.product_id)

      if (item) {
        const currentQty = parseFloat(item.quantity)
        const moveQty = parseFloat(payload.quantity)

        item.quantity =
          payload.direction === 'IN'
            ? (currentQty + moveQty).toString()
            : (currentQty - moveQty).toString()
      }
    }

    return movement
  }

  return {
    stock,
    movements,
    loading,
    currentWarehouseId,
    fetchStock,
    fetchMovements,
    createMovement
  }
})
