<script setup lang="ts">
const props = defineProps<{
  distribucion: Distribucion
  index: number
  opcionesDisponibles: Array<{ label: string; value: string }>
  esValida: boolean
  puedeEliminar: boolean
}>()

const emit = defineEmits<{
  eliminar: []
  toggleBloqueo: []
  actualizarPorcentaje: []
  actualizarImporte: [campo: keyof ImportesDistribuidos] // 🆕 Nuevo evento
}>()
</script>

<template>
  <UCard
    variant="subtle"
    :class="['border p-1 my-3', !esValida ? 'border-error-500' : '']"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Encabezado -->
      <div
        class="col-span-1 md:col-span-2 flex justify-between items-center pb-2"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold">
            Distribución {{ index + 1 }}
          </span>

          <UBadge
            v-if="distribucion.bloqueada"
            color="warning"
            variant="soft"
            size="xs"
          >
            Bloqueada
          </UBadge>
        </div>

        <div class="flex gap-2">
          <UButton
            :icon="
              distribucion.bloqueada
                ? 'i-heroicons-lock-closed'
                : 'i-heroicons-lock-open'
            "
            :color="distribucion.bloqueada ? 'warning' : 'neutral'"
            variant="ghost"
            size="sm"
            @click="emit('toggleBloqueo')"
          >
            <UTooltip>
              {{ distribucion.bloqueada ? 'Desbloquear' : 'Bloquear' }}
            </UTooltip>
          </UButton>

          <UButton
            v-if="puedeEliminar"
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            size="sm"
            @click="emit('eliminar')"
          />
        </div>
      </div>

      <!-- Clasificación -->
      <div>
        <p class="text-sm font-medium mb-1">Clasificación</p>
        <USelectMenu
          v-model="distribucion.clasificacion"
          :items="opcionesDisponibles"
          placeholder="Clasificación"
          icon="i-heroicons-truck"
          class="w-full"
          nullable
          :disabled="distribucion.bloqueada"
        />
      </div>

      <!-- Porcentaje - Al cambiar, actualiza importes -->
      <div>
        <p class="text-sm font-medium mb-1">
          Porcentaje
          <UIcon name="i-heroicons-arrow-right" class="text-xs" />
          <span class="text-xs text-gray-500">Actualiza importes</span>
        </p>
        <UInputNumber
          v-model="distribucion.porcentaje"
          :min="0"
          :max="1"
          :step="0.0001"
          class="w-full"
          :format-options="{
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
          }"
          :disabled="distribucion.bloqueada"
          @update:model-value="emit('actualizarPorcentaje')"
        />
      </div>

      <!-- Total Impuestos - Al cambiar, actualiza porcentaje -->
      <div>
        <p class="text-sm font-medium mb-1">
          Total Impuestos
          <UIcon name="i-heroicons-arrow-left" class="text-xs" />
          <span class="text-xs text-gray-500">Actualiza porcentaje</span>
        </p>
        <UInputNumber
          v-model="distribucion.importes.totalimpuestos"
          class="w-full"
          :format-options="{
            style: 'currency',
            currency: 'ARS',
            currencyDisplay: 'narrowSymbol',
            currencySign: 'accounting'
          }"
          :disabled="distribucion.bloqueada"
          @update:model-value="emit('actualizarImporte', 'totalimpuestos')"
        />
      </div>

      <!-- Total Precio - Al cambiar, actualiza porcentaje -->
      <div>
        <p class="text-sm font-medium mb-1">
          Total Precio
          <UIcon name="i-heroicons-arrow-left" class="text-xs" />
          <span class="text-xs text-gray-500">Actualiza porcentaje</span>
        </p>
        <UInputNumber
          v-model="distribucion.importes.totalprecio"
          class="w-full"
          :format-options="{
            style: 'currency',
            currency: 'ARS',
            currencyDisplay: 'narrowSymbol',
            currencySign: 'accounting'
          }"
          :disabled="distribucion.bloqueada"
          @update:model-value="emit('actualizarImporte', 'totalprecio')"
        />
      </div>

      <!-- VarCNs - Al cambiar, actualiza porcentaje -->
      <div
        class="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div>
          <p class="text-sm font-medium mb-1">Imp excento</p>
          <UInputNumber
            v-model="distribucion.importes.varcn0"
            class="w-full"
            :format-options="{
              style: 'currency',
              currency: 'ARS',
              currencyDisplay: 'narrowSymbol',
              currencySign: 'accounting'
            }"
            :disabled="distribucion.bloqueada"
            @update:model-value="emit('actualizarImporte', 'varcn0')"
          />
        </div>

        <div>
          <p class="text-sm font-medium mb-1">Gravado</p>
          <UInputNumber
            v-model="distribucion.importes.varcn1"
            class="w-full"
            :format-options="{
              style: 'currency',
              currency: 'ARS',
              currencyDisplay: 'narrowSymbol',
              currencySign: 'accounting'
            }"
            :disabled="distribucion.bloqueada"
            @update:model-value="emit('actualizarImporte', 'varcn1')"
          />
        </div>

        <div>
          <p class="text-sm font-medium mb-1">Varcn2</p>
          <UInputNumber
            v-model="distribucion.importes.varcn2"
            class="w-full"
            :format-options="{
              style: 'currency',
              currency: 'ARS',
              currencyDisplay: 'narrowSymbol',
              currencySign: 'accounting'
            }"
            :disabled="distribucion.bloqueada"
            @update:model-value="emit('actualizarImporte', 'varcn2')"
          />
        </div>

        <div>
          <p class="text-sm font-medium mb-1">Varcn3</p>
          <UInputNumber
            v-model="distribucion.importes.varcn3"
            class="w-full"
            :format-options="{
              style: 'currency',
              currency: 'ARS',
              currencyDisplay: 'narrowSymbol',
              currencySign: 'accounting'
            }"
            :disabled="distribucion.bloqueada"
            @update:model-value="emit('actualizarImporte', 'varcn3')"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
