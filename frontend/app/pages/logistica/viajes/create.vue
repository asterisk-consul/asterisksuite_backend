<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'
import type { CreateTripInput } from '~/modulos/logistica/transport/trips/types/trips.types'

import TripsForm from '~/modulos/logistica/transport/trips/components/TripsForm.vue'

const router = useRouter()
const store = useTripsStore()

const companyId = 'a060f7ff-0281-4df4-b5b3-cbdf940be31e'

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}

const submit = async (dto: CreateTripInput) => {
  console.log(dto)
  await store.create(dto)

  router.push(`/logistica/viajes/`)
}
</script>

<template>
  <UPage>
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
      <UPageHeader title="Crear Viaje" />
    </div>
    <UCard title="Viaje">
      <TripsForm
        :company-id="companyId"
        @submit="submit"
        @cancel="router.back()"
      />
    </UCard>
  </UPage>
</template>
