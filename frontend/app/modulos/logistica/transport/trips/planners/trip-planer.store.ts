import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'
import type { PlannerStop, PlannerOrder } from './TripPlanner.types'

export const useTripPlannerStore = defineStore('trip-planner', () => {
  const tripId = ref<string | null>(null)

  // 🔥 estado principal
  const stops = ref<PlannerStop[]>([])
  const selectedOrders = ref<PlannerOrder[]>([])

  const tripsStore = useTripsStore()

  // =============================
  // INIT
  // =============================
  const init = (id: string) => {
    tripId.value = id
    stops.value = []
  }

  // =============================
  // STOPS
  // =============================
  const addStop = (location_id: string) => {
    stops.value.push({
      id: crypto.randomUUID(),
      location_id,
      stop_order: stops.value.length + 1,
      orders: []
    })
  }

  const removeStop = (stopId: string) => {
    stops.value = stops.value.filter((s) => s.id !== stopId)
    reorderStops()
  }

  const reorderStops = () => {
    stops.value.forEach((s, index) => {
      s.stop_order = index + 1
    })
  }

  // =============================
  // DRAG & DROP (stops)
  // =============================
  const moveStop = (fromIndex: number, toIndex: number) => {
    const [moved] = stops.value.splice(fromIndex, 1)

    if (!moved) return

    stops.value.splice(toIndex, 0, moved)
    reorderStops()
  }

  // =============================
  // ORDERS
  // =============================
  const addOrderToStop = (
    stopId: string,
    order: PlannerOrder,
    action: 'PICKUP' | 'DELIVERY'
  ) => {
    const stop = stops.value.find((s) => s.id === stopId)
    if (!stop) return

    stop.orders.push({
      dispatch_order_id: order.id,
      order_number: order.order_number,
      customer_name: order.customers?.name,
      action
    })
  }

  const removeOrderFromStop = (stopId: string, orderId: string) => {
    const stop = stops.value.find((s) => s.id === stopId)
    if (!stop) return

    stop.orders = stop.orders.filter((o) => o.dispatch_order_id !== orderId)
  }

  // =============================
  // DRAG & DROP (orders)
  // =============================
  const moveOrder = (fromStopId: string, toStopId: string, orderId: string) => {
    const from = stops.value.find((s) => s.id === fromStopId)
    const to = stops.value.find((s) => s.id === toStopId)

    if (!from || !to) return

    const order = from.orders.find((o) => o.dispatch_order_id === orderId)
    if (!order) return

    from.orders = from.orders.filter((o) => o.dispatch_order_id !== orderId)
    to.orders.push(order)
  }

  // =============================
  // BUILD DTO (🔥 clave)
  // =============================
  const buildPayload = computed(() => ({
    stops: stops.value.map((s) => ({
      location_id: s.location_id,
      stop_order: s.stop_order,
      stop_type: s.stop_type,
      orders: s.orders.map((o) => ({
        dispatch_order_id: o.dispatch_order_id,
        action: o.action
      }))
    }))
  }))

  // =============================
  // SAVE
  // =============================
  const save = async () => {
    if (!tripId.value) return

    return tripsStore.assignOrders(tripId.value, buildPayload.value)
  }
  const toggleOrder = (order: any) => {
    const exists = selectedOrders.value.find((o) => o.id === order.id)

    if (exists) {
      selectedOrders.value = selectedOrders.value.filter(
        (o) => o.id !== order.id
      )
    } else {
      selectedOrders.value.push(order)
    }
  }

  const buildStopsFromOrders = () => {
    const map = new Map<string, PlannerStop>()

    // 🔥 limpiar primero
    stops.value = []

    selectedOrders.value.forEach((o) => {
      const origin = o.origin_location_id?.trim().toLowerCase()
      const destination = o.destination_location_id?.trim().toLowerCase()

      // ======================
      // ORIGIN (PICKUP)
      // ======================
      if (origin) {
        if (!map.has(origin)) {
          map.set(origin, {
            id: crypto.randomUUID(),
            location_id: origin,
            stop_order: 0,
            orders: []
          })
        }

        map.get(origin)!.orders.push({
          dispatch_order_id: o.id,
          order_number: o.order_number,
          customer_name: o.customers?.name, // 👈 depende de tu backend
          action: 'PICKUP'
        })
      }

      // ======================
      // DESTINATION (DELIVERY)
      // ======================
      if (destination) {
        if (!map.has(destination)) {
          map.set(destination, {
            id: crypto.randomUUID(),
            location_id: destination,
            stop_order: 0,
            orders: []
          })
        }

        map.get(destination)!.orders.push({
          dispatch_order_id: o.id,
          order_number: o.order_number,
          customer_name: o.customers?.name,
          action: 'DELIVERY'
        })
      }
    })

    // 🔥 DEBUG CLAVE
    console.log('MAP RESULT', Array.from(map.entries()))

    stops.value = Array.from(map.values())

    reorderStops()
  }
  return {
    // state
    tripId,
    stops,

    // actions
    init,
    addStop,
    removeStop,
    moveStop,
    reorderStops,

    addOrderToStop,
    removeOrderFromStop,
    moveOrder,

    save,

    toggleOrder,
    selectedOrders,
    buildStopsFromOrders,
    // computed
    buildPayload
  }
})
