<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import FormsubirCombustible from '~/components/combustible/FormsubirCombustible.vue'
import SubirCsv from '~/components/combustible/SubirCsv.vue'
import CisternaMedida from '~/components/combustible/CisternaMedida.vue'
import TablaList from '~/components/Tablas/TablaList.vue'
import { useArticulos } from '~/composables/articulos/useArticulos'

const open = ref(false)
const openCsv = ref(false)

const items = [
  {
    label: 'Combustibles',
    slot: 'combustibles',
    icon: 'i-lucide-fuel'
  },
  {
    label: 'Urea',
    slot: 'urea',
    icon: 'i-lucide-soap-dispenser-droplet'
  }
]

const {
  articulo: articuloCombustible,
  totalCantidad: totalCantidadCombustible
} = useArticulos(1189)

const { articulo: articuloUrea, totalCantidad: totalCantidadUrea } =
  useArticulos(1923)

const paramsCombustible = ref(
  buildRegistroParams({
    statusid: 1723,
    flowid: 11093
  })
)

const paramsUrea = ref(
  buildRegistroParams({
    statusid: 1731,
    flowid: 11093
  })
)

const {
  data: dataCombustible,
  loading: loadingCombustible,
  refresh: refreshCombustible
} = useRegistroCabList(paramsCombustible)

const { data: dataUrea, loading: loadingUrea } = useRegistroCabList(paramsUrea)

const onCombustibleSelection = (rows: any[]) => {
  // console.log('Combustible:', rows)
}

const onUreaSelection = (rows: any[]) => {
  // console.log('Urea:', rows)
}

const onSavedCombustible = () => {
  refreshCombustible()
}
</script>

<template>
  <UDashboardPanel id="combustible">
    <template #header>
      <UDashboardNavbar title="Combustible">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTabs color="neutral" variant="link" :items="items">
        <template #combustibles>
          <UDashboardNavbar title="Combustible">
            <template #right>
              <UButton
                icon="i-lucide-upload"
                label="Subir archivo"
                @click="openCsv = true"
              />
              <UButton
                icon="i-lucide-plus"
                label="Registrar movimiento"
                @click="open = true"
                color="warning"
              />
            </template>
          </UDashboardNavbar>
          <CisternaMedida
            :total-litros="5000"
            :litros-actuales="totalCantidadCombustible"
          />
          <TablaList
            table-key="combustible"
            :data="dataCombustible"
            :loading="loadingCombustible"
            selectable
            @selection-change="onCombustibleSelection"
          />
          <FormsubirCombustible v-model="open" @saved="onSavedCombustible" />
          <SubirCsv v-model="openCsv" />
        </template>
        <template #urea>
          <UDashboardNavbar title="Urea">
            <template #right>
              <UButton
                icon="i-lucide-upload"
                label="Subir archivo"
                @click="openCsv = true"
              />
              <UButton
                icon="i-lucide-plus"
                label="Registrar movimiento"
                @click="open = true"
                color="warning"
              />
            </template>
          </UDashboardNavbar>
          <CisternaMedida
            :total-litros="200"
            :litros-actuales="totalCantidadUrea"
          />
          <TablaList
            table-key="urea"
            :data="dataUrea"
            :loading="loadingUrea"
            selectable
            @selection-change="onUreaSelection"
          />

          <FormsubirCombustible v-model="open" />
          <SubirCsv v-model="openCsv" />
        </template>
      </UTabs>
    </template>
  </UDashboardPanel>
</template>
