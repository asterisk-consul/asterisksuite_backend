<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'
import type { CreateTripInput } from '~/modulos/logistica/transport/trips/types/trips.types'
import TripsForm from '~/modulos/logistica/transport/trips/components/TripsForm.vue'

definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const store = useTripsStore()

const id = route.params.id as string
const loading = ref(true)
const companyId = 'a060f7ff-0281-4df4-b5b3-cbdf940be31e'
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>

const trip = computed(() => store.current)

console.log('TRIP:', trip.value)

onMounted(async () => {
  try {
    await store.fetchOne(id)
  } finally {
    loading.value = false
  }
})

const submit = async (dto: CreateTripInput) => {
  await store.update(id, dto)
  router.push(`/logistica/transport/trips/`)
}
</script>

<template>
  <UPage v-if="!loading && trip">
    <div class="flex flex-col">
      <UButton
        icon="i-lucide-layout-panel-left"
        variant="ghost"
        color="neutral"
        label="Menu"
        @click="moduleCollapsed = !moduleCollapsed"
      />
      <UPageHeader title="Editar viaje" />
    </div>

    <UCard>
      <template #header>
        <UButton variant="ghost" @click="router.back()">Volver</UButton>
      </template>
      <TripsForm
        class="w-full"
        :company-id="companyId"
        :trip="trip ?? undefined"
        @submit="submit"
        @cancel="router.back()"
      />
    </UCard>
  </UPage>

  <div v-else-if="loading" class="flex justify-center py-24">
    <UIcon name="i-lucide-loader" class="animate-spin text-3xl text-gray-400" />
  </div>
</template>
