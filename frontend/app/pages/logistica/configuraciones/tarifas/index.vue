<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { storeToRefs } from 'pinia'
import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'

//stores
import { useTransferRatesStore } from '~/modulos/logistica/transport/transfer-rates/transfer-rates.store'
//form
import { transferRatesFormFields } from '~/modulos/logistica/transport/transfer-rates/transfer-rates.form'
import ModalForm from '~/components/ModalForm.vue'
import { tarifasColumns } from '../../../../modulos/logistica/transport/transfer-rates/columns'

import type {
  TransferRate,
  UpdateTransferRateInput
} from '~/modulos/logistica/transport/transfer-rates/transfer-rates.types'
type EditableField = 'name' | 'description' | 'rate_type'
type EditableValue = string | null | undefined

const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
import type { ButtonProps } from '@nuxt/ui'
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
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

const columns = tarifasColumns({
  onEdit: openEdit,
  onToggleActive: async (row, value) => {
    const prev = row.active
    row.active = value

    try {
      if (value) await store.activate(row.id)
      else await store.deactivate(row.id)
    } catch {
      row.active = prev
    }
  },
  onInlineSave: async (row, field: EditableField, value: EditableValue) => {
    const prev = row[field] as EditableValue
    row[field] = value ?? ''

    try {
      const normalized = value ?? undefined

      await store.update(row.id, {
        [field]: normalized
      })
    } catch {
      row[field] = prev ?? ''
    }
  }
})

const loading = ref(true)

const store = useTransferRatesStore()
const { items } = storeToRefs(store)

onMounted(async () => {
  await store.fetchAll()
  loading.value = store.loading
})

/* ---------------------------------------
   SUBMIT HANDLER
--------------------------------------- */

async function handleSubmit(data: any) {
  if (modalMode.value === 'create') {
    const { id, ...payload } = data
    const data2 = {
      ...payload
    }
    await store.create(data2)
  } else {
    console.log(data)
    const payload: UpdateTransferRateInput = {
      name: data.name,
      rate_type: data.rate_type,
      description: data.description
    }

    await store.update(editingRow.value.id, payload)
  }

  await store.fetchAll() // 🔥 FALTA ESTO

  modalOpen.value = false
}
const links = ref<ButtonProps[]>([
  {
    label: 'Nueva Tarifa',
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
        title="Tarifas de Transporte"
        description="Listado de Tarifas de Transporte"
        :links="links"
        class="mb-4 w-full"
      />
    </div>
    <LogisticaTable :loading="loading" :data="items" :columns="columns" />
  </UPage>
  <ModalForm
    v-model:open="modalOpen"
    :fields="transferRatesFormFields"
    :title="modalMode === 'create' ? 'Nuevo Tarifa' : 'Editar Tarifa'"
    :initial-values="editingRow"
    @submit="handleSubmit"
  />
</template>
