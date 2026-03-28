<script setup lang="ts">
import DollarCard from '@/components/dolar/DolarCard.vue'
import DollarCardPequeña from '@/components/dolar/DolarCardPequeña.vue'

const { data, pending, error } = await useFetch('/api/cotizaciones')

const dolar = computed(() => (data.value as ApiDolar[]) || [])
const resto = computed(() =>
  dolar.value.filter((d) => d.moneda.toUpperCase() !== 'USD')
)

const fechaActualizacion = computed(() =>
  dolar.value.length ? dolar.value[0]?.fechaActualizacion : null
)
</script>

<template>
  <div class="min-h-screen p-10">
    <div v-if="error" class="text-center" color="error">
      Error al obtener datos.
    </div>

    <div v-else-if="pending" class="text-center" color="warning">
      Cargando...
    </div>

    <div v-else>
      <h2 class="text-2xl font-bold mb-4">Otras Monedas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DollarCard
          v-for="d in resto"
          :key="d.casa"
          :title="d.nombre"
          :compra="d.compra"
          :venta="d.venta"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-10 text-sm" v-if="fechaActualizacion">
      <div class="mt-1 text-xl">
        Actualizado el
        {{ new Date(fechaActualizacion).toLocaleString('es-AR') }}
      </div>
      <span>Datos obtenidos de</span>
      <a
        href="https://dolarapi.com"
        target="_blank"
        class="bg-blue-600 text-white px-2 rounded"
      >
        DolarApi.com
      </a>
    </div>
  </div>
</template>
