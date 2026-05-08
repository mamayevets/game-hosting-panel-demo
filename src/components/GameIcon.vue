<script setup lang="ts">
import type { Game } from '@/types'
import { cn } from '@/lib/utils'

const props = defineProps<{ game: Game; size?: 'sm' | 'md' | 'lg' | 'xl' }>()

const emoji: Record<Game, string> = {
  minecraft: '🟢',
  ark: '🦖',
  rust: '🔫',
  palworld: '🐉',
  valheim: '⚔️',
  cs2: '🎯',
}

const bg: Record<Game, string> = {
  minecraft: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
  ark: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-orange-500/20',
  rust: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20',
  palworld: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20',
  valheim: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20',
  cs2: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 ring-yellow-500/20',
}

const sizeClass = {
  sm: 'h-7 w-7 text-sm',
  md: 'h-9 w-9 text-base',
  lg: 'h-11 w-11 text-lg',
  xl: 'h-14 w-14 text-2xl',
}[props.size ?? 'md']
</script>

<template>
  <div
    :class="cn('rounded-xl flex items-center justify-center ring-1 ring-inset shrink-0', sizeClass, bg[props.game])"
  >
    {{ emoji[props.game] }}
  </div>
</template>
