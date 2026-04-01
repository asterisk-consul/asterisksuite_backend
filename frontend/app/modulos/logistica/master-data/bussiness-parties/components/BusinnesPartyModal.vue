<script setup lang="ts">
import type {
  BusinessParty,
  BusinessPartyForm
} from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'

import { useBusinessPartiesStore } from '~/modulos/logistica/master-data/bussiness-parties/bussines-parties.store'

import BusinessPartyFormComponent from '~/modulos/logistica/master-data/bussiness-parties/components/BusinessPartyForm.vue'
import { computed } from 'vue'
import { mapBusinessPartyToForm } from '~/modulos/logistica/master-data/bussiness-parties/mapper/mapFormToBusines'

const props = defineProps<{
  businessParty?: BusinessParty
}>()

const emit = defineEmits<{
  success: [businessParty: BusinessParty]
}>()

const open = defineModel<boolean>('open', { default: false })

const store = useBusinessPartiesStore()

const formValue = computed(() => {
  if (!props.businessParty) return undefined
  return mapBusinessPartyToForm(props.businessParty)
})

const submit = async (form: BusinessPartyForm) => {
  let result: BusinessParty

  if (props.businessParty?.id) {
    result = await store.update(props.businessParty.id, form)
  } else {
    result = await store.create(form)
  }

  open.value = false
  emit('success', result)
}
</script>

<template>
  <UModal v-model:open="open" class="w-full max-w-3xl">
    <template #body>
      <BusinessPartyFormComponent
        :model-value="formValue"
        @submit="submit"
        @cancel="open = false"
      />
    </template>
  </UModal>
</template>
