<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { useRoute, useRouter } from 'vue-router'
import BusinessPartyForm from '~/modulos/logistica/master-data/bussiness-parties/components/BusinessPartyForm.vue'

import type { BusinessPartyForm as FormType } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'
import type { BusinessParty } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'

import { useBusinessPartiesStore } from '~/modulos/logistica/master-data/bussiness-parties/bussines-parties.store'
import { storeToRefs } from 'pinia'

import {
  mapBusinessPartyToForm,
  mapFormToBusinessPartyDto
} from '~/modulos/logistica/master-data/bussiness-parties/mapper/mapFormToBusines'

const route = useRoute()
const router = useRouter()

const store = useBusinessPartiesStore()
const { current, loading } = storeToRefs(store)

const id = route.params.id as string

const saving = ref(false)
const formData = ref<FormType | null>(null)

// 🔥 cargar desde store
onMounted(async () => {
  const data = await store.fetchOne(id)
  formData.value = mapBusinessPartyToForm(data)
})

// 🔥 submit
const handleSubmit = async (form: FormType) => {
  try {
    saving.value = true

    const payload = mapFormToBusinessPartyDto(form)

    await store.update(id, payload)

    await router.push('/logistica/master-data/business-parties')
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-xl font-semibold mb-4">Editar Cliente / Proveedor</h1>

    <div v-if="loading">Cargando...</div>

    <BusinessPartyForm
      v-else-if="formData"
      :model-value="formData"
      @submit="handleSubmit"
    />
  </div>
</template>
