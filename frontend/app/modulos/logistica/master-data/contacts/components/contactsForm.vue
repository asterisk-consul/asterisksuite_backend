<script setup lang="ts">
import type {
  PartyContact,
  CreatePartyContactDto
} from '~/modulos/logistica/master-data/contacts/types/contacts.types'

import {
  mapContactToForm,
  mapFormToDto,
  type ContactForm
} from '~/modulos/logistica/master-data/contacts/mappers/contacts.mapper'

import { useBusinessPartiesStore } from '../../bussiness-parties/bussines-parties.store'
import { useBusinessParties } from '~/modulos/logistica/master-data/bussiness-parties/composable/useBusinessParties'

const props = defineProps<{
  partyId?: string
  contacts?: PartyContact[]
}>()

const emit = defineEmits<{
  submit: [contacts: CreatePartyContactDto[]]
  cancel: []
}>()

const isEdit = computed(() => !!props.contacts)

/**
 * STORE
 */
const businessPartiesStore = useBusinessPartiesStore()
const { items: businessParties } = storeToRefs(businessPartiesStore)
const { items } = useBusinessParties(businessParties)

/**
 * FORM
 */
const form = reactive<{
  contacts: ContactForm[]
}>({
  contacts: []
})

/**
 * Cargar datos + mapear correctamente
 */
watch(
  [items, () => props.contacts],
  () => {
    if (!items.value.length) return

    form.contacts =
      props.contacts?.map((c) => mapContactToForm(c, items.value)) ?? []
  },
  { immediate: true }
)

/**
 * Actions
 */
const addContact = () => {
  form.contacts.push({
    party_id: props.partyId ?? undefined,
    first_name: '',
    last_name: '',
    role: undefined,
    phone: undefined,
    email: undefined,
    party: undefined
  })
}

const removeContact = (index: number) => {
  form.contacts.splice(index, 1)
}

/**
 * Submit
 */
const submit = () => {
  emit('submit', form.contacts.map(mapFormToDto))
}

/**
 * Fetch
 */
onMounted(async () => {
  await businessPartiesStore.fetchAll('a060f7ff-0281-4df4-b5b3-cbdf940be31e')
})
</script>

<template>
  <UForm @submit="submit" class="space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between mb-2 w-full">
      <h3 class="font-semibold">Contactos</h3>

      <UButton size="sm" variant="soft" @click="addContact">
        Agregar contacto
      </UButton>
    </div>

    <!-- LIST -->
    <div class="space-y-2">
      <UCard
        v-for="(contact, index) in form.contacts"
        :key="index"
        :ui="{ body: 'grid grid-cols-3 gap-3 items-center' }"
      >
        <span class="text-sm w-6 col-span-2">{{ index + 1 }}</span>
        <UButton
          color="error"
          variant="ghost"
          icon="i-lucide-trash"
          class="col-span-1 items-center justify-center"
          @click="removeContact(index)"
        />
        <UFormField label="Nombre">
          <UInput
            v-model="contact.first_name"
            class="w-full"
            placeholder="Nombre"
          />
        </UFormField>
        <UFormField label="Apellido">
          <UInput
            v-model="contact.last_name"
            class="w-full"
            placeholder="Apellido"
          />
        </UFormField>
        <!-- ✅ SELECT CORRECTO -->
        <UFormField label="Parte interesada">
          <USelectMenu
            v-model="contact.party"
            :items="items"
            option-attribute="label"
            value-attribute="value"
            :search-input="{
              placeholder: 'Buscar...',
              icon: 'i-lucide-search'
            }"
            placeholder="Parte interesada"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Rol">
          <UInput v-model="contact.role" class="w-full" placeholder="Rol" />
        </UFormField>
        <UFormField label="Teléfono">
          <UInput
            v-model="contact.phone"
            class="w-full"
            placeholder="Teléfono"
          />
        </UFormField>
        <UFormField label="Email">
          <UInput v-model="contact.email" class="w-full" placeholder="Email" />
        </UFormField>
      </UCard>
    </div>

    <!-- ACTIONS -->
    <div class="flex justify-end gap-2">
      <UButton variant="ghost" @click="emit('cancel')">Cancelar</UButton>

      <UButton type="submit">
        {{ isEdit ? 'Guardar cambios' : 'Crear contactos' }}
      </UButton>
    </div>
  </UForm>
</template>
