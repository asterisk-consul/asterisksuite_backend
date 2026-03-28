<script setup lang="ts">
import InformacionCompra from './InformacionCompra.vue'
import ItemDistribucion from './ItemDistribucion.vue'
import TotalesDistribuidos from './TotalesDistribuidos.vue'
import AccionesDistribucion from './AccionesDistribucion.vue'
import z from 'zod'
import { distribucionesSchema } from '@/schemas/distribuciones.schema'
import { useDepositos } from '~/composables/useDeposito'

const depositosStore = useDepositosStore()
const comprasStore = useComprasStore()
const depositos = useDepositos()
const toast = useToast()

const props = defineProps<{
  compras: Partial<Compra>
}>()

const emit = defineEmits<{
  close: []
  progreso: [
    payload: boolean | { actual: number; total: number; mensaje: string }
  ]
}>()

// Usar el composable con todas las funcionalidades
const {
  distribuciones,
  totalesDistribuidos,
  totalesCoincidenCompletamente,
  agregarDistribucion,
  eliminarDistribucion,
  toggleBloqueo,
  calcularImportesPorPorcentaje,
  actualizarPorcentajeDesdeImporte,
  esDistribucionValida,
  prorraterarEquitativamente,
  distribuirTodosCamiones,
  ajustarDistribucionesNoBloquedas,
  getOpcionesDisponibles
} = useDistribuciones(toRef(props, 'compras'), depositos.selectCamiones)

// Método cuando se actualiza el porcentaje
const handleActualizarPorcentaje = (index: number) => {
  calcularImportesPorPorcentaje(index, true) // true = ajustar otras distribuciones
}

// 🆕 Método cuando se actualiza un importe
const handleActualizarImporte = (
  index: number,
  campo: keyof ImportesDistribuidos
) => {
  actualizarPorcentajeDesdeImporte(index, campo, true) // true = ajustar otras distribuciones
}

const guardarClasificacion = async () => {
  try {
    // Validar con Zod
    distribucionesSchema.parse(distribuciones.value)

    // Validar que los totales coincidan
    if (!totalesCoincidenCompletamente.value) {
      toast.add({
        title: 'Error de validación',
        description:
          'Los totales distribuidos no coinciden con los importes originales',
        color: 'error'
      })
      return
    }

    emit('progreso', true)

    await comprasStore.crearRegistrosClasificados(
      props.compras,
      distribuciones.value,
      ({ actual, total, mensaje: msg }) => {
        emit('progreso', { actual, total, mensaje: msg })
      }
    )

    toast.add({
      title: 'Éxito',
      description: 'Clasificación guardada correctamente',
      color: 'success'
    })

    emit('progreso', false)
    emit('close')
  } catch (error) {
    emit('progreso', false)

    if (error instanceof z.ZodError) {
      error.issues.forEach((issue: z.ZodIssue) => {
        toast.add({
          title: 'Error de validación',
          description: issue.message,
          color: 'error'
        })
      })
    } else {
      toast.add({
        title: 'Error',
        description: 'Ocurrió un error al guardar la clasificación',
        color: 'error'
      })
    }
  }
}

onMounted(async () => {
  await depositos.load()
})
</script>

<template>
  <UCard class="mb-4 w-full">
    <template #header>
      <InformacionCompra :compra="compras" />
    </template>

    <div class="flex justify-between items-center p-4">
      <h2 class="text-lg font-bold">Distribuciones</h2>
      <UButton
        variant="outline"
        color="primary"
        class="rounded-full"
        icon="i-lucide-plus"
        label="Agregar"
        @click="agregarDistribucion"
      />
    </div>

    <ItemDistribucion
      v-for="(dist, index) in distribuciones"
      :key="index"
      :distribucion="dist"
      :index="index"
      :opciones-disponibles="getOpcionesDisponibles(index)"
      :es-valida="esDistribucionValida(dist)"
      :puede-eliminar="distribuciones.length > 1"
      @eliminar="eliminarDistribucion(index)"
      @toggle-bloqueo="toggleBloqueo(index)"
      @actualizar-porcentaje="handleActualizarPorcentaje(index)"
      @actualizar-importe="(campo) => handleActualizarImporte(index, campo)"
    />

    <template #footer>
      <TotalesDistribuidos
        :totales="totalesDistribuidos"
        :coinciden="totalesCoincidenCompletamente"
      />

      <AccionesDistribucion
        class="mt-4"
        @prorratear="prorraterarEquitativamente"
        @distribuir-todos="distribuirTodosCamiones"
        @guardar="guardarClasificacion"
      />
    </template>
  </UCard>
</template>
