<script setup lang="ts">
import type { ServerStatus } from '../types'

const props = defineProps<{ status: ServerStatus }>()

const styles: Record<ServerStatus, string> = {
  online: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  offline: 'bg-slate-500/10 text-slate-700 dark:text-slate-400',
  starting: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  stopping: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  restarting: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
}

const dotStyles: Record<ServerStatus, string> = {
  online: 'bg-emerald-500 animate-pulse',
  offline: 'bg-slate-400',
  starting: 'bg-amber-500 animate-pulse',
  stopping: 'bg-amber-500 animate-pulse',
  restarting: 'bg-amber-500 animate-pulse',
}

const labels: Record<ServerStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  starting: 'Starting…',
  stopping: 'Stopping…',
  restarting: 'Restarting…',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
    :class="styles[props.status]"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotStyles[props.status]"></span>
    {{ labels[props.status] }}
  </span>
</template>
