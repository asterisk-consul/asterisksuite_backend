<script setup lang="ts">
type OptionValue = string | boolean

interface Option {
  label: string
  value: OptionValue
  color?:
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'primary'
    | 'secondary'
    | 'neutral'
  disabled?: boolean
}

const props = defineProps<{
  modelValue: OptionValue
  options: Option[]
  title?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: OptionValue]
}>()

// 👇 Controla el estado abierto/cerrado del popover
const open = ref(false)

const current = computed(() =>
  props.options.find((o) => o.value === props.modelValue)
)

function selectOption(option: Option) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  open.value = false // 👈 cierra el popover
}
</script>

<template>
  <UPopover v-model:open="open" mode="click">
    <UBadge class="cursor-pointer" variant="subtle" :color="current?.color">
      {{ current?.label }}
    </UBadge>

    <template #content>
      <div class="p-2 flex flex-col gap-1 w-36">
        <span class="text-muted text-xs">{{ title ?? 'Cambiar estado' }}</span>
        <UButton
          v-for="option in options"
          :key="String(option.value)"
          size="xs"
          :color="option.color"
          :variant="modelValue === option.value ? 'solid' : 'ghost'"
          :disabled="option.disabled"
          @click.stop.prevent="selectOption(option)"
        >
          {{ option.label }}
        </UButton>
      </div>
    </template>
  </UPopover>
</template>
