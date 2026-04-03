<script setup lang="ts">
import draggable from 'vuedraggable'
import { ref, computed, watch, onMounted } from 'vue'

import { useTripPlannerStore } from './trip-planer.store'
import { useDispatchOrdersStore } from '~/modulos/logistica/documents/dispatch-orders/store/dispatch-orders.store'
import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'

const planner = useTripPlannerStore()
const dispatchStore = useDispatchOrdersStore()
const tripsStore = useTripsStore()

const selectedTripId = ref<string | null>(null)

// cargar data
onMounted(async () => {
  await tripsStore.fetchAll() // ⚠️ poné tu companyId real
  await dispatchStore.fetchAll()
})

// viaje seleccionado
const selectedTrip = computed(() =>
  tripsStore.items.find((t) => t.id === selectedTripId.value)
)

// solo editable si está en planned
const isEditable = computed(() => selectedTrip.value?.status === 'PLANNED')

// init planner cuando cambia el trip
watch(selectedTripId, (id) => {
  if (!id) return
  planner.init(id)
})

// helper drag
const onAddOrder = (event: any, stopId: string) => {
  const order =
    event?.item?._underlying_vm_ || event?.item?.__draggable_context?.element

  const stop = planner.stops.find((s) => s.id === stopId)
  if (!stop || !order) return

  const action =
    stop.location_id === order.origin_location_id ? 'PICKUP' : 'DELIVERY'
}
</script>

<template>
  <div class="space-y-6">
    <!-- 🚛 SELECT TRIP -->
    <div>
      <h2 class="font-bold mb-2">Seleccionar viaje</h2>

      <select v-model="selectedTripId" class="border p-2 rounded w-full">
        <option disabled value="">Seleccionar viaje</option>

        <option
          v-for="trip in tripsStore.items.filter((t) => t.status === 'PLANNED')"
          :key="trip.id"
          :value="trip.id"
        >
          {{ trip.reference_number || trip.id }}
        </option>
      </select>
    </div>

    <!-- 🔒 bloqueo -->
    <div v-if="selectedTrip && !isEditable" class="text-red-500">
      Este viaje no se puede editar (no está en PLANNED)
    </div>

    <div v-if="selectedTripId" class="grid grid-cols-2 gap-6">
      <!-- 📦 ORDENES -->
      <div>
        <h2 class="font-bold mb-2">Órdenes disponibles</h2>

        <div
          v-for="order in dispatchStore.dispatchOrders"
          :key="order.id"
          class="p-2 mb-2 border rounded flex justify-between"
        >
          <div>
            <strong>{{ order.order_number }}</strong>
            <br />
            <small>
              {{ order.origin_location?.city }} →
              {{ order.destination_location?.city }}
            </small>
          </div>

          <input
            type="checkbox"
            :disabled="!isEditable"
            :checked="planner.selectedOrders.some((o) => o.id === order.id)"
            @change="planner.toggleOrder(order)"
          />
        </div>

        <button
          class="mt-3 p-2 bg-purple-600 text-white rounded"
          :disabled="!isEditable"
          @click="planner.buildStopsFromOrders"
        >
          Generar ruta
        </button>
      </div>

      <!-- 🚛 STOPS -->
      <div>
        <h2 class="font-bold mb-2">Ruta del viaje</h2>

        <draggable
          v-model="planner.stops"
          item-key="id"
          handle=".handle"
          @end="planner.reorderStops"
        >
          <template #item="{ element: stop, index }">
            <div class="mb-4 p-3 border rounded bg-white">
              <!-- header -->
              <div class="flex justify-between items-center mb-2">
                <div class="handle cursor-move">☰</div>
                <div>
                  Stop {{ index + 1 }}
                  <br />
                  <small>{{ stop.location_id }}</small>
                </div>
                <button
                  :disabled="!isEditable"
                  @click="planner.removeStop(stop.id)"
                >
                  ❌
                </button>
              </div>

              <!-- órdenes -->
              <draggable
                v-model="stop.orders"
                :group="{ name: 'orders', pull: true, put: true }"
                item-key="dispatch_order_id"
                @add="(e: any) => onAddOrder(e, stop.id)"
              >
                <template #item="{ element }">
                  <div class="p-2 mb-2 bg-blue-100 rounded">
                    {{ element.dispatch_order_id }} ({{ element.action }})
                  </div>
                </template>
              </draggable>
            </div>
          </template>
        </draggable>

        <!-- agregar stop manual -->
        <button
          class="mt-4 p-2 bg-green-500 text-white rounded"
          :disabled="!isEditable"
          @click="planner.addStop('TEMP_LOCATION')"
        >
          + Agregar stop
        </button>

        <!-- guardar -->
        <button
          class="mt-4 ml-2 p-2 bg-blue-600 text-white rounded"
          :disabled="!isEditable"
          @click="planner.save"
        >
          Guardar planificación
        </button>
      </div>
    </div>
  </div>
</template>
