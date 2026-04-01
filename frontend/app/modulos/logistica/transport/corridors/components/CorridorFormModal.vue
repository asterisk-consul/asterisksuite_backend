<script setup lang="ts">
import type {
  Corridor,
  CreateCorridorDto
} from '~/modulos/logistica/transport/corridors/types/corridors.types'
import { useCorridorsStore } from '~/modulos/logistica/transport/corridors/corridors.store'

import CorridorForm from '~/modulos/logistica/transport/corridors/components/CorridorsForm.vue'

const props = defineProps<{
  corridor?: Corridor
}>()

const emit = defineEmits<{
  success: [corridor: Corridor]
}>()

const open = defineModel<boolean>('open', { default: false })
const store = useCorridorsStore()

const submit = async (dto: CreateCorridorDto) => {
  console.log(dto)
  const result = props.corridor
    ? await store.updateCorridor(props.corridor.id, dto)
    : await store.createCorridor(dto)

  open.value = false
  emit('success', result)
}
</script>

<template>
  <UModal v-model:open="open">
    <template #header>
      <h3 class="font-semibold">
        {{ corridor ? 'Editar corredor' : 'Crear corredor' }}
      </h3>
    </template>

    <template #body>
      <CorridorForm
        :corridor="corridor"
        @submit="submit"
        @cancel="open = false"
      />
    </template>
  </UModal>
</template>
