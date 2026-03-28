<script setup lang="ts" generic="T extends Record<string, any>">
import { reactive, watch, computed } from 'vue'
import { CalendarDate, parseDate } from '@internationalized/date'
import type { BaseField } from '@/types/form.types'

const props = defineProps<{
  open: boolean
  fields: BaseField[]
  title?: string
  initialValues?: Partial<T>
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', value: T): void
}>()

/* ---------------------------------------
   CONTROL MODAL
--------------------------------------- */
const modalOpen = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val)
})

function toCalendarDate(value: unknown): CalendarDate | null {
  if (!value) return null
  if (value instanceof CalendarDate) return value
  if (typeof value === 'string') {
    try {
      return parseDate(value.slice(0, 10))
    } catch {
      return null
    }
  }
  return null
}

function calendarDateToISO(date: CalendarDate | null) {
  if (!date) return null
  return date.toString()
}

/* ---------------------------------------
   STATE
--------------------------------------- */
const state = reactive<Record<string, any>>({})

function resetState() {
  for (const k in state) delete state[k]
}

function buildInitialState() {
  resetState()

  for (const field of props.fields) {
    const initial = props.initialValues?.[field.name as keyof T]

    // EDIT MODE
    if (initial !== undefined && initial !== null) {
      if (field.type === 'date') {
        state[field.name] = toCalendarDate(initial)
      } else {
        state[field.name] = initial
      }
      continue
    }

    // CREATE MODE defaults
    switch (field.type) {
      case 'checkbox':
        state[field.name] = false
        break
      case 'select':
      case 'date':
        state[field.name] = null
        break
      default:
        state[field.name] = ''
    }
  }
}

/* ---------------------------------------
   WATCHERS
--------------------------------------- */
watch(
  () => [props.open, props.initialValues, props.fields],
  ([open]) => {
    if (open) buildInitialState()
  },
  { immediate: true, deep: true }
)

watch(
  () => props.open,
  (open) => {
    if (!open) resetState()
  }
)

/* ---------------------------------------
   REFRIGERATION RULE: CAMION → Normal
--------------------------------------- */
watch(
  () => state.type,
  (newType) => {
    if (newType === 'CAMION') {
      state.refrigeration = false
    }
  }
)

/* ---------------------------------------
   DATE FORMAT
--------------------------------------- */
function formatDate(date: CalendarDate | null) {
  if (!date) return ''
  const y = date.year
  const m = String(date.month).padStart(2, '0')
  const d = String(date.day).padStart(2, '0')
  return `${d}/${m}/${y}`
}

/* ---------------------------------------
   SUBMIT
--------------------------------------- */
function handleSubmit() {
  const payload: Record<string, any> = {}

  for (const key in state) {
    const value = state[key]
    if (value instanceof CalendarDate) {
      payload[key] = calendarDateToISO(value)
    } else {
      payload[key] = value
    }
  }

  emit('submit', payload as T)
  modalOpen.value = false
}
</script>

<template>
  <UModal
    v-model:open="modalOpen"
    :ui="{
      content:
        'w-[calc(100vw-2rem)] max-w-3xl rounded-lg shadow-lg ring ring-default'
    }"
  >
    <!-- HEADER -->
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h3 class="text-lg font-semibold">
          {{ title ?? 'Formulario' }}
        </h3>
        <UButton
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="ghost"
          @click="modalOpen = false"
        />
      </div>
    </template>

    <!-- BODY -->
    <template #body>
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <UForm :state="state" @submit="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <template v-for="field in fields" :key="field.name">
              <!-- HIDDEN -->
              <input
                v-if="field.type === 'hidden'"
                type="hidden"
                v-model="state[field.name]"
              />

              <UFormField
                v-else
                :label="field.label"
                :name="field.name"
                :class="field.span === 2 ? 'md:col-span-2' : ''"
              >
                <!-- CHECKBOX -->
                <UCheckbox
                  v-if="field.type === 'checkbox'"
                  v-model="state[field.name]"
                  :disabled="
                    typeof field.disabled === 'function'
                      ? field.disabled(state)
                      : field.disabled
                  "
                />

                <!-- SELECT -->
                <USelect
                  v-else-if="field.type === 'select'"
                  v-model="state[field.name]"
                  :items="field.options"
                  :disabled="
                    typeof field.disabled === 'function'
                      ? field.disabled(state)
                      : field.disabled
                  "
                  class="w-full"
                />

                <!-- DATE -->
                <UPopover v-else-if="field.type === 'date'">
                  <template #default>
                    <UInput
                      :model-value="formatDate(state[field.name])"
                      icon="i-heroicons-calendar-days"
                      placeholder="Seleccionar fecha"
                      readonly
                      class="w-full"
                    />
                  </template>

                  <template #content>
                    <UCalendar v-model="state[field.name]" class="p-2" />
                  </template>
                </UPopover>

                <UTextarea
                  v-else-if="field.type === 'textarea'"
                  v-model="state[field.name]"
                  :placeholder="field.placeholder"
                  :disabled="
                    typeof field.disabled === 'function'
                      ? field.disabled(state)
                      : field.disabled
                  "
                  class="w-full"
                />

                <UInput
                  v-else
                  v-model="state[field.name]"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  :disabled="
                    typeof field.disabled === 'function'
                      ? field.disabled(state)
                      : field.disabled
                  "
                  class="w-full"
                />
              </UFormField>
            </template>
          </div>

          <!-- FOOTER -->
          <div class="flex justify-end gap-3 pt-6 border-t mt-6">
            <UButton color="neutral" variant="soft" @click="modalOpen = false">
              Cancelar
            </UButton>
            <UButton type="submit" color="primary" size="lg">Guardar</UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
