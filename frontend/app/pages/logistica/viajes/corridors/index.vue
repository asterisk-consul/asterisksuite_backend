<script setup lang="ts">
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
definePageMeta({
  middleware: ['auth'],
  layout: 'logistica'
})

import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { ButtonProps } from '@nuxt/ui'

import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'
import { corridorsColumns } from '~/modulos/logistica/transport/corridors/corridorsColums'
import { useCorridorsStore } from '~/modulos/logistica/transport/corridors/corridors.store'

import type { CorridorWithRelations } from '~/modulos/logistica/transport/corridors/types/corridors.types'

/* ---------------------------------------
STORE
--------------------------------------- */

const store = useCorridorsStore()
const { corridors: items, loading } = storeToRefs(store)

const router = useRouter()

/* ---------------------------------------
ACTIONS
--------------------------------------- */

function openCreate() {
  router.push('/logistica/viajes/corridors/create')
}

function openEdit(row: CorridorWithRelations) {
  router.push(`/logistica/viajes/corridors/${row.id}/edit`)
}

function openDetail(row: CorridorWithRelations) {
  router.push(`/logistica/viajes/corridors/${row.id}`)
}

const columns = corridorsColumns({
  onEdit: openDetail
  // onRowClick: openDetail
})

/* ---------------------------------------
LIFECYCLE
--------------------------------------- */

await store.fetchCorridors()
const links = ref<ButtonProps[]>([
  {
    label: 'Nuevo corredor',
    icon: 'i-heroicons-plus',
    to: '/logistica/viajes/corridors/create',
    color: 'primary',
    variant: 'solid'
  }
])

function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
</script>

<template>
  <UPage class="space-y-4 w-full">
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
        title="Corredores"
        description="Listado de Corredores"
        :links="links"
        class="mb-4 w-full"
      />
    </div>

    <LogisticaTable :loading="loading" :data="items" :columns="columns" />
  </UPage>
</template>
