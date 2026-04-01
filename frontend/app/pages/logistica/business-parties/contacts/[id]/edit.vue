<script setup lang="ts">
import { onMounted, ref, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { usePartyContactsStore } from '~/modulos/logistica/master-data/contacts/store/contacts.store'
import type { CreatePartyContactDto } from '~/modulos/logistica/master-data/contacts/types/contacts.types'

import ContactsForm from '~/modulos/logistica/master-data/contacts/components/contactsForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'logistica'
})

const route = useRoute()
const router = useRouter()
const store = usePartyContactsStore()

const id = route.params.id as string
const loading = ref(true)

/**
 * STATE
 */
const contact = computed(() => store.current)

/**
 * FETCH
 */
onMounted(async () => {
  try {
    await store.fetchOne(id)
  } finally {
    loading.value = false
  }
})

/**
 * SUBMIT
 */
const submit = async (contacts: CreatePartyContactDto[]) => {
  if (!contacts.length) return
  console.log(contacts)
  // 👉 opción simple (varios requests)
  const created = await Promise.all(contacts.map((c) => store.create(c)))

  // 👉 redirigir al primero (o podrías ir a lista)
  await router.push(`/logistica/business-parties/contacts/`)

  return created
}

/**
 * SIDEBAR
 */
const moduleCollapsed = inject('moduleSidebarCollapsed') as Ref<boolean>

function toggleModuleSidebar() {
  moduleCollapsed.value = !moduleCollapsed.value
}
</script>

<template>
  <UPage v-if="!loading && contact">
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

      <UPageHeader title="Editar contacto" />
    </div>

    <UCard>
      <ContactsForm
        class="w-full"
        :contacts="[contact]"
        :partyId="contact.party_id"
        @submit="submit"
        @cancel="router.push(`/logistica/business-parties/contacts/`)"
      />
    </UCard>
  </UPage>

  <!-- LOADING -->
  <div v-else class="flex justify-center py-24">
    <UIcon name="i-lucide-loader" class="animate-spin text-3xl text-gray-400" />
  </div>
</template>
