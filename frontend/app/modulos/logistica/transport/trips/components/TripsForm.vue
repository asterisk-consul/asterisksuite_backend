<script setup lang="ts">
import type {
  Trip,
  CreateTripInput
} from '~/modulos/logistica/transport/trips/types/trips.types'

import type { Corridor } from '~/modulos/logistica/transport/corridors/types/corridors.types'

import {
  mapTripToForm,
  mapFormToDto,
  statusOptions,
  type TripForm
} from '~/modulos/logistica/transport/trips/mappers/trips.mapper'

import type { SelectMenuItem } from '~/modulos/logistica/transport/corridors/composables/useCorridors'

//stores
import { useVehicleCombinationsStore } from '~/modulos/logistica/transport/vehicles-combinations/vehicle-combinations.store'

//composables
import { useVehiclesCombinations } from '~/modulos/logistica/transport/vehicles-combinations/composables/useVehicleCombinations'

const props = defineProps<{
  trip?: Trip
}>()

const emit = defineEmits<{
  submit: [trip: CreateTripInput]
  cancel: []
}>()

const isEdit = computed(() => !!props.trip)

/**
 * STORES
 */

const vehicleCombinationsStore = useVehicleCombinationsStore()

const { items: vehicleCombinations, available } = storeToRefs(
  vehicleCombinationsStore
)

/**
 * COMPOSABLES
 */

// Si hay fecha, usa available pero asegura incluir el vehículo ya asignado
const vehicleCombinationsSource = computed(() => {
  if (!form.departure_time) return vehicleCombinations.value

  const base = available.value
  const assignedId = form.vehicle_combination_id
  if (!assignedId) return base

  const alreadyInList = base.some((vc) => vc.id === assignedId)
  if (alreadyInList) return base

  // Incluir el vehículo asignado aunque no esté en available
  const current = vehicleCombinations.value.find((vc) => vc.id === assignedId)
  return current ? [...base, current] : base
})

const { items: vehicleCombinationsItems } = useVehiclesCombinations(
  vehicleCombinationsSource
)

/**
 * MODAL CORREDOR
 */
const showCorridorModal = ref(false)
const selectedCorridor = ref<Corridor | undefined>(undefined)

watch(showCorridorModal, (open) => {
  if (!open) selectedCorridor.value = undefined
})

/**
 * FORM
 */
const form = reactive<TripForm>({
  reference_number: '',
  week: null,
  vehicle_combination_id: null,
  origin_location_id: null,
  destination_location_id: null,
  departure_time: null,
  arrival_time: null,
  status: 'PLANNED',
  statusOption: statusOptions[0],
  kilometers: null
})

const isHydrating = ref(true)

watch(
  () => form.departure_time,
  async (date, prevDate) => {
    if (!date) return

    await vehicleCombinationsStore.fetchAvailable(date)

    // Si es la primera vez que se dispara (hidratación del form en edit),
    // no limpiar el vehículo
    if (isHydrating.value) {
      isHydrating.value = false
      return
    }

    // Solo limpiar si el usuario cambió la fecha (había una fecha anterior)
    if (prevDate && prevDate !== date) {
      const stillAvailable = available.value.some(
        (vc) => vc.id === form.vehicle_combination_id
      )
      if (!stillAvailable) {
        form.vehicle_combination_id = null
      }
    }
  }
)

watch(
  () => props.trip,
  (trip) => {
    if (!trip) return

    const mapped = mapTripToForm(trip)

    Object.assign(form, mapped)
  },
  { immediate: true }
)

/**
 * Submit
 */
const submit = () => {
  emit('submit', mapFormToDto(form))
}

/**
 * Fetch
 */
onMounted(async () => {
  await Promise.all([vehicleCombinationsStore.fetchAll()])
})

const isLockedByDate = computed(() => !form.departure_time)
</script>

<template>
  <UForm @submit="submit" class="space-y-6">
    <UCard :ui="{ body: 'grid grid-cols-2 gap-4' }">
      <!-- Referencia -->
      <UFormField label="Referencia">
        <UInput v-model="form.reference_number" class="w-full" />
      </UFormField>
      <UFormField label="Semana n°">
        <UInput
          :model-value="form.week ?? undefined"
          @update:model-value="form.week = $event ?? null"
          type="text"
          class="w-full"
        />
      </UFormField>

      <!-- Origen -->
      <!-- <UFormField label="Origen">
        <USelectMenu
          :model-value="
            locationsItems.find((l) => l.value === form.origin_location_id)
          "
          :items="locationsItems"
          option-attribute="label"
          value-attribute="value"
          class="w-full"
          :disabled="isLockedByCorridor"
          @update:model-value="
            (item: SelectMenuItem | null) =>
              (form.origin_location_id = item?.value)
          "
          clear
        />
      </UFormField> -->

      <!-- Destino -->
      <!-- <UFormField label="Destino">
        <USelectMenu
          :model-value="
            locationsItems.find((l) => l.value === form.destination_location_id)
          "
          :items="locationsItems"
          option-attribute="label"
          value-attribute="value"
          class="w-full"
          :disabled="isLockedByCorridor"
          @update:model-value="
            (item: SelectMenuItem | null) =>
              (form.destination_location_id = item?.value)
          "
          clear
        />
      </UFormField> -->

      <!-- Fechas -->
      <UFormField label="Salida">
        <UInput
          type="datetime-local"
          :model-value="form.departure_time ?? undefined"
          @update:model-value="form.departure_time = $event ?? null"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Llegada">
        <UInput
          type="datetime-local"
          :model-value="form.arrival_time ?? undefined"
          @update:model-value="form.arrival_time = $event ?? null"
          class="w-full"
        />
      </UFormField>

      <!-- Vehiculo -->
      <UFormField label="Unidad">
        <USelectMenu
          :model-value="
            vehicleCombinationsItems.find(
              (v) => v.value === form.vehicle_combination_id
            )
          "
          :items="vehicleCombinationsItems"
          :placeholder="
            !form.departure_time
              ? 'Seleccioná una fecha de salida primero'
              : !vehicleCombinationsItems.length
                ? 'No hay unidades disponibles para esta fecha'
                : 'Seleccionar unidad'
          "
          option-attribute="label"
          value-attribute="value"
          class="w-full"
          :disabled="isLockedByDate"
          clear
          @update:model-value="
            (item: SelectMenuItem | null) =>
              (form.vehicle_combination_id = item?.value)
          "
        />
      </UFormField>

      <UFormField label="Estado">
        <USelectMenu
          v-model="form.statusOption"
          :items="statusOptions"
          class="w-full"
          option-attribute="label"
          value-attribute="value"
        />
      </UFormField>

      <!-- Km -->
      <!-- <UFormField label="Kilómetros">
        <UInput
          type="number"
          :model-value="form.kilometers ?? undefined"
          @update:model-value="
            (val: number | undefined) => (form.kilometers = val ?? null)
          "
          class="w-full"
        />
      </UFormField> -->
    </UCard>

    <!-- Actions -->
    <div class="flex justify-end gap-2">
      <UButton variant="ghost" @click="emit('cancel')">Cancelar</UButton>
      <UButton type="submit">
        {{ isEdit ? 'Guardar cambios' : 'Crear viaje' }}
      </UButton>
    </div>
  </UForm>
</template>
