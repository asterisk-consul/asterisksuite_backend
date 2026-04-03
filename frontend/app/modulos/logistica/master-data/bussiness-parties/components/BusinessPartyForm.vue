<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { BusinessPartyForm } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'
import type { SelectMenuItem } from '@nuxt/ui'
import { mapBusinessPartyToForm } from '~/modulos/logistica/master-data/bussiness-parties/mapper/mapFormToBusines'

const props = defineProps<{
  modelValue?: BusinessPartyForm
}>()

const emit = defineEmits<{
  submit: [BusinessPartyForm]
}>()

const form = reactive<BusinessPartyForm>({
  id: undefined,

  type: 'client',
  name: '',
  tax_id: '',
  locations: [],
  contacts: []
})

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return

    // 🔥 detectar si ya es form
    if ('locations' in val) {
      Object.assign(form, val)
    } else {
      Object.assign(form, mapBusinessPartyToForm(val))
    }
  },
  { immediate: true }
)

const typeOptions: SelectMenuItem[] = [
  { label: 'Cliente', value: 'client' },
  { label: 'Proveedor', value: 'supplier' }
]

// 🔥 helpers dinámicos
const addLocation = () => {
  form.locations.push({ location_id: '', label: '' })
}

const removeLocation = (i: number) => {
  form.locations.splice(i, 1)
}

const addContact = () => {
  form.contacts.push({
    first_name: '',
    last_name: '',
    role: '',
    phone: '',
    email: ''
  })
}

const removeContact = (i: number) => {
  form.contacts.splice(i, 1)
}

const submit = () => {
  emit('submit', { ...form })
}

const tabs = [
  { label: 'Direcciones', slot: 'locations' },
  { label: 'Contactos', slot: 'contacts' }
]
</script>

<template>
  <UForm :state="form" @submit="submit" class="mx-auto space-y-6">
    <!-- HEADER -->
    <div>
      <h2 class="text-2xl font-semibold">Nueva Empresa</h2>
      <p class="text-sm text-gray-500">Completá la información</p>
    </div>

    <!-- DATOS BASICOS (SIEMPRE VISIBLE) -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Datos básicos</h3>
      </template>

      <div class="space-y-4">
        <UFormField label="Tipo" name="type">
          <USelectMenu
            v-model="form.type"
            :items="typeOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Razón Social" name="name">
            <UInput v-model="form.name" class="w-full" />
          </UFormField>

          <UFormField label="CUIT" name="tax_id">
            <UInput v-model="form.tax_id" class="w-full" />
          </UFormField>
        </div>
      </div>
    </UCard>

    <!-- TABS -->
    <UTabs :items="tabs" variant="link" class="w-full">
      <!-- LOCATIONS -->
      <template #locations>
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">Direcciones</h3>
              <UButton size="sm" icon="i-heroicons-plus" @click="addLocation">
                Agregar
              </UButton>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="(l, i) in form.locations"
              :key="i"
              class="flex gap-3 items-center"
            >
              <UInput
                v-model="l.location_id"
                placeholder="ID ubicación"
                class="flex-1"
              />
              <UInput v-model="l.label" placeholder="Etiqueta" class="flex-1" />

              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="soft"
                @click="removeLocation(i)"
              />
            </div>

            <UAlert
              v-if="!form.locations.length"
              color="neutral"
              variant="soft"
              title="Sin direcciones"
            />
          </div>
        </UCard>
      </template>

      <!-- CONTACTS -->
      <template #contacts>
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">Contactos</h3>
              <UButton size="sm" icon="i-heroicons-plus" @click="addContact">
                Agregar
              </UButton>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="(c, i) in form.contacts"
              :key="i"
              class="space-y-3 border rounded-lg p-4"
            >
              <div class="grid grid-cols-2 gap-3">
                <UInput v-model="c.first_name" placeholder="Nombre" />
                <UInput v-model="c.last_name" placeholder="Apellido" />
              </div>

              <div class="grid grid-cols-3 gap-3">
                <UInput v-model="c.role" placeholder="Cargo" />
                <UInput v-model="c.phone" placeholder="Teléfono" />
                <UInput v-model="c.email" placeholder="Email" />
              </div>

              <div class="flex justify-end">
                <UButton
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-heroicons-trash"
                  @click="removeContact(i)"
                >
                  Eliminar
                </UButton>
              </div>
            </div>

            <UAlert
              v-if="!form.contacts.length"
              color="neutral"
              variant="soft"
              title="Sin contactos"
            />
          </div>
        </UCard>
      </template>
    </UTabs>

    <!-- ACTIONS -->
    <div class="flex justify-end gap-3">
      <UButton variant="soft">Cancelar</UButton>
      <UButton type="submit" color="primary">Guardar</UButton>
    </div>
  </UForm>
</template>
