<template>
  <UCard
    :ui="{
      body: 'p-4'
    }"
    variant="soft"
    class="border-2 border-gray-200 dark:border-gray-700"
  >
    <template #header>
      <h5
        class="text-2xl font-semibold text-gray-800 dark:text-white text-center"
      >
        {{ title }}
      </h5>
    </template>

    <div class="flex justify-center items-center gap-16">
      <div class="flex flex-col items-center">
        <span class="text-gray-600 dark:text-slate-400 text-lg">COMPRA</span>
        <span class="text-xl font-bold text-gray-800 dark:text-white">
          ${{ compra }}
        </span>
      </div>

      <div class="flex flex-col items-center">
        <span class="text-gray-600 dark:text-slate-400 text-lgs">VENTA</span>
        <span class="text-xl font-bold text-gray-800 dark:text-white">
          ${{ venta }}
        </span>
      </div>
    </div>

    <slot />
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  compra: number
  venta: number
}>()
</script>
