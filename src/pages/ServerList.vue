<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { servers } from '@/data/servers'
import StatusBadge from '@/components/StatusBadge.vue'
import GameIcon from '@/components/GameIcon.vue'
import type { Game, ServerStatus } from '@/types'
import { Search, Plus, Cpu, MemoryStick, Users, Globe2, ArrowRight, Activity, Server as ServerIcon, HardDrive } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const router = useRouter()
const search = ref('')
const gameFilter = ref<Game | 'all'>('all')
const statusFilter = ref<ServerStatus | 'all'>('all')

const filtered = computed(() => {
  return servers.filter((s) => {
    if (gameFilter.value !== 'all' && s.game !== gameFilter.value) return false
    if (statusFilter.value !== 'all' && s.status !== statusFilter.value) return false
    if (search.value && !s.name.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
})

const onlineCount = computed(() => servers.filter((s) => s.status === 'online').length)
const totalRam = computed(() => servers.reduce((sum, s) => sum + s.ramGb, 0))
const totalPlayers = computed(() => servers.reduce((sum, s) => sum + s.playersOnline, 0))

const games: { value: Game; label: string }[] = [
  { value: 'minecraft', label: 'Minecraft' },
  { value: 'rust', label: 'RUST' },
  { value: 'ark', label: 'ARK' },
  { value: 'palworld', label: 'Palworld' },
  { value: 'valheim', label: 'Valheim' },
  { value: 'cs2', label: 'CS2' },
]

function go(id: string) {
  router.push({ name: 'server-detail', params: { id } })
}

function handleNewServer() {
  toast.info('New server flow', {
    description: 'Hooks into the provisioning API in production.',
  })
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
      class="flex items-center justify-between mb-8"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Your servers</h1>
        <p class="text-sm text-muted-foreground mt-1">
          {{ servers.length }} servers · {{ onlineCount }} online · {{ totalPlayers }} players right now
        </p>
      </div>
      <Button class="gap-1.5" @click="handleNewServer">
        <Plus class="h-4 w-4" /> New server
      </Button>
    </motion.header>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <motion.div
        v-for="(stat, i) in [
          { label: 'Servers online', value: `${onlineCount} / ${servers.length}`, icon: ServerIcon, accent: 'text-emerald-500' },
          { label: 'Total RAM', value: `${totalRam} GB`, icon: HardDrive, accent: 'text-blue-500' },
          { label: 'Players online', value: `${totalPlayers}`, icon: Activity, accent: 'text-violet-500' },
        ]"
        :key="stat.label"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, delay: 0.05 * i }"
      >
        <Card class="border-border/60 hover:shadow-md transition-shadow">
          <CardContent class="p-5 flex items-center justify-between">
            <div>
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{{ stat.label }}</p>
              <p class="text-2xl font-bold mt-1.5 tabular-nums">{{ stat.value }}</p>
            </div>
            <div class="h-10 w-10 rounded-xl bg-muted flex items-center justify-center" :class="stat.accent">
              <component :is="stat.icon" class="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input v-model="search" type="text" placeholder="Search servers…" class="pl-9" />
      </div>
      <Select v-model="gameFilter">
        <SelectTrigger class="sm:w-44">
          <SelectValue placeholder="All games" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All games</SelectItem>
          <SelectItem v-for="g in games" :key="g.value" :value="g.value">{{ g.label }}</SelectItem>
        </SelectContent>
      </Select>
      <Select v-model="statusFilter">
        <SelectTrigger class="sm:w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="starting">Starting</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div
        v-for="(server, i) in filtered"
        :key="server.id"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.04 * i }"
        :while-hover="{ y: -2 }"
      >
        <Card
          role="button"
          tabindex="0"
          class="cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-lg transition-all group"
          @click="go(server.id)"
          @keydown.enter="go(server.id)"
          @keydown.space.prevent="go(server.id)"
        >
          <CardContent class="p-5">
            <div class="flex items-start gap-4">
              <GameIcon :game="server.game" size="xl" />
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <h3 class="font-semibold truncate group-hover:text-primary transition-colors">{{ server.name }}</h3>
                    <p class="text-xs text-muted-foreground mt-0.5 font-mono">{{ server.ipAddress }}:{{ server.port }}</p>
                  </div>
                  <StatusBadge :status="server.status" />
                </div>

                <div class="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
                  <div class="space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="flex items-center gap-1.5 text-muted-foreground">
                        <Cpu class="h-3 w-3" /> CPU
                      </span>
                      <span class="font-medium tabular-nums">{{ server.cpuPercent }}%</span>
                    </div>
                    <Progress :model-value="server.cpuPercent" class="h-1" />
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="flex items-center gap-1.5 text-muted-foreground">
                        <MemoryStick class="h-3 w-3" /> RAM
                      </span>
                      <span class="font-medium tabular-nums">{{ server.ramUsedPercent }}%</span>
                    </div>
                    <Progress :model-value="server.ramUsedPercent" class="h-1" />
                  </div>
                  <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users class="h-3 w-3" />
                    <span>{{ server.playersOnline }} / {{ server.playersMax }} players</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe2 class="h-3 w-3" />
                    <span class="capitalize">{{ server.region.replace('-', ' ') }}</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t flex items-center justify-between text-xs">
                  <Badge variant="secondary" class="font-normal">{{ server.plan }} · {{ server.version }}</Badge>
                  <span class="text-primary font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    Manage
                    <ArrowRight class="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    <Card v-if="filtered.length === 0" class="mt-6">
      <CardContent class="py-16 text-center">
        <div class="text-5xl mb-3">📭</div>
        <p class="text-foreground font-medium">No servers match your filters</p>
        <p class="text-sm text-muted-foreground mt-1">Try changing the search query or game type.</p>
      </CardContent>
    </Card>
  </div>
</template>
