<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { useLocationsStore } from '~/modulos/logistica/master-data/locations/store/locations.store'
import { LocationColumns } from '../../../../modulos/logistica/master-data/locations/columns'
import { locationFormFields } from '~/modulos/logistica/master-data/locations/locationsFormFields'
import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
import type { ButtonProps } from '@nuxt/ui'
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
const store = useLocationsStore()

/* ---------------------------------------
   TIPOS
--------------------------------------- */

import type {
  CreateLocationInput,
  UpdateLocationInput,
  Location
} from '~/modulos/logistica/master-data/locations/types/locations.types'

type EditableField = 'city' | 'province' | 'country' | 'postalCode'

type EditableValue = string | null | undefined
/* ---------------------------------------
   STATE
--------------------------------------- */
const { items } = storeToRefs(store)
const loading = ref(true)

/* ---------------------------------------
   MODAL CONTROL
--------------------------------------- */

const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingRow = ref<any>(null)

function openCreate() {
  modalMode.value = 'create'
  editingRow.value = null
  modalOpen.value = true
}

function openEdit(row: any) {
  modalMode.value = 'edit'

  editingRow.value = {
    ...row,
    locationId: row.locationId ?? row.locations?.id ?? null
  }
  modalOpen.value = true
}

/* ---------------------------------------
   TABLE COLUMNS
--------------------------------------- */

const columns = LocationColumns({
  onEdit: openEdit,
  onInlineSave: async (
    row: Location,
    field: EditableField,
    value: EditableValue
  ) => {
    const prev = row[field]
    row[field] = value ?? ''

    try {
      await store.update(row.id, {
        [field]: value ?? undefined
      })
    } catch {
      row[field] = prev
    }
  }
})

/* ---------------------------------------
   LIFECYCLE
--------------------------------------- */
onMounted(async () => {
  await store.fetchAll()
  console.log(items)
  loading.value = store.loading
})

/* ---------------------------------------
   SUBMIT HANDLER
--------------------------------------- */

async function handleSubmit(data: any) {
  if (modalMode.value === 'create') {
    const payload: CreateLocationInput = {
      city: data.city,
      province: data.province,
      country: data.country,
      postalCode: data.postal_code
    }

    await store.create(payload)
  } else {
    const payload: UpdateLocationInput = {
      city: data.city,
      province: data.province,
      country: data.country,
      postalCode: data.postal_code
    }

    await store.update(editingRow.value.id, payload)
  }

  await store.fetchAll() // 🔥 FALTA ESTO

  modalOpen.value = false
}
const links: ButtonProps[] = [
  {
    label: 'Nueva Locacion',
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
        title="Locaciones"
        description="Listado de Locaciones"
        :links="links"
        class="mb-4 w-full"
      />
    </div>

    <LogisticaTable :loading="loading" :data="items" :columns="columns" />
  </UPage>

  <ModalForm
    v-model:open="modalOpen"
    :fields="locationFormFields"
    :title="modalMode === 'create' ? 'Nueva Locación' : 'Editar Locación'"
    :initial-values="editingRow"
    @submit="handleSubmit"
  />
</template>
