import { defineStore } from 'pinia'
import type {
  DispatchOrder,
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto
} from '../types/dispatch-orders.types'
import { useDispatchOrdersService } from '../service/dispatch-orders.service'

export const useDispatchOrdersStore = defineStore('dispatch-orders', () => {
  const service = useDispatchOrdersService()

  const dispatchOrders = ref<DispatchOrder[]>([])
  const currentDispatchOrder = ref<DispatchOrder | null>(null)

  const loading = ref(false)

  // 🔹 GET ALL
  const fetchAll = async () => {
    loading.value = true
    try {
      dispatchOrders.value = await service.findAll()
    } finally {
      loading.value = false
    }
  }

  // 🔹 GET ONE
  const fetchOne = async (id: string) => {
    currentDispatchOrder.value = await service.findOne(id)
  }

  // 🔹 CREATE
  const create = async (data: CreateDispatchOrderDto) => {
    const order = await service.create(data)
    dispatchOrders.value.push(order)
    return order
  }

  // 🔹 UPDATE
  const update = async (id: string, data: UpdateDispatchOrderDto) => {
    const updated = await service.update(id, data)

    const index = dispatchOrders.value.findIndex((o) => o.id === id)
    if (index !== -1) {
      dispatchOrders.value[index] = updated
    }

    // mantener sincronizado el current
    if (currentDispatchOrder.value?.id === id) {
      currentDispatchOrder.value = updated
    }

    return updated
  }

  // 🔹 DELETE
  const deleteDispachOrder = async (id: string) => {
    await service.remove(id)
    dispatchOrders.value = dispatchOrders.value.filter((o) => o.id !== id)
  }

  return {
    dispatchOrders,
    currentDispatchOrder,
    loading,
    fetchAll,
    fetchOne,
    create,
    update,
    deleteDispachOrder
  }
})
