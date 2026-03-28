<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import TablaCompras from '@/components/compras/TablaCompras.vue'
</script>

<template>
  <UDashboardPanel id="compras">
    <template #header>
      <UDashboardNavbar title="Compras" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body><TablaCompras></TablaCompras></template>
  </UDashboardPanel>
</template>
