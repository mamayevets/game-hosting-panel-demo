<script setup lang="ts">
import type { Game } from '../types'

const props = defineProps<{ game: Game; size?: 'sm' | 'md' | 'lg' }>()

const emoji: Record<Game, string> = {
  minecraft: '🟢',
  ark: '🦖',
  rust: '🔫',
  palworld: '🐉',
  valheim: '⚔️',
  cs2: '🎯',
}

const bg: Record<Game, string> = {
  minecraft: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  ark: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  rust: 'bg-red-500/10 text-red-600 dark:text-red-400',
  palworld: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  valheim: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  cs2: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
}

const sizeClass = {
  sm: 'h-7 w-7 text-sm',
  md: 'h-9 w-9 text-base',
  lg: 'h-12 w-12 text-xl',
}[props.size ?? 'md']
</script>

<template>
  <div
    class="rounded-lg flex items-center justify-center"
    :class="[sizeClass, bg[props.game]]"
  >
    {{ emoji[props.game] }}
  </div>
</template>
