<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCorridorsStore } from '~/modulos/logistica/transport/corridors/corridors.store'
import type { CreateCorridorDto } from '~/modulos/logistica/transport/corridors/types/corridors.types'
import CorridorForm from '~/modulos/logistica/transport/corridors/components/CorridorsForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'logistica'
})

const route = useRoute()
const router = useRouter()
const store = useCorridorsStore()

const id = route.params.id as string
const loading = ref(true)

const corridor = computed(() => store.currentCorridor)

onMounted(async () => {
  try {
    await store.fetchCorridor(id)
  } finally {
    loading.value = false
  }
})

const submit = async (dto: CreateCorridorDto) => {
  await store.updateCorridor(id, dto)
  router.push(`/logistica/transport/corridors/${id}`)
}
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>

function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
</script>

<template>
  <UPage v-if="!loading && corridor">
    <div class="flex flex-col">
      <div>
        <UButton
          icon="i-lucide-layout-panel-left"
          variant="ghost"
          color="neutral"
          label="Menu"
          @click="toggleModuleSidebar"
        />
      </div>
      <UPageHeader title="Editar corredor" />
    </div>
    <UCard>
      <CorridorForm
        class="w-full"
        :corridor="corridor"
        @submit="submit"
        @cancel="router.push(`/logistica/viajes/corridors/${id}`)"
      />
    </UCard>
  </UPage>

  <div v-else class="flex justify-center py-24">
    <UIcon name="i-lucide-loader" class="animate-spin text-3xl text-gray-400" />
  </div>
</template>
