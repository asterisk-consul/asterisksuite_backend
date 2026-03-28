<script setup lang="ts">
import DollarCard from '@/components/dolar/DolarCard.vue'
import DollarCardPequeña from '@/components/dolar/DolarCardPequeña.vue'

const { data, pending, error } = await useFetch('/api/dolar')

const dolar = computed(() => (data.value as ApiDolar[]) || [])

// Filtrar oficial y blue
const principales = computed(() =>
  dolar.value.filter(
    (d) =>
      d.nombre.toLowerCase() === 'oficial' || d.nombre.toLowerCase() === 'blue'
  )
)

// El resto de los dólares
const resto = computed(() =>
  dolar.value.filter(
    (d) =>
      d.nombre.toLowerCase() !== 'oficial' && d.nombre.toLowerCase() !== 'blue'
  )
)

// Fecha de actualización (toma la primera cotización)
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

    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Grupo: Oficial y Blue -->
      <div class="mb-10 md:col-span-2 flex flex-col gap-6">
        <h2 class="text-2xl font-bold mb-4">Dólar Oficial y Blue</h2>
        <DollarCard
          v-for="d in principales"
          :key="d.casa"
          :title="`Dólar ${d.nombre}`"
          :compra="d.compra"
          :venta="d.venta"
        />
      </div>

      <!-- Grupo: demás dólares -->
      <div class="mb-10 md:col-span-2 flex flex-col gap-6">
        <h2 class="text-2xl font-bold mb-4">Otras Cotizaciones</h2>

        <DollarCardPequeña
          v-for="d in resto"
          :key="d.casa"
          :title="`Dólar ${d.nombre}`"
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
