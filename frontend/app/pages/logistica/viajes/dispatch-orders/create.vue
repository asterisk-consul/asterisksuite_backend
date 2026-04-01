<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
import type { CreateDispatchOrderDto } from '~/modulos/logistica/documents/dispatch-orders/types/dispatch-orders.types'
import { useDispatchOrdersStore } from '~/modulos/logistica/documents/dispatch-orders/store/dispatch-orders.store'
import DispatchOrderForm from '~/modulos/logistica/documents/dispatch-orders/components/DispatchOrderForm.vue'

const router = useRouter()
const store = useDispatchOrdersStore()

const submit = async (dto: CreateDispatchOrderDto) => {
  await store.create(dto)

  router.push(`/logistica/viajes/dispatch-orders/`)
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
      <UPageHeader title="Crear Orden de Despacho" />
    </div>
    <DispatchOrderForm @submit="submit" @cancel="router.back()" />
  </UPage>
</template>
