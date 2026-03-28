<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { useBusinessPartiesStore } from '~/modulos/logistica/master-data/bussiness-parties/bussines-parties.store'
import { BusinessPartyColumns } from '~/modulos/logistica/master-data/bussiness-parties/columns'
import { useAuthStore } from '~/modulos/auth/auth.store'
import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
import type { ButtonProps } from '@nuxt/ui'
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}

const store = useBusinessPartiesStore()
const authStore = useAuthStore()
const router = useRouter()
const { items } = storeToRefs(store)

const loading = ref(true)

onMounted(async () => {
  await authStore.init()

  if (!authStore.user?.companyId) return

  await store.fetchAll(authStore.user.companyId)
  loading.value = store.loading
})
const openCreate = () => {
  router.push('/logistica/master-data/business-parties/create')
}

const openEdit = (row: any) => {
  router.push(`/logistica/master-data/business-parties/${row.id}/edit`)
}
const columns = BusinessPartyColumns({
  onEdit: openEdit
})

const links: ButtonProps[] = [
  {
    label: 'Nueva Parte Interesada',
    icon: 'i-heroicons-plus',
    color: 'primary',
    variant: 'solid',
    onClick: openCreate
  }
]
</script>

<template>
  <UPage class="space-y-4">
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
      <UPageHeader
        title="Partes Interesadas"
        description="Listado de Partes Interesadas"
        :links="links"
        class="mb-4 w-full"
      />
    </div>

    <LogisticaTable :loading="loading" :data="items" :columns="columns" />
  </UPage>
</template>
