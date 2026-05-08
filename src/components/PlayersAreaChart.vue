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
import { computed, useTemplateRef, watch, onMounted } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler)

const props = defineProps<{
  points: { date: string; players: number }[]
}>()

const chartRef = useTemplateRef<{ chart: { canvas: HTMLCanvasElement } | undefined }>('chartRef')

function readToken(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v ? `hsl(${v})` : fallback
}

function buildGradient(canvas: HTMLCanvasElement, height: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return readToken('--foreground', '#fff')
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  const fg = readToken('--foreground', '#fff')
  gradient.addColorStop(0, fg.replace(')', ' / 0.45)').replace('hsl(', 'hsl('))
  gradient.addColorStop(1, fg.replace(')', ' / 0)').replace('hsl(', 'hsl('))
  return gradient
}

const labels = computed(() => props.points.map((p) => p.date))
const values = computed(() => props.points.map((p) => p.players))

function dateLabel(iso: string) {
  const [, m, d] = iso.split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[m - 1]} ${d}`
}

const data = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Active players',
      data: values.value,
      borderColor: 'hsl(0 0% 95%)',
      borderWidth: 1.75,
      backgroundColor: 'rgba(255,255,255,0.18)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: 'hsl(0 0% 100%)',
      pointHoverBorderColor: 'hsl(0 0% 0%)',
      pointHoverBorderWidth: 2,
    },
  ],
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750,
    easing: 'easeOutCubic' as const,
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'hsl(0 0% 6.5%)',
      titleColor: 'hsl(0 0% 98%)',
      bodyColor: 'hsl(0 0% 90%)',
      borderColor: 'hsl(0 0% 14.9%)',
      borderWidth: 1,
      padding: 10,
      titleFont: { size: 11 },
      bodyFont: { size: 12, weight: 'bold' as const },
      displayColors: false,
      callbacks: {
        title: (items: { label: string }[]) => dateLabel(items[0]?.label ?? ''),
        label: (ctx: { parsed: { y: number | null } }) => `${ctx.parsed.y ?? 0} players`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'hsl(0 0% 50%)',
        font: { size: 11 },
        maxTicksLimit: 8,
        autoSkip: true,
        callback: function (this: { getLabelForValue: (v: number) => string }, value: string | number) {
          const raw = this.getLabelForValue(typeof value === 'number' ? value : Number(value))
          return dateLabel(raw)
        },
      },
      grid: { display: false },
      border: { display: false },
    },
    y: {
      display: false,
      grid: { display: false },
    },
  },
}))

function applyGradient() {
  const inst = chartRef.value as unknown as { chart?: { canvas: HTMLCanvasElement; data: { datasets: { backgroundColor: unknown }[] }; update: (mode?: 'none' | 'show') => void } } | null
  const chart = inst?.chart
  if (!chart) return
  const grad = buildGradient(chart.canvas, chart.canvas.clientHeight || 280)
  chart.data.datasets[0].backgroundColor = grad
  chart.update('none')
}

onMounted(() => {
  requestAnimationFrame(applyGradient)
})

watch(values, () => {
  requestAnimationFrame(applyGradient)
})
</script>

<template>
  <div class="h-[260px] w-full">
    <Line ref="chartRef" :data="data" :options="options" />
  </div>
</template>
