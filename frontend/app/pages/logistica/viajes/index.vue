<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import type { TabsItem } from '@nuxt/ui'
import { storeToRefs } from 'pinia'
import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'
import TripPlanner from '~/modulos/logistica/transport/trips/planners/TripPlanner.vue'
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
  console.log(row.id)
  router.push(`/logistica/viajes/${row.id}`)
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
  await store.fetchAll()
  console.log(items)
  loading.value = store.loading
})

const activeTab = ref('viajes')

const itemsTabs: TabsItem[] = [
  { label: 'Viajes', value: 'viajes' },
  { label: 'Otro', value: 'otro' }
]

const title = computed(() =>
  activeTab.value === 'viajes' ? 'Viajes' : 'Otro módulo'
)

const description = computed(() =>
  activeTab.value === 'viajes'
    ? 'Listado de Viajes'
    : 'Otra funcionalidad distinta'
)

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
    <div class="flex flex-col gap-2">
      <div>
        <UButton
          icon="i-lucide-layout-panel-left"
          variant="ghost"
          color="neutral"
          label="Menu"
          @click="toggleModuleSidebar"
        />
      </div>

      <!-- 🔥 Tabs controlados -->
      <UTabs
        v-model="activeTab"
        :items="itemsTabs"
        color="neutral"
        variant="link"
        :content="false"
        class="w-full"
      />

      <!-- 🔥 Header dinámico -->
      <UPageHeader
        :title="title"
        :description="description"
        :links="links"
        class="mb-4 w-full"
      />
    </div>

    <!-- 🔥 Contenido dinámico -->
    <LogisticaTable
      v-if="activeTab === 'viajes'"
      :loading="loading"
      :data="items"
      :columns="columns"
    />

    <TripPlanner :tripId="'12'" v-else />
  </UPage>
</template>
