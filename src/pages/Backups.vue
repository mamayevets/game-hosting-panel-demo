<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { backups } from '@/data/activity'
import GameIcon from '@/components/GameIcon.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Download, History, ExternalLink, Database, HardDrive, Clock, Plus } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const router = useRouter()

const totalSize = computed(() => backups.filter((b) => b.status === 'completed').reduce((s, b) => s + b.sizeGb, 0))
const successRate = computed(() => {
  const completed = backups.filter((b) => b.status === 'completed').length
  return Math.round((completed / backups.length) * 100)
})

function fmtDuration(s: number) {
  if (s === 0) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

function notify(label: string, description?: string) {
  toast.message(label, description ? { description } : undefined)
}

function openServer(id: string) {
  router.push({ name: 'server-detail', params: { id } })
}

const statusBadgeClass: Record<'completed' | 'in-progress' | 'failed', string> = {
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10',
  'in-progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/10',
}

const stats = computed(() => [
  { label: 'Snapshots', value: backups.filter((b) => b.status === 'completed').length, icon: Database },
  { label: 'Total size', value: `${totalSize.value.toFixed(1)} GB`, icon: HardDrive },
  { label: 'Success', value: `${successRate.value}%`, icon: History },
  { label: 'Retention', value: '7d / 4w', icon: Clock },
])
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-6">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
      class="space-y-3"
    >
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Backups</h1>
        <p class="text-sm text-muted-foreground mt-1">Daily snapshots and on-demand backups.</p>
      </div>
      <Button class="w-full sm:w-auto gap-1.5" @click="notify('New backup queued', 'Pick a server in production · runs immediately.')">
        <Plus class="h-4 w-4" /> New backup
      </Button>
    </motion.header>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.05 }">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card v-for="stat in stats" :key="stat.label">
          <CardContent class="p-4">
            <div class="flex items-center gap-2 mb-1.5">
              <component :is="stat.icon" class="h-3.5 w-3.5 text-muted-foreground" />
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{{ stat.label }}</p>
            </div>
            <p class="text-lg sm:text-xl font-semibold tabular-nums">{{ stat.value }}</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.1 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">All snapshots</CardTitle>
          <CardDescription class="text-xs">Tap a row to open the server. Use the menu to restore or download.</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
          <ul class="divide-y">
            <li
              v-for="b in backups"
              :key="b.id"
              class="p-4 flex items-start gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
              @click="openServer(b.serverId)"
            >
              <GameIcon :game="b.game" size="md" />
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <p class="text-sm font-medium leading-tight">{{ b.serverName }}</p>
                  <Badge variant="outline" :class="statusBadgeClass[b.status]" class="capitalize text-[10px] shrink-0">
                    {{ b.status }}
                  </Badge>
                </div>
                <p class="text-[11px] text-muted-foreground mt-1 font-mono tabular-nums">
                  {{ b.startedAt }}
                </p>
                <div class="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                  <span class="capitalize">{{ b.type }}</span>
                  <span>·</span>
                  <span class="tabular-nums">{{ b.sizeGb.toFixed(1) }} GB</span>
                  <span>·</span>
                  <span class="tabular-nums">{{ fmtDuration(b.durationSec) }}</span>
                </div>
              </div>
              <div @click.stop>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-7 w-7 shrink-0">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-44">
                    <DropdownMenuItem @click="notify('Restore queued', b.serverName)">
                      <History class="h-4 w-4 mr-2" /> Restore
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="notify('Download started', `${b.sizeGb.toFixed(1)} GB`)">
                      <Download class="h-4 w-4 mr-2" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="openServer(b.serverId)">
                      <ExternalLink class="h-4 w-4 mr-2" /> Open server
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>
