<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { backups } from '@/data/activity'
import GameIcon from '@/components/GameIcon.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Download, History, ExternalLink, Database, HardDrive, Clock } from 'lucide-vue-next'
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
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'in-progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Backups</h1>
        <p class="text-sm text-muted-foreground mt-1">Daily snapshots + on-demand backups for every server.</p>
      </div>
      <Button class="self-start sm:self-auto" @click="notify('New backup queued', 'Choose a server in production · runs immediately.')">
        <Database class="h-4 w-4 mr-1.5" /> New backup
      </Button>
    </header>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <motion.div
        v-for="(card, i) in [
          { label: 'Snapshots stored', value: backups.filter(b => b.status === 'completed').length, icon: Database },
          { label: 'Total size', value: `${totalSize.toFixed(1)} GB`, icon: HardDrive },
          { label: 'Success rate', value: `${successRate}%`, icon: History },
          { label: 'Retention', value: '7 daily · 4 weekly', icon: Clock },
        ]"
        :key="card.label"
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.05 * i }"
      >
        <Card>
          <CardContent class="p-4 flex items-start justify-between">
            <div>
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{{ card.label }}</p>
              <p class="text-xl sm:text-2xl font-semibold mt-1.5 tabular-nums">{{ card.value }}</p>
            </div>
            <component :is="card.icon" class="h-5 w-5 text-muted-foreground/70 shrink-0" />
          </CardContent>
        </Card>
      </motion.div>
    </div>

    <Card class="overflow-hidden">
      <div class="overflow-x-auto">
        <Table class="min-w-[760px]">
          <TableHeader class="bg-muted/40">
            <TableRow class="hover:bg-transparent">
              <TableHead>Server</TableHead>
              <TableHead>Started</TableHead>
              <TableHead class="text-right">Duration</TableHead>
              <TableHead class="text-right">Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="b in backups"
              :key="b.id"
              class="cursor-pointer"
              @click="openServer(b.serverId)"
            >
              <TableCell>
                <div class="flex items-center gap-3">
                  <GameIcon :game="b.game" size="sm" />
                  <div>
                    <p class="text-sm font-medium leading-tight">{{ b.serverName }}</p>
                    <p class="text-[11px] text-muted-foreground font-mono leading-tight mt-0.5">{{ b.id }}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell class="text-muted-foreground text-sm whitespace-nowrap">{{ b.startedAt }}</TableCell>
              <TableCell class="text-right font-mono tabular-nums">{{ fmtDuration(b.durationSec) }}</TableCell>
              <TableCell class="text-right font-mono tabular-nums">{{ b.sizeGb.toFixed(1) }} GB</TableCell>
              <TableCell>
                <Badge variant="outline" class="capitalize font-normal">{{ b.type }}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" :class="statusBadgeClass[b.status]" class="capitalize">
                  {{ b.status }}
                </Badge>
              </TableCell>
              <TableCell @click.stop>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  </div>
</template>
