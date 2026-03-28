<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  totalLitros: {
    type: Number,
    required: true
  },
  litrosActuales: {
    type: Number,
    required: true
  }
})

const porcentaje = computed(
  () => (props.litrosActuales / props.totalLitros) * 100
)

const gradientId = computed(() => {
  if (porcentaje.value < 30) return 'gradient-red'
  if (porcentaje.value < 60) return 'gradient-yellow'
  return 'gradient-blue'
})
</script>

<template>
  <div class="tank-container w-32 h-64 relative">
    <svg viewBox="0 0 100 200" class="w-full h-full">
      <!-- Contorno -->
      <rect
        x="10"
        y="10"
        width="80"
        height="180"
        rx="12"
        ry="12"
        fill="none"
        stroke="#555"
        stroke-width="4"
      />

      <!-- Clip del líquido -->
      <clipPath id="liquidClip">
        <rect
          x="10"
          :y="10 + 180 * (1 - porcentaje / 100)"
          width="80"
          :height="180 * (porcentaje / 100)"
          rx="12"
          ry="12"
        />
      </clipPath>

      <!-- Líquido -->
      <g clip-path="url(#liquidClip)" class="liquid">
        <path
          :d="`
            M10 ${200 - 180 * (porcentaje / 100)}
            Q50 ${190 - 180 * (porcentaje / 100)} 90 ${200 - 180 * (porcentaje / 100)}
            V200 H10 Z
          `"
          :fill="`url(#${gradientId})`"
        />
      </g>

      <!-- Gradientes -->
      <defs>
        <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#60a5fa" />
          <stop offset="100%" stop-color="#2563eb" />
        </linearGradient>

        <linearGradient id="gradient-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde047" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>

        <linearGradient id="gradient-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f87171" />
          <stop offset="100%" stop-color="#dc2626" />
        </linearGradient>
      </defs>

      <!-- Texto -->
      <text
        x="50"
        y="100"
        fill="white"
        font-size="16"
        font-weight="bold"
        text-anchor="middle"
      >
        {{ litrosActuales }} L
      </text>
    </svg>
  </div>
</template>
<style scoped>
.tank-container {
  transition: transform 0.3s ease;
}

.tank-container:hover {
  transform: scale(1.05);
}

/* Animación del líquido */
.liquid path {
  transition:
    transform 0.4s ease,
    filter 0.4s ease;
  transform-origin: center bottom;
}

.tank-container:hover .liquid path {
  transform: scaleY(1.03);
  filter: brightness(1.15);
}
</style>
