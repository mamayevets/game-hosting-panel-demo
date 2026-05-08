<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler)

const props = defineProps<{
  label: string
  values: number[]
  color: string
  fillOpacity?: number
  unit?: string
  max?: number
}>()

function withAlpha(color: string, alpha: number) {
  if (color.startsWith('hsl(') && !color.includes('/')) {
    return color.replace(')', ` / ${alpha})`)
  }
  return color
}

const data = computed(() => ({
  labels: props.values.map((_, i) => i.toString()),
  datasets: [
    {
      label: props.label,
      data: props.values,
      borderColor: props.color,
      backgroundColor: withAlpha(props.color, props.fillOpacity ?? 0.18),
      borderWidth: 1.75,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
    },
  ],
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 600,
    easing: 'easeOutCubic' as const,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'hsl(0 0% 6.5%)',
      titleColor: 'hsl(0 0% 98%)',
      bodyColor: 'hsl(0 0% 90%)',
      borderColor: 'hsl(0 0% 14.9%)',
      borderWidth: 1,
      padding: 8,
      displayColors: false,
      callbacks: {
        label: (ctx: { parsed: { y: number | null } }) => `${ctx.parsed.y ?? 0}${props.unit ?? ''}`,
      },
    },
  },
  scales: {
    x: { display: false },
    y: {
      beginAtZero: true,
      max: props.max ?? 100,
      ticks: { color: 'hsl(0 0% 50%)', font: { size: 10 } },
      grid: { color: 'hsla(0, 0%, 50%, 0.08)' },
    },
  },
}))
</script>

<template>
  <div class="h-32">
    <Line :data="data" :options="options" />
  </div>
</template>
