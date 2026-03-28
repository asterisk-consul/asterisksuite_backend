<script setup lang="ts">
const emit = defineEmits<{
  prorratear: []
  distribuirTodos: []
  guardar: []
}>()
</script>

<template>
  <div class="flex flex-wrap justify-between gap-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        color="warning"
        icon="i-heroicons-calculator"
        label="Prorratear Equitativamente"
        @click="emit('prorratear')"
      >
        <UTooltip>
          Distribuye el porcentaje disponible equitativamente entre las
          distribuciones no bloqueadas
        </UTooltip>
      </UButton>

      <UButton
        color="info"
        icon="i-heroicons-truck"
        label="Distribuir Todos los Camiones"
        @click="emit('distribuirTodos')"
      >
        <UTooltip>Crea una distribución para cada camión disponible</UTooltip>
      </UButton>
    </div>

    <UButton
      color="primary"
      icon="i-heroicons-check"
      label="Guardar"
      size="lg"
      @click="emit('guardar')"
    />
  </div>
</template>
