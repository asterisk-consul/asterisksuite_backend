<script setup lang="ts">
import { FileService, type ImportResult } from '~/services/fileApi'

const file = ref<File | null>(null)
const loading = ref(false)
const result = ref<ImportResult | null>(null)
const error = ref<string | null>(null)

async function upload() {
  if (!file.value) return

  loading.value = true
  error.value = null
  result.value = null

  try {
    result.value = await FileService.apiPostFile(file.value)
  } catch (err: unknown) {
    console.error('Error completo:', err)
    const e = err as { data?: { message?: string }, message?: string }
    error.value = e?.data?.message || e?.message || 'Error al importar'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto mt-10 max-w-2xl">
    <h2 class="mb-4 text-xl font-semibold">
      Importar Artículo - Precio
    </h2>

    <UFileUpload
      v-model="file"
      color="neutral"
      highlight
      label="Arrastra tu archivo aquí"
      description=".xlsx, .csv"
      accept=".xlsx,.csv"
      class="min-h-48 w-full hover:cursor-pointer"
    />

    <p v-if="file" class="mt-2 text-sm font-medium">
      ✓ Archivo seleccionado: {{ file.name }} ({{
        (file.size / 1024).toFixed(2)
      }}
      KB)
    </p>

    <UButton :disabled="!file || loading" class="mt-4" @click="upload">
      {{ loading ? 'Importando...' : 'Importar' }}
    </UButton>

    <div v-if="result" class="mt-4">
      <div
        class="rounded border border-green-200 bg-green-50 p-4"
        :class="{ 'border-red-200 bg-red-50': !result.success }"
      >
        <h3 class="font-bold" :class="result.success ? 'text-green-800' : 'text-red-800'">
          {{ result.success ? '✓ Importación completada' : '✗ Importación con errores' }}
        </h3>
        <p class="text-sm" :class="result.success ? 'text-green-700' : 'text-red-700'">
          Total: {{ result.total }} | Parseados: {{ result.parsed }} | Guardados:
          {{ result.saved }} | Fallidos: {{ result.failed }}
        </p>
        <p v-if="result.message" class="text-sm text-red-700">
          {{ result.message }}
        </p>
      </div>

      <div
        v-if="result.errors && result.errors.length > 0"
        class="mt-4 rounded border border-yellow-200 bg-yellow-50 p-4"
      >
        <h4 class="mb-2 font-bold text-yellow-800">
          ⚠ Registros con errores ({{ result.errors.length }}):
        </h4>
        <div v-for="err in result.errors" :key="err.row" class="mb-2 text-sm">
          <span class="font-semibold">Fila {{ err.row }}:</span>
          <ul class="ml-4 list-disc text-yellow-700">
            <li v-for="msg in err.errors" :key="msg">
              {{ msg }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <p
      v-if="error"
      class="mt-4 rounded border border-red-200 bg-red-50 p-4 text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>
