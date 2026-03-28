<script setup lang="ts">
import DataPicker from '@/components/ui/DataPicker.vue'
import SelectPefiles from '@/components/ui/SelectPefiles.vue'

const model = defineModel<any>()
</script>

<template>
  <div class="space-y-4">
    <USegmented
      v-model="model.ajusteSigno"
      :items="[
        { label: 'Positivo', value: 'plus', icon: 'i-lucide-plus-circle' },
        { label: 'Negativo', value: 'minus', icon: 'i-lucide-minus-circle' }
      ]"
    />

    <DataPicker v-model="model.fecha" label="Fecha" />

    <UInput v-model="model.litros" type="number" label="Litros" />

    <SelectPefiles
      v-model="model.cargadorId"
      :tipo="4"
      :categoriaid="11090"
      label="Responsable del ajuste"
    />
  </div>
</template>
