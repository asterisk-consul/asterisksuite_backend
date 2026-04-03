<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
import type { ButtonProps } from '@nuxt/ui'
import type { EditableField } from '~/modulos/logistica/documents/dispatch-orders/dispatch-order.columns'
import type { EditableValue } from '~/composables/table/useInlineEdit'
function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
import type { DispatchOrder } from '~/modulos/logistica/documents/dispatch-orders/types/dispatch-orders.types'

import { storeToRefs } from 'pinia'
import { useDispatchOrdersStore } from '~/modulos/logistica/documents/dispatch-orders/store/dispatch-orders.store'

import { dispatchOrdersColumns } from '~/modulos/logistica/documents/dispatch-orders/dispatch-order.columns'
//components
import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'

/* ---------------------------------------
   MODAL CONTROL
--------------------------------------- */
const router = useRouter()

function openCreate() {
  router.push('/logistica/viajes/dispatch-orders/create')
}

function openEdit(row: any) {
  router.push(`/logistica/viajes/dispatch-orders/${row.id}/edit`)
}

const columns = dispatchOrdersColumns({
  onEdit: openEdit,

  onInlineSave: async (
    row: DispatchOrder,
    field: EditableField,
    value: EditableValue
  ) => {
    const prev = row[field] as EditableField
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
const store = useDispatchOrdersStore()
const { dispatchOrders } = storeToRefs(store)

/* ---------------------------------------
   LIFECYCLE
--------------------------------------- */

onMounted(async () => {
  await store.fetchAll()
  loading.value = store.loading
})

/* ---------------------------------------
   SUBMIT HANDLER
--------------------------------------- */

const links = ref<ButtonProps[]>([
  {
    label: 'Nueva Orden de Despacho',
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
        title="Documentos de Transporte"
        description="Listado de Documentos de Transporte"
        :links="links"
        class="mb-4 w-full"
      />
    </div>
    <LogisticaTable
      :loading="loading"
      :data="dispatchOrders"
      :columns="columns"
    />
  </UPage>
</template>
