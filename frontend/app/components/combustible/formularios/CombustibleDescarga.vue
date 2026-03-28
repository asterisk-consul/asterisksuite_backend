<script setup lang="ts">
import DataPicker from '@/components/ui/DataPicker.vue'
import SelectPefiles from '@/components/ui/SelectPefiles.vue'

const model = defineModel<any>()

const estaciones = [
  { label: 'PETROLERA SUQUIA SRL', value: 'PETROLERA SUQUIA SRL' },
  { label: 'POSTA DEL MERCOSUR SRL', value: 'POSTA DEL MERCOSUR SRL' }
]
</script>

<template>
  <div class="grid grid-cols-2 items-center gap-4">
    <SelectPefiles
      v-model="model.cargadorId"
      :tipo="4"
      :categoriaid="11090"
      label="Responsable"
    />
    <div class="flex flex-col gap-2">
      <span>Estación</span>
      <USelect v-model="model.estacion" :items="estaciones" label="Estación" />
    </div>

    <DataPicker v-model="model.fecha" label="Fecha" />

    <div class="flex flex-col gap-2">
      <span>Litros descargados</span>
      <UInput
        v-model="model.litros"
        type="number"
        label="Litros descargados"
        class="col-span-2"
      />
    </div>
  </div>
</template>
