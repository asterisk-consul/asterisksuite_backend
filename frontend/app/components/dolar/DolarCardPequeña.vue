<template>
  <UCard variant="soft" class="border-2 border-gray-200 dark:border-gray-700">
    <template #header>
      <div class="flex justify-between items-center gap-4">
        <div
          class="text-sm font-semibold text-gray-800 dark:text-white text-center"
        >
          {{ title }}
        </div>
        <div class="flex flex-col items-center">
          <span class="text-gray-600 dark:text-slate-400 text-sm">COMPRA</span>
          <span class="text-lg font-bold text-gray-800 dark:text-white">
            ${{ compra }}
          </span>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-gray-600 dark:text-slate-400 text-sm">VENTA</span>
          <span class="text-lg font-bold text-gray-800 dark:text-white">
            ${{ venta }}
          </span>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  compra: number
  venta: number
}>()
</script>
