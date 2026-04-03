import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDispatchOrdersStore } from '~/modulos/logistica/documents/dispatch-orders/store/dispatch-orders.store'

export function useDispatchOrders() {
  const store = useDispatchOrdersStore()
  const { dispatchOrders, loading } = storeToRefs(store)

  const items = computed(() =>
    dispatchOrders.value.map((o) => ({
      ...o,
      label: o.order_number ?? o.id
    }))
  )

  return {
    items,
    loading,
    fetchAll: store.fetchAll
  }
}
