<script setup lang="ts">
import SelectCamiones from '@/components/ui/SelectCamiones.vue'
import SelectPefiles from '@/components/ui/SelectPefiles.vue'
import DataPicker from '@/components/ui/DataPicker.vue'

const model = defineModel<any>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <SelectPefiles
      v-model="model.cargadorId"
      :tipo="4"
      :categoriaid="11090"
      label="Responsable de carga"
    />

    <SelectPefiles
      v-model="model.choferId"
      :tipo="4"
      :categoriaid="10895"
      label="Chofer"
      valueMode="both"
    />

    <DataPicker v-model="model.fecha" label="Fecha" />

    <SelectCamiones v-model="model.camionId" label="Unidad" />

    <div class="flex flex-col gap-2">
      <span>Litros</span>
      <UInput v-model="model.litros" type="number" label="Litros" />
    </div>
    <div class="flex flex-col gap-2">
      <span>Kilómetros</span>
      <UInput v-model="model.km" type="number" label="Kilómetros" />
    </div>
    <div class="flex flex-col gap-2">
      <span>Horas</span>
      <UInput v-model="model.horas" type="number" label="Horas" />
    </div>
  </div>
</template>
