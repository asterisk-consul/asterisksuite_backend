<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { storeToRefs } from 'pinia'
import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'
//stores
import { useTripsStore } from '~/modulos/logistica/transport/trips/trips.store'

//types
import type {
  Trip,
  CreateTripInput,
  UpdateTripInput
} from '~/modulos/logistica/transport/trips/types/trips.types'

//tabla columns
import { tripsColumns } from '~/modulos/logistica/transport/trips/columns'

type EditableField = 'reference_number' | 'kilometers' | 'week'

type EditableValue<K extends EditableField> = Trip[K]

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
import type { ButtonProps } from '@nuxt/ui'

function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
const router = useRouter()
const loading = ref(true)
const store = useTripsStore()
const { items } = storeToRefs(store)

/* ---------------------------------------
   MODAL CONTROL
--------------------------------------- */

function openCreate() {
  router.push('/logistica/viajes/create')
}

function openEdit(row: any) {
  router.push(`/logistica/viajes/${row.id}/edit`)
}

const columns = tripsColumns({
  onEdit: openEdit,
  onInlineSave: async <K extends EditableField>(
    row: Trip,
    field: K,
    value: EditableValue<K>
  ) => {
    const prev = row[field]

    row[field] = value ?? prev

    try {
      const updateData: UpdateTripInput = {
        [field]: value ?? undefined
      }

      await store.update(row.id, updateData)
    } catch {
      row[field] = prev
    }
  },
  onToggleStatus: async (row, value) => {
    const prev = row.status
    row.status = value
    try {
      await store.updateStatus(row.id, value)
    } catch {
      row.status = prev
    }
  }
})

// ========================================
// ACTIONS
// ========================================

onMounted(async () => {
  const companyId = 'a060f7ff-0281-4df4-b5b3-cbdf940be31e'
  await store.fetchAll(companyId)
  loading.value = store.loading
})

const links = ref<ButtonProps[]>([
  {
    label: 'Nuevo Viaje',
    icon: 'i-heroicons-plus',
    onClick: openCreate,
    color: 'primary',
    variant: 'solid'
  }
])
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
        title="Viajes"
        description="Listado de Viajes"
        :links="links"
        class="mb-4 w-full"
      />
    </div>
    <LogisticaTable :loading="loading" :data="items" :columns="columns" />
  </UPage>
</template>
