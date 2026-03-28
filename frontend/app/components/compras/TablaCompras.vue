<script setup lang="ts">
import { sub } from 'date-fns'
import { ref, computed, watch } from 'vue'
import { UButton } from '#components'
import FiltroDateCompras from './FiltroDateCompras.vue'
import ModalCompras from './ModalCompras.vue'
import ModalProgresoCompras from './ModalProgresoCompras.vue'

import { getPaginationRowModel } from '@tanstack/vue-table'
import { columns } from './columns'

let interval: any = null
const loading = ref(false)
// const cargando = ref(false)
const table = useTemplateRef<any>('table')
const vista = ref('Compras A')
const data = ref<Compra[]>([])
const items = ref(['Compras A', 'Compras B'])
const columnaFiltro = ref<{ label: string; value: string }>({
  label: 'Sin Filtro',
  value: 'sinFiltro'
})
const comprasStore = useComprasStore()
const modalAbierto = ref(false)
const compraSeleccionada = ref<Partial<Compra>>({})

const modalProgreso = ref(false)
const mensaje = ref('')
const progreso = ref(0)

function abrirProgreso(
  data: boolean | { actual: number; total: number; mensaje: string }
) {
  // Si el hijo manda true -> abrir modal
  if (data === true) {
    modalProgreso.value = true
    return
  }

  // Si el hijo manda false -> cerrar modal
  if (data === false) {
    modalProgreso.value = false
    return
  }

  // Si manda el progreso detallado
  mensaje.value = data.mensaje
  progreso.value = Math.round((data.actual / data.total) * 100)
}

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

// ⚠️ NUEVO: Observar cambios en comprasStore y actualizar data automáticamente
watch(
  () => comprasStore.comprasA,
  (newCompras) => {
    if (vista.value === 'Compras A') {
      data.value = [...newCompras]
    }
  },
  { deep: true }
)

watch(
  () => comprasStore.comprasB,
  (newCompras) => {
    if (vista.value === 'Compras B') {
      data.value = [...newCompras]
    }
  },
  { deep: true }
)

const currentPage = computed(
  () => (table.value?.tableApi?.getState().pagination.pageIndex ?? 0) + 1
)

const itemsPerPage = computed(
  () => table.value?.tableApi?.getState().pagination.pageSize ?? 10
)

const totalItems = computed(
  () => table.value?.tableApi?.getFilteredRowModel().rows.length ?? 0
)

const handlePageChange = (page: number) => {
  table.value?.tableApi?.setPageIndex(page - 1)
}

const haySorting = computed(() => {
  return (table.value?.tableApi?.getState().sorting?.length || 0) > 0
})

function limpiarSorting() {
  if (!table.value?.tableApi) return
  table.value.tableApi.setSorting([])
}

const range = shallowRef<DateRange>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})

async function onSelectCompra(value: string) {
  if (value === 'Compras A') {
    data.value = [...comprasStore.comprasA]
  } else {
    data.value = [...comprasStore.comprasB]
  }
}

const dataFiltrada = computed(() => {
  if (!data.value.length) return []

  // ⚠️ Si es "Sin Filtro", devolver todos los datos
  if (columnaFiltro.value.value === 'sinFiltro') {
    return data.value
  }

  const start = new Date(range.value.start)
  const end = new Date(range.value.end)
  const col = columnaFiltro.value.value

  return data.value.filter((item) => {
    const fecha = new Date(item[col])
    return fecha >= start && fecha <= end
  })
})

const loadingModal = ref(false)

async function handleOpenModalCompra(e: any) {
  const compraParcial = e.detail
  if (!compraParcial?.id) return

  loadingModal.value = true
  try {
    const detalle = await comprasStore.fetchCompraDetalle(compraParcial.id)
    if (detalle) {
      compraSeleccionada.value = detalle
      modalAbierto.value = true
    } else {
      // Fallback si falla la carga
      compraSeleccionada.value = compraParcial
      modalAbierto.value = true
      console.error('No se pudo cargar el detalle completo')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingModal.value = false
  }
}

onMounted(async () => {
  if (!comprasStore.loaded) {
    loading.value = true
    await comprasStore.fetchComprasOnce()
    loading.value = false
  }

  loading.value = true
  // Carga incremental
  comprasStore.updateNuevasCompras()
  loading.value = false
  // Asignar a la tabla
  data.value = [...comprasStore.comprasA]
  // ⏳ Auto sync cada 5 minutos
  interval = setInterval(
    () => {
      comprasStore.updateNuevasCompras()
    },
    5 * 60 * 1000
  )

  window.addEventListener('open-modal-compra', handleOpenModalCompra)
})

onUnmounted(() => {
  clearInterval(interval)
  window.removeEventListener('open-modal-compra', handleOpenModalCompra)
})
</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <!-- ⚠️ NUEVO: Indicador de carga progresiva -->

    <div class="flex items-center justify-between gap-2 py-3.5 overflow-x-auto">
      <div class="flex items-center">
        <FiltroDateCompras
          v-model="range"
          @update:model-value="range = $event"
          class="-ms-1"
        />
        <USelectMenu
          v-model="columnaFiltro"
          :items="[
            { label: 'Sin Filtro', value: 'sinFiltro' },
            { label: 'Fecha', value: 'fecha' },
            { label: 'Fecha compromiso', value: 'fechacompromiso' }
          ]"
          variant="soft"
          class="w-[170px]"
          placeholder="Filtrar por..."
        />
      </div>
      <UButton
        v-if="haySorting"
        size="xs"
        color="neutral"
        variant="soft"
        class="flex items-center gap-1.5 rounded-2xl hover:cursor-pointer"
        icon="i-lucide-x"
        @click="limpiarSorting"
      >
        Limpiar Filtros
      </UButton>

      <USelectMenu
        v-model="vista"
        :items="items"
        @update:model-value="onSelectCompra"
        variant="soft"
        class="w-[200px]"
      />
    </div>

    <UTable
      :loading="loading"
      v-model:pagination="pagination"
      loadingAnimation="carousel"
      ref="table"
      :columns="columns"
      :data="dataFiltrada"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default'
      }"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
    />

    <div class="px-4 py-3.5 text-sm text-muted">
      Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} -
      {{ Math.min(currentPage * itemsPerPage, totalItems) }} de
      {{ totalItems }} fila(s)
    </div>
    <div class="flex justify-center border-t border-default pt-4 mt-4">
      <UPagination
        :default-page="currentPage"
        :items-per-page="itemsPerPage"
        :total="totalItems"
        @update:page="handlePageChange"
      />
    </div>
  </div>

  <UModal
    v-model:open="modalAbierto"
    title="Clasificar y Distribuir Importes"
    class="w-full max-w-6xl"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full hover:cursor-pointer'
    }"
  >
    <template #body>
      <ModalCompras
        :compras="compraSeleccionada"
        @close="modalAbierto = false"
        @progreso="abrirProgreso"
      />
    </template>
  </UModal>
  <UModal v-model:open="modalProgreso" prevent-close>
    <template #header>
      <h3 class="text-lg font-semibold text-neutral-50">
        Procesando registros
      </h3>
    </template>
    <template #body>
      <ModalProgresoCompras :mensaje="mensaje" :progreso="progreso" />
    </template>
  </UModal>
</template>
