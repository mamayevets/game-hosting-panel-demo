<script setup lang="ts">
import type { Game } from '@/types'
import { cn } from '@/lib/utils'

const props = defineProps<{ game: Game; size?: 'sm' | 'md' | 'lg' | 'xl' }>()

const initial: Record<Game, string> = {
  minecraft: 'MC',
  ark: 'AR',
  rust: 'RS',
  palworld: 'PW',
  valheim: 'VH',
  cs2: 'CS',
}

const accent: Record<Game, string> = {
  minecraft: 'before:bg-emerald-500/70',
  ark: 'before:bg-orange-500/70',
  rust: 'before:bg-red-500/70',
  palworld: 'before:bg-purple-400/70',
  valheim: 'before:bg-sky-400/70',
  cs2: 'before:bg-amber-300/70',
}

const sizeClass = {
  sm: 'h-7 w-7 text-[9px]',
  md: 'h-9 w-9 text-[10px]',
  lg: 'h-11 w-11 text-xs',
  xl: 'h-14 w-14 text-sm',
}[props.size ?? 'md']
</script>

<template>
  <div
    :class="cn(
      'relative rounded-md flex items-center justify-center shrink-0 font-mono font-semibold tracking-tight bg-muted text-foreground border border-border/60 overflow-hidden',
      'before:content-[\'\'] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px]',
      sizeClass,
      accent[props.game],
    )"
  >
    {{ initial[props.game] }}
  </div>
</template>
