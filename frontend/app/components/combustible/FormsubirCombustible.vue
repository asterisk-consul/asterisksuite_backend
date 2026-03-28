<script setup lang="ts">
import { reactive, ref } from 'vue'
const toast = useToast()

const emit = defineEmits<{
  (e: 'saved'): void
}>()
import type {
  CombustibleForm,
  TipoMovimiento
} from '@/components/combustible/combustibleForm'

import CombustibleCarga from '@/components/combustible/formularios/CombustibleCarga.vue'
import CombustibleDescarga from '@/components/combustible/formularios/CombustibleDescarga.vue'
import CombustibleAjuste from '~/components/combustible/formularios/CombustibleAjuste.vue'
import { useCombustibleSubmit } from '~/composables/combustible/useCombustibleSubmit'

const { submit, loading, error } = useCombustibleSubmit()

const open = defineModel<boolean>({ required: true })

const tab = ref<TipoMovimiento>('carga')

const form = reactive<CombustibleForm>({
  tipoMovimiento: 'carga',
  fecha: '',
  camionId: '',
  choferId: '',
  cargadorId: '',
  litros: null,
  km: null,
  horas: null,
  estacion: '',
  ajusteSigno: 'plus'
})

const items = [
  { label: 'Carga', icon: 'i-lucide-fuel', slot: 'carga' },
  { label: 'Descarga', icon: 'i-lucide-droplet', slot: 'descarga' },
  { label: 'Ajuste', icon: 'i-lucide-sliders', slot: 'ajuste' }
]

async function onSubmit() {
  const ok = await submit(form)

  if (ok) {
    toast.add({
      title: 'Movimiento guardado',
      description: 'El movimiento se guardó correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    emit('saved')
    open.value = false
  } else {
    toast.add({
      title: 'Error',
      description: error.value ?? 'Error al guardar el movimiento',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-4xl w-full rounded-lg' }">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-lg font-semibold">Movimiento de Combustible</h2>
        <UButton icon="i-lucide-x" variant="ghost" @click="open = false" />
      </div>
    </template>
    <template #body>
      <UForm @submit.prevent="onSubmit">
        <UTabs :items="items">
          <template #carga>
            <CombustibleCarga v-model="form" />
          </template>

          <template #descarga>
            <CombustibleDescarga v-model="form" />
          </template>

          <template #ajuste>
            <CombustibleAjuste v-model="form" />
          </template>
        </UTabs>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="open = false">Cancelar</UButton>
        <UButton
          type="submit"
          color="primary"
          :loading="loading"
          @click="onSubmit"
        >
          Guardar
        </UButton>
      </div>
    </template>
  </UModal>
</template>
