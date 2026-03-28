<script setup lang="ts">
const props = defineProps<{
  compra: Partial<Compra>
}>()
</script>

<template>
  <div>
    <h2 class="text-lg mb-2 font-bold">Detalle de Compra</h2>
    <USeparator size="lg" class="mb-2" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pb-5">
      <div class="flex flex-col w-full gap-1">
        <p>Proveedor: {{ compra?.obsadm || '—' }}</p>
        <p>Concepto: {{ compra?.obsinicio || '—' }}</p>
        <p>Motivo: {{ compra?.obsventas || '—' }}</p>
      </div>

      <div class="flex flex-col w-full gap-1">
        <p>Comprobante: {{ compra?.referenciatexto || '—' }}</p>
        <p>
          Fecha:
          {{
            compra?.fecha
              ? new Date(compra.fecha).toLocaleDateString('es-AR')
              : '—'
          }}
        </p>
        <p>
          Fecha Compromiso:
          {{
            compra?.fechacompromiso
              ? new Date(compra.fechacompromiso).toLocaleDateString('es-AR')
              : '—'
          }}
        </p>
      </div>
    </div>

    <USeparator size="lg" class="mb-2" />

    <div class="flex justify-center gap-8 pt-2">
      <UBadge
        variant="outline"
        color="primary"
        class="flex flex-col justify-around"
      >
        Total con Impuestos:
        <span class="dark:text-neutral-50 text-neutral-900 text-base">
          ${{ compra?.totalimpuestos || '—' }}
        </span>
      </UBadge>

      <UBadge
        variant="outline"
        color="primary"
        class="flex flex-col justify-around"
      >
        Total:
        <span class="dark:text-neutral-50 text-neutral-900 text-base">
          ${{ compra?.totalprecio || '—' }}
        </span>
      </UBadge>

      <UBadge
        variant="outline"
        color="primary"
        class="flex flex-col justify-around"
      >
        Imp excento:
        <span class="dark:text-neutral-50 text-neutral-900 text-base">
          ${{ compra?.varcn0 || '—' }}
        </span>
      </UBadge>

      <UBadge
        variant="outline"
        color="primary"
        class="flex flex-col justify-around"
      >
        Gravado:
        <span class="dark:text-neutral-50 text-neutral-900 text-base">
          ${{ compra?.varcn1 || '—' }}
        </span>
      </UBadge>
    </div>
  </div>
</template>
