<script setup lang="ts">
import { ref, watch } from 'vue'
import { useKilometrosStore } from '@/stores/useKilometrosStore'

const props = defineProps({
  registros: {
    type: Array as PropType<TransformedRow[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'completado'])

const csvStore = useKilometrosStore()

const dialogVisible = ref(false)
const envioCompleto = ref(false)
const progresoActual = ref(0)
const totalRegistros = ref(0)
const registroActual = ref<TransformedRow | null>(null)
const resultadosEnvio = ref<SaveResult>({
  exitosos: [],
  fallidos: [],
  total: 0
})

// Iniciar envío
const iniciarEnvio = async () => {
  envioCompleto.value = false
  progresoActual.value = 0
  registroActual.value = null
  resultadosEnvio.value = { exitosos: [], fallidos: [], total: 0 }
  totalRegistros.value = props.registros.length

  // Convertir datos como espera la API
  const datos: TransformedRow[] = props.registros.map((r) => ({
    id: r.id,
    patente: r.descripcion,
    kilometros: r.kilometros,
    fecha: r.fecha,
    descripcion: r.descripcion
  }))

  // Llamar método con callback de progreso
  const resultado = await csvStore.saveRegistroCabyCuerpo(
    datos,
    (actual, registro) => {
      progresoActual.value = actual
      registroActual.value = registro // ✅ Ahora funciona
    }
  )

  resultadosEnvio.value = resultado.resultados // ✅ Ahora funciona
  envioCompleto.value = true

  emit('completado', resultado)
}

const accordionItems = computed(() => {
  const items = []

  if (resultadosEnvio.value.exitosos.length > 0) {
    items.push({
      label: `Registros exitosos (${resultadosEnvio.value.exitosos.length})`,
      type: 'exitosos' // 👈 para saber qué lista mostrar
    })
  }

  if (resultadosEnvio.value.fallidos.length > 0) {
    items.push({
      label: `Registros fallidos (${resultadosEnvio.value.fallidos.length})`,
      type: 'fallidos'
    })
  }

  return items
})

onMounted(() => {
  iniciarEnvio()
})
</script>

<template>
  <UCard>
    <div class="p-4">
      <!-- Progreso general -->
      <div v-if="!envioCompleto" class="mb-6">
        <div class="flex justify-between text-sm mb-2">
          <span>Procesando: {{ progresoActual }} / {{ totalRegistros }}</span>
          <span class="text-gray-500">
            {{ Math.round((progresoActual / totalRegistros) * 100) }}%
          </span>
        </div>

        <UProgress
          :value="(progresoActual / totalRegistros) * 100"
          size="lg"
          class="rounded-full"
        />
      </div>

      <!-- Registro actual procesando -->
      <UCard
        v-if="registroActual && !envioCompleto"
        variant="outline"
        class="mb-6 border-gray-300"
      >
        <div class="flex items-center gap-3">
          <UProgress animation="carousel" size="xs" class="w-6" />
          <div>
            <div class="font-semibold">
              {{ registroActual.patente }}
            </div>
            <div class="text-gray-500 text-sm">
              {{ registroActual.kilometros }} km - {{ registroActual.fecha }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Resultados finales -->
      <div v-if="envioCompleto">
        <UAlert
          :color="resultadosEnvio.fallidos.length === 0 ? 'success' : 'warning'"
          variant="soft"
          class="mb-4"
          icon="i-heroicons-check-circle"
        >
          <template #title>
            {{
              resultadosEnvio.fallidos.length === 0
                ? '¡Envío completado!'
                : 'Envío completado con errores'
            }}
          </template>
          <template #description>
            {{ resultadosEnvio.exitosos.length }} exitosos —
            {{ resultadosEnvio.fallidos.length }} fallidos
          </template>
        </UAlert>

        <!-- Listas en acordeones -->
        <UAccordion :items="accordionItems" multiple>
          <!-- Título del item -->
          <template #default="{ item }">
            <div class="flex items-center gap-2">
              <UIcon
                :name="
                  item.type === 'exitosos'
                    ? 'i-heroicons-check-circle'
                    : 'i-heroicons-exclamation-triangle'
                "
                :class="
                  item.type === 'exitosos' ? 'text-green-600' : 'text-red-600'
                "
              />
              {{ item.label }}
            </div>
          </template>

          <!-- Contenido del item -->
          <template #content="{ item }">
            <ul class="space-y-2 pl-2">
              <!-- EXITOSOS -->
              <template v-if="item.type === 'exitosos'">
                <li
                  v-for="(reg, i) in resultadosEnvio.exitosos"
                  :key="`ok-${i}`"
                  class="flex items-start gap-2"
                >
                  <UIcon name="i-heroicons-check" class="text-green-600 mt-1" />
                  <div>
                    <div class="font-medium">{{ reg.patente }}</div>
                    <div class="text-gray-500 text-sm">
                      {{ reg.kilometros }} km — {{ reg.fecha }}
                    </div>
                  </div>
                </li>
              </template>

              <!-- FALLIDOS -->
              <template v-else>
                <li
                  v-for="(reg, i) in resultadosEnvio.fallidos"
                  :key="`err-${i}`"
                  class="flex items-start gap-2"
                >
                  <UIcon
                    name="i-heroicons-x-circle"
                    class="text-red-600 mt-1"
                  />
                  <div>
                    <div class="font-medium">{{ reg.patente }}</div>
                    <div class="text-red-600 text-sm">
                      {{ reg.error }}
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </template>
        </UAccordion>
      </div>
    </div>
  </UCard>
</template>
