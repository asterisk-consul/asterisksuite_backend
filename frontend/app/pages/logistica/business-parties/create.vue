<script setup lang="ts">
definePageMeta({
  layout: 'logistica',
  middleware: ['auth']
})
import { useRouter } from 'vue-router'
import BusinessPartyForm from '~/modulos/logistica/master-data/bussiness-parties/components/BusinessPartyForm.vue'

import type { BusinessPartyForm as FormType } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'
import { mapFormToBusinessPartyDto } from '~/modulos/logistica/master-data/bussiness-parties/mapper/mapFormToBusines'

import { useBusinessPartiesStore } from '~/modulos/logistica/master-data/bussiness-parties/bussines-parties.store'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useBusinessPartiesStore()

const { currentCompanyId } = storeToRefs(store)

const saving = ref(false)

const handleSubmit = async (form: FormType) => {
  try {
    saving.value = true

    const payload = mapFormToBusinessPartyDto({
      ...form,
      company_id: currentCompanyId.value!
    })

    await store.create(payload)

    await router.push('/logistica/business-parties')
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-xl font-semibold mb-4">Crear Cliente / Proveedor</h1>

    <BusinessPartyForm @submit="handleSubmit" />
  </div>
</template>
