<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import { CalendarDate, ZonedDateTime } from '@internationalized/date'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: ''
  },
  label: {
    type: String as PropType<string>,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// --- referencia al input para UPopover ---
const inputDate = shallowRef()

// --- estado interno: CalendarDate ---
const internalDate = shallowRef<CalendarDate | null>(
  props.modelValue
    ? (() => {
        const [yStr, mStr, dStr] = props.modelValue.split('-')
        const y = Number(yStr)
        const m = Number(mStr)
        const d = Number(dStr)
        return [y, m, d].some((n) => isNaN(n))
          ? null
          : new CalendarDate(y, m, d)
      })()
    : null
)

// --- sincronizar v-model hacia afuera ---
watch(internalDate, (val) => {
  if (val) {
    const formatted = `${val.year.toString().padStart(4, '0')}-${val.month
      .toString()
      .padStart(2, '0')}-${val.day.toString().padStart(2, '0')}`
    emit('update:modelValue', formatted)
  } else {
    emit('update:modelValue', '')
  }
})

// --- actualizar internalDate si cambia el prop desde afuera ---
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      internalDate.value = null
      return
    }

    const [yStr, mStr, dStr] = val.split('-')
    const y = yStr ? Number(yStr) : NaN
    const m = mStr ? Number(mStr) : NaN
    const d = dStr ? Number(dStr) : NaN

    if ([y, m, d].some((n) => isNaN(n))) {
      internalDate.value = null
      return
    }

    internalDate.value = new CalendarDate(y, m, d)
  }
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="props.label" class="block">{{ props.label }}</label>
    <UInputDate
      ref="inputDate"
      :model-value="internalDate"
      class="w-full"
      locale="es-AR"
    >
      <template #trailing>
        <UPopover :reference="inputDate?.inputsRef?.[3]?.$el">
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-calendar"
            aria-label="Seleccionar fecha"
            class="px-0"
          />
          <template #content>
            <UCalendar v-model="internalDate" class="p-2" locale="es-AR" />
          </template>
        </UPopover>
      </template>
    </UInputDate>
  </div>
</template>
