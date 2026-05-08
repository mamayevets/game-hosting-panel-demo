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
  unit?: string
  max?: number
}>()

const data = computed(() => ({
  labels: props.values.map((_, i) => i.toString()),
  datasets: [
    {
      label: props.label,
      data: props.values,
      borderColor: props.color,
      backgroundColor: props.color + '22',
      borderWidth: 2,
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
  plugins: {
    legend: { display: false },
    tooltip: {
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
      ticks: { color: '#94a3b8', font: { size: 10 } },
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
    },
  },
}))
</script>

<template>
  <div class="h-32">
    <Line :data="data" :options="options" />
  </div>
</template>
