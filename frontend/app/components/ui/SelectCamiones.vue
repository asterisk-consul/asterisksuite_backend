<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { SelectItem } from '@nuxt/ui'
import { useDepositos } from '~/composables/useDeposito'
import type { PropType } from 'vue'

// --- props ---
const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: ''
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  placeholder: {
    type: String as PropType<string>,
    default: 'Seleccionar un camión'
  }
})

// --- emits ---
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// --- estado interno ---
const depositos = useDepositos()
const loading = depositos.loading
const selectedValue = ref(props.modelValue)

// --- sincronizar v-model ---
watch(selectedValue, (val) => emit('update:modelValue', val))
watch(
  () => props.modelValue,
  (val) => {
    if (val !== selectedValue.value) selectedValue.value = val ?? ''
  }
)

// --- cargar camiones ---
onMounted(async () => {
  await depositos.load()
})

// --- items para USelect ---
const items = computed<SelectItem[]>(() => depositos.selectCamiones.value)
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="props.label" class="block">{{ props.label }}</label>
    <USelect
      :placeholder="props.placeholder"
      v-model="selectedValue"
      :items="items"
      :loading="loading"
      class="w-full"
    />
  </div>
</template>
