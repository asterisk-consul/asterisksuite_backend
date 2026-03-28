<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { SelectItem } from '@nuxt/ui'
import { usePerfiles } from '~/composables/usePerfiles'
import type { PropType } from 'vue'

// --- tipos ---
type ValueMode = 'id' | 'label' | 'both'

export interface PerfilSelectValue {
  id: number
  label: string
}

// --- props ---
const props = defineProps({
  modelValue: {
    type: [Number, String, Object] as PropType<
      number | string | PerfilSelectValue | null
    >,
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Seleccionar un perfil'
  },
  tipo: {
    type: Number as PropType<number | null>,
    default: null
  },
  categoriaid: {
    type: Number as PropType<number | null>,
    default: null
  },
  // 🔑 modo de salida
  valueMode: {
    type: String as PropType<ValueMode>,
    default: 'id'
  }
})

// --- emits ---
const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: number | string | PerfilSelectValue | null
  ): void
}>()

// --- v-model interno ---
// el select siempre trabaja con un value "simple"
const internalValue = computed<number | null>({
  get: () => {
    if (props.valueMode === 'both' && props.modelValue) {
      return (props.modelValue as PerfilSelectValue).id
    }
    if (props.valueMode === 'id') {
      return props.modelValue as number | null
    }
    return null
  },
  set: (value) => {
    if (value == null) {
      emit('update:modelValue', null)
      return
    }

    const perfil = perfiles.findById(value)
    if (!perfil) return

    const label =
      perfil.identificador ??
      perfil.razonsocial ??
      `${perfil.apellido ?? ''}`.trim() ??
      '-'

    if (props.valueMode === 'id') {
      emit('update:modelValue', value)
    } else if (props.valueMode === 'label') {
      emit('update:modelValue', label)
    } else {
      emit('update:modelValue', { id: value, label })
    }
  }
})

// --- composable perfiles ---
const perfiles = usePerfiles(props.tipo ?? undefined)
const loading = perfiles.loading

// --- cargar perfiles ---
onMounted(async () => {
  await perfiles.load(props.tipo ?? undefined, true)
})

// --- items ---
const items = computed<SelectItem[]>(() =>
  perfiles.selectOptions(props.categoriaid ?? undefined)
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="block">{{ label }}</label>

    <USelect
      v-model="internalValue"
      :items="items"
      :loading="loading"
      :placeholder="placeholder"
      class="w-full"
      disable-portal
    />
  </div>
</template>
