<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useSeoMeta({
  title: 'Cotizaciones'
})
import CotizacionDolar from '@/components/dolar/CotizacionDolar.vue'
import OtrasMonedas from '@/components/dolar/OtrasMonedas.vue'
const items = [
  {
    label: 'Dolar',
    icon: 'i-lucide-banknote',
    slot: 'dolar'
  },
  {
    label: 'Otras Monedas',
    icon: 'i-lucide-coins',
    slot: 'otros'
  }
]
</script>

<template>
  <UDashboardPanel id="cotizaciones">
    <template #header>
      <UDashboardNavbar title="Cotizaciones" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTabs variant="link" :items="items">
        <template #dolar>
          <CotizacionDolar />
        </template>
        <template #otros>
          <OtrasMonedas />
        </template>
      </UTabs>
    </template>
  </UDashboardPanel>
</template>
