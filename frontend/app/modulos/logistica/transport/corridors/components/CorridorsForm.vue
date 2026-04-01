<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLocationsStore } from '~/modulos/logistica/master-data/locations/store/locations.store'
import { useLocations } from '~/modulos/logistica/master-data/locations/composables/useLocations'

import type {
  CorridorWithRelations,
  CreateCorridorDto
} from '~/modulos/logistica/transport/corridors/types/corridors.types'

const props = defineProps<{
  corridor?: CorridorWithRelations
}>()

const emit = defineEmits<{
  submit: [dto: CreateCorridorDto]
  cancel: []
}>()

const locationsStore = useLocationsStore()
const { items: locations } = storeToRefs(locationsStore)

const isEdit = computed(() => !!props.corridor)

const form = reactive<CreateCorridorDto>({
  name: props.corridor?.name ?? '',
  origin_location_id: props.corridor?.origin_location_id ?? '',
  destination_location_id: props.corridor?.destination_location_id ?? '',
  is_template: props.corridor?.is_template ?? true,
  stops:
    props.corridor?.corridorStops?.map((s) => ({
      location_id: s.location_id,
      stop_order: s.stop_order,
      stop_type: s.stop_type
    })) ?? []
})

const { items: allLocationItems } = useLocations(locations)

const stopLocationIds = computed(() =>
  form.stops.map((s) => s.location_id).filter(Boolean)
)

const originItems = computed(() =>
  allLocationItems.value.filter(
    (item) =>
      item.value !== form.destination_location_id &&
      !stopLocationIds.value.includes(item.value)
  )
)

const destinationItems = computed(() =>
  allLocationItems.value.filter(
    (item) =>
      item.value !== form.origin_location_id &&
      !stopLocationIds.value.includes(item.value)
  )
)

const stopItems = (index: number) => {
  const otherStopIds = form.stops
    .filter((_, i) => i !== index)
    .map((s) => s.location_id)
    .filter(Boolean)

  return allLocationItems.value.filter(
    (item) =>
      item.value !== form.origin_location_id &&
      item.value !== form.destination_location_id &&
      !otherStopIds.includes(item.value)
  )
}

const addStop = () => {
  form.stops.push({
    location_id: '',
    stop_order: form.stops.length + 1
  })
}

const removeStop = (index: number) => {
  form.stops.splice(index, 1)

  form.stops.forEach((s, i) => {
    s.stop_order = i + 1
  })
}

onMounted(async () => {
  await locationsStore.fetchAll()
})

const submit = () => {
  emit('submit', form)
}
</script>

<template>
  <UForm @submit="submit" class="space-y-6">
    <UFormField label="Nombre" class="w-full">
      <UInput
        v-model="form.name"
        placeholder="Ruta Córdoba - Rosario"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Origen" class="w-full">
        <USelect
          class="w-full"
          v-model="form.origin_location_id"
          :items="originItems"
          placeholder="Seleccionar origen"
        />
      </UFormField>

      <UFormField label="Destino" class="w-full">
        <USelect
          class="w-full"
          v-model="form.destination_location_id"
          :items="destinationItems"
          placeholder="Seleccionar destino"
        />
      </UFormField>
    </div>

    <div>
      <div class="flex justify-between mb-2 w-full">
        <h3 class="font-semibold">Paradas</h3>
        <UButton size="sm" variant="soft" color="warning" @click="addStop">
          Agregar parada
        </UButton>
      </div>

      <div class="space-y-2">
        <UCard
          v-for="(stop, index) in form.stops"
          :key="index"
          :ui="{
            body: 'flex items-center gap-3'
          }"
        >
          <span class="text-sm w-6">{{ index + 1 }}</span>

          <USelect
            v-model="stop.location_id"
            :items="stopItems(index)"
            placeholder="Seleccionar parada"
            class="flex-1"
          />

          <UButton
            color="error"
            variant="ghost"
            icon="i-lucide-trash"
            @click="removeStop(index)"
          />
        </UCard>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <UButton variant="ghost" @click="emit('cancel')">Cancelar</UButton>
      <UButton type="submit">
        {{ isEdit ? 'Guardar cambios' : 'Crear corredor' }}
      </UButton>
    </div>
  </UForm>
</template>
