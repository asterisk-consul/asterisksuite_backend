<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { useCorridorsStore } from '~/modulos/logistica/transport/corridors/corridors.store'
import type { CreateCorridorDto } from '~/modulos/logistica/transport/corridors/types/corridors.types'

import CorridorForm from '~/modulos/logistica/transport/corridors/components/CorridorsForm.vue'

const router = useRouter()
const store = useCorridorsStore()

const submit = async (dto: CreateCorridorDto) => {
  const corridor = await store.createCorridor(dto)
  router.push(`/logistica/viajes/corridors/${corridor.id}`)
}
</script>

<template>
  <UPage>
    <UPageHeader title="Crear corredor" />
    <UCard>
      <CorridorForm @submit="submit" @cancel="router.back()" />
    </UCard>
  </UPage>
</template>
