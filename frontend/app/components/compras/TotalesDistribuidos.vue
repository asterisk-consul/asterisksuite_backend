<script setup lang="ts">
const props = defineProps<{
  totales: {
    totalimpuestos: number
    totalprecio: number
    varcn0: number
    varcn1: number
    varcn2: number
    varcn3: number
  }
  coinciden: boolean
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-lg mb-2 font-bold">Totales distribuidos:</h3>

    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
      <div>
        <div class="text-xs text-gray-500">Total Impuestos</div>
        <div class="font-bold">{{ formatMoneda(totales.totalimpuestos) }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500">Total Precio</div>
        <div class="font-bold">{{ formatMoneda(totales.totalprecio) }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500">Imp exento</div>
        <div class="font-bold">{{ formatMoneda(totales.varcn0) }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500">Gravado</div>
        <div class="font-bold">{{ formatMoneda(totales.varcn1) }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500">VarCN2</div>
        <div class="font-bold">{{ formatMoneda(totales.varcn2) }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500">VarCN3</div>
        <div class="font-bold">{{ formatMoneda(totales.varcn3) }}</div>
      </div>
    </div>

    <!-- Advertencia -->
    <UAlert
      v-if="!coinciden"
      color="warning"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      description="Los totales distribuidos no coinciden exactamente con los importes originales."
    />
  </div>
</template>
