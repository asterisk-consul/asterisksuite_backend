<script setup lang="ts">
// --- IMPORTS ---
// --- TIPOS ---
import type { PartyContact } from '~/modulos/logistica/master-data/contacts/types/contacts.types'
import type { ButtonProps } from '@nuxt/ui'

type EditableField = 'first_name' | 'last_name' | 'role' | 'phone' | 'email'

type EditableValue = string | null | undefined
// --- Configuración de Pages --
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>
// --- STORES ---
import { usePartyContactsStore } from '~/modulos/logistica/master-data/contacts/store/contacts.store'
import { PartyContactColumns } from '~/modulos/logistica/master-data/contacts/contacts.columns'
// --- COMPONENTS ---s
import LogisticaTable from '~/components/Tablas/LogisticaTable.vue'

function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}

/* ---------------------------------------
   STATE
--------------------------------------- */
const store = usePartyContactsStore()
const router = useRouter()
const { contacts } = storeToRefs(store)
const loading = ref(true)

/* ---------------------------------------
   MODAL CONTROL
--------------------------------------- */

function openCreate() {
  router.push('/logistica/business-parties/contacts/create')
}

function openEdit(row: any) {
  router.push(`/logistica/business-parties/contacts/${row.id}/edit`)
}

/* ---------------------------------------
   TABLE COLUMNS
--------------------------------------- */

const columns = PartyContactColumns({
  onEdit: openEdit,
  onInlineSave: async (
    row: PartyContact,
    field: EditableField,
    value: EditableValue
  ) => {
    const prev = row[field] ?? ''
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
  loading.value = store.loading
})

const links: ButtonProps[] = [
  {
    label: 'Nuevo Contacto',
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
        title="Contactos"
        description="Listado de Contactos"
        :links="links"
        class="mb-4 w-full"
      />
    </div>

    <LogisticaTable :loading="loading" :data="contacts" :columns="columns" />
  </UPage>
</template>
