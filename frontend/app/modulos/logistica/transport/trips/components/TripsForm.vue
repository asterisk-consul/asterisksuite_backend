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
import { useBusinessPartiesStore } from '~/modulos/logistica/master-data/bussiness-parties/bussines-parties.store'
import { useCorridorsStore } from '~/modulos/logistica/transport/corridors/corridors.store'
import { useLocationsStore } from '~/modulos/logistica/master-data/locations/store/locations.store'
import { useVehicleCombinationsStore } from '~/modulos/logistica/transport/vehicles-combinations/vehicle-combinations.store'

//composables
import { useBusinessParties } from '~/modulos/logistica/master-data/bussiness-parties/composable/useBusinessParties'
import { useCorridorForm } from '~/modulos/logistica/transport/corridors/composables/useCorridors'
import { useLocations } from '~/modulos/logistica/master-data/locations/composables/useLocations'
import { useVehiclesCombinations } from '~/modulos/logistica/transport/vehicles-combinations/composables/useVehicleCombinations'

//components
import CorridorFormModal from '~/modulos/logistica/transport/corridors/components/CorridorFormModal.vue'

const props = defineProps<{
  trip?: Trip
  companyId: string
}>()

const emit = defineEmits<{
  submit: [trip: CreateTripInput]
  cancel: []
}>()

const isEdit = computed(() => !!props.trip)

/**
 * STORES
 */
const businessPartiesStore = useBusinessPartiesStore()
const corridorsStore = useCorridorsStore()
const locationsStore = useLocationsStore()
const vehicleCombinationsStore = useVehicleCombinationsStore()

const { items: businessParties } = storeToRefs(businessPartiesStore)
const { corridors } = storeToRefs(corridorsStore)
const { items: locations } = storeToRefs(locationsStore)
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

const { items } = useBusinessParties(businessParties)
const { items: corridorsItems } = useCorridorForm(
  undefined,
  undefined,
  corridors
)
const { items: locationsItems } = useLocations(locations)
const { items: vehicleCombinationsItems } = useVehiclesCombinations(
  vehicleCombinationsSource
)

/**
 * MODAL CORREDOR
 */
const showCorridorModal = ref(false)
const selectedCorridor = ref<Corridor | undefined>(undefined)

const onEditCorridor = () => {
  if (!form.corridor_id) return
  const corridor = corridors.value.find((c) => c.id === form.corridor_id)
  if (!corridor) return
  selectedCorridor.value = corridor
  showCorridorModal.value = true
}

const onCorridorSaved = async (corridor: Corridor) => {
  await corridorsStore.fetchCorridors()
  form.corridor_id = corridor.id
  selectedCorridor.value = undefined
}

watch(showCorridorModal, (open) => {
  if (!open) selectedCorridor.value = undefined
})

/**
 * FORM
 */
const form = reactive<TripForm>({
  company_id: props.companyId,
  reference_number: '',
  week: null,
  vehicle_combination_id: null,
  origin_location_id: null,
  destination_location_id: null,
  corridor_id: null,
  route: undefined,
  departure_time: null,
  arrival_time: null,
  status: 'PLANNED',
  statusOption: statusOptions[0],
  kilometers: null,
  business_party_id: null,
  business_party: null
})

/**
 * Sync edit
 */
watch(
  [items, () => props.trip],
  () => {
    if (!items.value.length) return
    if (props.trip) {
      Object.assign(form, mapTripToForm(props.trip, items.value))
    }
  },
  { immediate: true }
)

/**
 * Watch departure_time — solo limpia el vehículo si el usuario
 * cambia la fecha manualmente (no en la carga inicial)
 */
const isHydrating = ref(true)

watch(
  () => form.departure_time,
  async (date, prevDate) => {
    if (!date) return

    await vehicleCombinationsStore.fetchAvailable(props.companyId, date)

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
  await Promise.all([
    businessPartiesStore.fetchAll(props.companyId),
    corridorsStore.fetchCorridors(),
    locationsStore.fetchAll(),
    vehicleCombinationsStore.fetchAll(props.companyId)
  ])
})

/**
 * Select corredor
 */
const onCorridorSelect = (item: SelectMenuItem | null) => {
  if (!item) return
  form.corridor_id = item.value
  const selected = corridors.value.find((c) => c.id === item.value)
  if (!selected) return
  form.origin_location_id = selected.origin_location_id ?? undefined
  form.destination_location_id = selected.destination_location_id ?? undefined
  form.kilometers = selected.total_distance_km ?? undefined
}

const isLockedByCorridor = computed(() => !!form.corridor_id)
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

      <!-- Cliente -->
      <UFormField label="Cliente">
        <USelectMenu
          v-model="form.business_party"
          :items="items"
          clear
          class="w-full"
          option-attribute="label"
          value-attribute="value"
        />
      </UFormField>

      <!-- Corredor -->
      <UFormField label="Corredor">
        <div class="flex w-full gap-2">
          <USelectMenu
            :model-value="
              corridorsItems.find((c) => c.value === form.corridor_id)
            "
            :items="corridorsItems"
            option-attribute="label"
            value-attribute="value"
            class="flex-1"
            @update:model-value="onCorridorSelect"
            clear
          />
          <UButton
            icon="i-lucide-plus"
            variant="outline"
            @click="showCorridorModal = true"
          />
          <UButton
            icon="i-lucide-pencil"
            variant="outline"
            :disabled="!form.corridor_id"
            @click="onEditCorridor"
          />
        </div>
      </UFormField>

      <!-- Origen -->
      <UFormField label="Origen">
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
      </UFormField>

      <!-- Destino -->
      <UFormField label="Destino">
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
      </UFormField>

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

  <!-- Modal -->
  <CorridorFormModal
    v-model:open="showCorridorModal"
    :corridor="selectedCorridor"
    @success="onCorridorSaved"
  />
</template>
