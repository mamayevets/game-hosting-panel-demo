<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { servers } from '@/data/servers'
import { trends, playerHistory7d, playerHistory30d, playerHistory90d } from '@/data/analytics'
import StatusBadge from '@/components/StatusBadge.vue'
import GameIcon from '@/components/GameIcon.vue'
import PlayersAreaChart from '@/components/PlayersAreaChart.vue'
import type { ServerStatus } from '@/types'
import {
  Plus, TrendingUp, TrendingDown, Github, MoreHorizontal, GripVertical,
  Search, Settings2, ArrowUpRight,
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const router = useRouter()
const range = ref<'90d' | '30d' | '7d'>('90d')
const series = computed(() => {
  if (range.value === '7d') return playerHistory7d
  if (range.value === '30d') return playerHistory30d
  return playerHistory90d
})

const search = ref('')
const tab = ref<'all' | ServerStatus>('all')

const counts = computed(() => ({
  all: servers.length,
  online: servers.filter((s) => s.status === 'online').length,
  offline: servers.filter((s) => s.status === 'offline').length,
  starting: servers.filter((s) => s.status === 'starting').length,
}))

const filtered = computed(() => {
  return servers.filter((s) => {
    if (tab.value !== 'all' && s.status !== tab.value) return false
    if (search.value && !s.name.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
})

const selectedIds = ref<Set<string>>(new Set())
const allSelected = computed({
  get: () => filtered.value.length > 0 && filtered.value.every((s) => selectedIds.value.has(s.id)),
  set: (v: boolean) => {
    if (v) filtered.value.forEach((s) => selectedIds.value.add(s.id))
    else filtered.value.forEach((s) => selectedIds.value.delete(s.id))
  },
})

function toggle(id: string, v: boolean | 'indeterminate') {
  if (v === true) selectedIds.value.add(id)
  else selectedIds.value.delete(id)
}

function go(id: string) {
  router.push({ name: 'server-detail', params: { id } })
}

function notify(label: string, description?: string) {
  toast.message(label, description ? { description } : undefined)
}

const stats = computed(() => [
  {
    label: 'Servers online',
    value: `${trends.serversOnline.current} / ${trends.serversOnline.total}`,
    delta: `+${trends.serversOnline.deltaPercent.toFixed(1)}%`,
    direction: trends.serversOnline.direction,
    headline: trends.serversOnline.hint,
    sub: trends.serversOnline.sub,
  },
  {
    label: 'Active players',
    value: trends.activePlayers.current.toLocaleString(),
    delta: `${trends.activePlayers.deltaPercent.toFixed(1)}%`,
    direction: trends.activePlayers.direction,
    headline: trends.activePlayers.hint,
    sub: trends.activePlayers.sub,
  },
  {
    label: 'Provisioned RAM',
    value: `${trends.ramProvisioned.current} GB`,
    delta: `+${trends.ramProvisioned.deltaPercent.toFixed(1)}%`,
    direction: trends.ramProvisioned.direction,
    headline: trends.ramProvisioned.hint,
    sub: trends.ramProvisioned.sub,
  },
  {
    label: 'Uptime (30d)',
    value: `${trends.uptime30d.current.toFixed(2)}%`,
    delta: `+${trends.uptime30d.deltaPercent.toFixed(1)}%`,
    direction: trends.uptime30d.direction,
    headline: trends.uptime30d.hint,
    sub: trends.uptime30d.sub,
  },
])
</script>

<template>
  <div class="flex flex-col">
    <header class="flex items-center justify-between border-b px-6 lg:px-8 h-14 sticky top-0 bg-background/80 backdrop-blur z-10">
      <h1 class="text-base font-semibold tracking-tight">Dashboard</h1>
      <a
        href="https://github.com/mamayevets/game-hosting-panel-demo"
        target="_blank"
        rel="noreferrer"
        class="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
      >
        <Github class="h-4 w-4" /> GitHub
      </a>
    </header>

    <div class="px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] w-full mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <motion.div
          v-for="(s, i) in stats"
          :key="s.label"
          :initial="{ opacity: 0, y: 8 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.05 * i, ease: 'easeOut' }"
        >
          <Card class="@container/card relative overflow-hidden">
            <CardHeader class="space-y-0 gap-0 pb-0">
              <CardDescription class="text-xs">{{ s.label }}</CardDescription>
              <CardTitle class="text-3xl font-semibold tabular-nums tracking-tight mt-1">
                {{ s.value }}
              </CardTitle>
              <Badge
                variant="outline"
                class="absolute top-4 right-4 gap-1 rounded-md text-[11px] font-medium px-1.5 py-0.5"
              >
                <TrendingUp v-if="s.direction === 'up'" class="h-3 w-3" />
                <TrendingDown v-else class="h-3 w-3" />
                {{ s.delta }}
              </Badge>
            </CardHeader>
            <CardFooter class="pt-3 flex-col items-start gap-1 text-xs">
              <div class="flex items-center gap-1.5 font-medium">
                {{ s.headline }}
                <TrendingUp v-if="s.direction === 'up'" class="h-3.5 w-3.5" />
                <TrendingDown v-else class="h-3.5 w-3.5" />
              </div>
              <div class="text-muted-foreground">{{ s.sub }}</div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, delay: 0.2, ease: 'easeOut' }"
      >
        <Card>
          <CardHeader class="flex flex-row items-start justify-between gap-4 space-y-0 border-b pb-5">
            <div class="space-y-1">
              <CardTitle class="text-base">Total active players</CardTitle>
              <CardDescription>
                <span class="hidden sm:inline">Aggregated across every hosted server · </span>
                <span class="capitalize">last {{ range === '7d' ? '7 days' : range === '30d' ? '30 days' : '3 months' }}</span>
              </CardDescription>
            </div>
            <ToggleGroup v-model="range" type="single" variant="outline" size="sm" class="hidden md:flex">
              <ToggleGroupItem value="90d" class="text-xs px-3">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d" class="text-xs px-3">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d" class="text-xs px-3">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent class="px-2 sm:px-4 pt-6">
            <PlayersAreaChart :points="series" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, delay: 0.35, ease: 'easeOut' }"
      >
        <Tabs v-model="tab" class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <TabsList>
              <TabsTrigger value="all" class="gap-1.5">
                All
              </TabsTrigger>
              <TabsTrigger value="online" class="gap-1.5">
                Online
                <Badge variant="secondary" class="px-1 py-0 text-[10px] font-mono">{{ counts.online }}</Badge>
              </TabsTrigger>
              <TabsTrigger value="offline" class="gap-1.5">
                Offline
                <Badge variant="secondary" class="px-1 py-0 text-[10px] font-mono">{{ counts.offline }}</Badge>
              </TabsTrigger>
              <TabsTrigger value="starting" class="gap-1.5">
                Starting
                <Badge variant="secondary" class="px-1 py-0 text-[10px] font-mono">{{ counts.starting }}</Badge>
              </TabsTrigger>
            </TabsList>
            <div class="flex items-center gap-2">
              <div class="relative">
                <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  v-model="search"
                  placeholder="Search servers…"
                  class="pl-8 h-8 w-[180px] lg:w-[220px]"
                />
              </div>
              <Button variant="outline" size="sm" class="gap-1.5" @click="notify('Customize columns', 'Choose visible fields and persist per-user.')">
                <Settings2 class="h-3.5 w-3.5" />
                <span class="hidden sm:inline">Customize columns</span>
              </Button>
              <Button size="sm" class="gap-1.5" @click="notify('New server', 'Hooks into provisioning API in production.')">
                <Plus class="h-3.5 w-3.5" /> New server
              </Button>
            </div>
          </div>

          <TabsContent :value="tab" force-mount>
            <Card class="overflow-hidden">
              <Table>
                <TableHeader class="bg-muted/40">
                  <TableRow class="hover:bg-transparent">
                    <TableHead class="w-10">
                      <Checkbox v-model="allSelected" />
                    </TableHead>
                    <TableHead class="w-6" />
                    <TableHead>Server</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead class="text-right">CPU</TableHead>
                    <TableHead class="text-right">RAM</TableHead>
                    <TableHead class="text-right">Players</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead class="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <motion.tr
                    v-for="(server, i) in filtered"
                    :key="server.id"
                    :initial="{ opacity: 0, x: -6 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ duration: 0.3, delay: 0.04 * i }"
                    class="group cursor-pointer border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
                    :data-state="selectedIds.has(server.id) ? 'selected' : undefined"
                    @click="go(server.id)"
                  >
                    <TableCell @click.stop>
                      <Checkbox :model-value="selectedIds.has(server.id)" @update:model-value="(v) => toggle(server.id, v)" />
                    </TableCell>
                    <TableCell class="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                      <GripVertical class="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div class="flex items-center gap-3">
                        <GameIcon :game="server.game" size="sm" />
                        <div>
                          <div class="font-medium leading-tight">{{ server.name }}</div>
                          <div class="text-[11px] text-muted-foreground font-mono leading-tight mt-0.5">{{ server.ipAddress }}:{{ server.port }}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge :status="server.status" size="sm" />
                    </TableCell>
                    <TableCell class="text-muted-foreground capitalize">{{ server.region.replace('-', ' ') }}</TableCell>
                    <TableCell class="text-right font-mono tabular-nums">{{ server.cpuPercent }}%</TableCell>
                    <TableCell class="text-right font-mono tabular-nums">{{ server.ramUsedPercent }}%</TableCell>
                    <TableCell class="text-right font-mono tabular-nums">{{ server.playersOnline }} / {{ server.playersMax }}</TableCell>
                    <TableCell>
                      <Badge variant="outline" class="font-normal">{{ server.plan }}</Badge>
                    </TableCell>
                    <TableCell @click.stop>
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-44">
                          <DropdownMenuItem @click="go(server.id)">
                            <ArrowUpRight class="h-4 w-4 mr-2" /> Open
                          </DropdownMenuItem>
                          <DropdownMenuItem @click="notify('Restart issued', server.name)">Restart</DropdownMenuItem>
                          <DropdownMenuItem @click="notify('Backup queued', server.name)">Backup</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem class="text-destructive focus:text-destructive" @click="notify('Decommission', 'Confirmation dialog in production.')">
                            Decommission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                  <TableRow v-if="filtered.length === 0">
                    <TableCell :colspan="10" class="h-24 text-center text-muted-foreground">
                      No servers match your filters.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div class="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
                <span>{{ selectedIds.size }} of {{ filtered.length }} row(s) selected</span>
                <div class="flex items-center gap-2">
                  <span>Rows per page</span>
                  <Badge variant="outline" class="font-normal">{{ filtered.length }}</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  </div>
</template>
