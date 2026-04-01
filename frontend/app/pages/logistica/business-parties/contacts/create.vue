<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})

import type { CreatePartyContactDto } from '~/modulos/logistica/master-data/contacts/types/contacts.types'
import { usePartyContactsStore } from '~/modulos/logistica/master-data/contacts/store/contacts.store'
import ContactsForm from '~/modulos/logistica/master-data/contacts/components/contactsForm.vue'

const router = useRouter()
const store = usePartyContactsStore()

const submit = async (contacts: CreatePartyContactDto[]) => {
  if (!contacts.length) return
  console.log(contacts)
  // 👉 opción simple (varios requests)
  const created = await Promise.all(contacts.map((c) => store.create(c)))

  // 👉 redirigir al primero (o podrías ir a lista)
  await router.push(`/logistica/business-parties/contacts/`)

  return created
}
</script>

<template>
  <UPage>
    <UPageHeader title="Crear contactos" />

    <UCard>
      <ContactsForm @submit="submit" @cancel="router.back()" />
    </UCard>
  </UPage>
</template>
