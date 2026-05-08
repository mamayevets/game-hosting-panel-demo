<script setup lang="ts">
import type { ServerStatus } from '@/types'
import { cn } from '@/lib/utils'

const props = defineProps<{ status: ServerStatus; size?: 'sm' | 'md' }>()

const styles: Record<ServerStatus, string> = {
  online: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
  offline: 'bg-muted text-muted-foreground ring-border',
  starting: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
  stopping: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
  restarting: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
}

const dotStyles: Record<ServerStatus, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-muted-foreground/40',
  starting: 'bg-amber-500',
  stopping: 'bg-amber-500',
  restarting: 'bg-amber-500',
}

const labels: Record<ServerStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  starting: 'Starting',
  stopping: 'Stopping',
  restarting: 'Restarting',
}

const animated: Record<ServerStatus, boolean> = {
  online: true,
  offline: false,
  starting: true,
  stopping: true,
  restarting: true,
}
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset',
      styles[props.status],
      props.size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
    )"
  >
    <span class="relative flex h-1.5 w-1.5">
      <span
        v-if="animated[props.status]"
        :class="cn('absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping', dotStyles[props.status])"
      />
      <span :class="cn('relative inline-flex h-1.5 w-1.5 rounded-full', dotStyles[props.status])" />
    </span>
    {{ labels[props.status] }}
  </span>
</template>
