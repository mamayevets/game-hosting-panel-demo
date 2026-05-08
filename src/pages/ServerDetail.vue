<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { servers } from '@/data/servers'
import { initialConsole, players, plugins as pluginCatalog, fileTree } from '@/data/console'
import StatusBadge from '@/components/StatusBadge.vue'
import GameIcon from '@/components/GameIcon.vue'
import ResourceChart from '@/components/ResourceChart.vue'
import {
  Play, Square, RotateCw, Save, Activity, Terminal, FolderOpen, Puzzle,
  ArrowLeft, Folder, FileText, ChevronRight, Copy, Wifi, Search, Send,
} from 'lucide-vue-next'
import type { ConsoleLine, ServerStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const server = computed(() => servers.find((s) => s.id === route.params.id))

const activeTab = ref<'overview' | 'console' | 'files' | 'plugins'>('overview')

const overrideStatus = ref<ServerStatus | null>(null)
const status = computed<ServerStatus>(() => overrideStatus.value ?? server.value?.status ?? 'offline')
const isBusy = computed(() => ['restarting', 'stopping', 'starting'].includes(status.value))

const backupProgress = ref<number | null>(null)
let backupTimer: number | undefined

function runAction(target: 'restart' | 'stop' | 'start') {
  if (isBusy.value) return
  if (target === 'restart') {
    overrideStatus.value = 'restarting'
    pushLine({ timestamp: ts(), level: 'system', text: '> Restart issued by demo@test.host' })
    setTimeout(() => {
      overrideStatus.value = 'online'
      pushLine({ timestamp: ts(), level: 'system', text: 'Server back online (downtime 2.4s)' })
      toast.success('Restart complete', { description: 'Server is online again.' })
    }, 2500)
  } else if (target === 'stop') {
    overrideStatus.value = 'stopping'
    pushLine({ timestamp: ts(), level: 'system', text: '> Stop issued · saving world' })
    setTimeout(() => {
      overrideStatus.value = 'offline'
      pushLine({ timestamp: ts(), level: 'system', text: 'Server stopped gracefully' })
      toast.success('Server stopped')
    }, 2000)
  } else if (target === 'start') {
    overrideStatus.value = 'starting'
    pushLine({ timestamp: ts(), level: 'system', text: '> Start issued · provisioning runtime' })
    setTimeout(() => {
      overrideStatus.value = 'online'
      pushLine({ timestamp: ts(), level: 'system', text: 'Listening on 0.0.0.0:25565' })
      toast.success('Server started')
    }, 3000)
  }
}

function runBackup() {
  if (backupProgress.value !== null) return
  backupProgress.value = 0
  toast.message('Backup started', { description: 'Snapshot streams to storage in the background.' })
  pushLine({ timestamp: ts(), level: 'system', text: '> Backup started · world + plugins + config' })
  let p = 0
  if (backupTimer) window.clearInterval(backupTimer)
  backupTimer = window.setInterval(() => {
    p = Math.min(100, p + Math.random() * 8 + 4)
    backupProgress.value = Math.round(p)
    if (p >= 100) {
      window.clearInterval(backupTimer)
      backupTimer = undefined
      setTimeout(() => {
        backupProgress.value = null
        pushLine({ timestamp: ts(), level: 'info', text: 'Backup completed · 4.2 GB compressed' })
        toast.success('Backup completed', { description: '4.2 GB · stored in current region.' })
      }, 400)
    }
  }, 220)
}

const cpuHistory = ref<number[]>(
  Array.from({ length: 30 }, () => Math.round((server.value?.cpuPercent ?? 30) + (Math.random() - 0.5) * 15)),
)
const ramHistory = ref<number[]>(
  Array.from({ length: 30 }, () => Math.round((server.value?.ramUsedPercent ?? 60) + (Math.random() - 0.5) * 8)),
)
const playerHistory = ref<number[]>(
  Array.from({ length: 30 }, () => server.value?.playersOnline ?? 0),
)

let timer: number | undefined

function tick() {
  if (!server.value) return
  if (status.value === 'online') {
    cpuHistory.value = [...cpuHistory.value.slice(1), Math.max(0, Math.min(100, Math.round(server.value.cpuPercent + (Math.random() - 0.5) * 18)))]
    ramHistory.value = [...ramHistory.value.slice(1), Math.max(0, Math.min(100, Math.round(server.value.ramUsedPercent + (Math.random() - 0.5) * 6)))]
    playerHistory.value = [...playerHistory.value.slice(1), server.value.playersOnline + (Math.random() > 0.85 ? 1 : 0)]
  } else if (status.value === 'offline') {
    cpuHistory.value = [...cpuHistory.value.slice(1), 0]
    ramHistory.value = [...ramHistory.value.slice(1), 0]
    playerHistory.value = [...playerHistory.value.slice(1), 0]
  }
}

const consoleLines = ref<ConsoleLine[]>(initialConsole.slice())
const consoleInput = ref('')
const consoleEl = ref<HTMLElement | null>(null)

function ts() {
  return new Date().toTimeString().slice(0, 8)
}

function pushLine(line: ConsoleLine) {
  consoleLines.value.push(line)
  setTimeout(() => {
    consoleEl.value?.scrollTo({ top: consoleEl.value.scrollHeight, behavior: 'smooth' })
  }, 30)
}

function streamRandomLine() {
  const samples = [
    'Saving the game (this may take a moment)',
    'Saved the game',
    'Auto-save done',
    'CraftyKid: dinner break, brb',
    'CraftyKid left the game',
    'BlockMaster42: nice base!',
    'Auto-saving world…',
  ]
  const text = samples[Math.floor(Math.random() * samples.length)]
  pushLine({ timestamp: ts(), level: 'info', text })
}

function sendCommand() {
  if (!consoleInput.value.trim()) return
  pushLine({ timestamp: ts(), level: 'system', text: `> ${consoleInput.value}` })
  const input = consoleInput.value
  setTimeout(() => {
    pushLine({ timestamp: ts(), level: 'info', text: `Command "${input}" executed (mock)` })
  }, 200)
  consoleInput.value = ''
}

watch(activeTab, (t) => {
  if (t === 'console') {
    setTimeout(() => {
      consoleEl.value?.scrollTo({ top: consoleEl.value.scrollHeight })
    }, 60)
  }
})

onMounted(() => {
  if (!server.value) return
  timer = window.setInterval(() => {
    tick()
    if (Math.random() > 0.5 && status.value === 'online') streamRandomLine()
  }, 2500)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
  if (backupTimer) window.clearInterval(backupTimer)
})

const expandedDirs = ref<Set<string>>(new Set(['world', 'plugins']))
function toggleDir(name: string) {
  if (expandedDirs.value.has(name)) expandedDirs.value.delete(name)
  else expandedDirs.value.add(name)
}
function fmtSize(bytes?: number) {
  if (bytes === undefined) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const pluginSearch = ref('')
const installedPlugins = ref(new Set(pluginCatalog.filter((p) => p.installed).map((p) => p.id)))
const filteredPlugins = computed(() =>
  pluginCatalog.filter((p) =>
    !pluginSearch.value || p.name.toLowerCase().includes(pluginSearch.value.toLowerCase()),
  ),
)
function togglePlugin(id: string, name: string) {
  if (installedPlugins.value.has(id)) {
    installedPlugins.value.delete(id)
    toast.success(`Uninstalled ${name}`)
  } else {
    installedPlugins.value.add(id)
    toast.success(`Installed ${name}`)
  }
}

function copyAddress() {
  if (!server.value) return
  navigator.clipboard.writeText(`${server.value.ipAddress}:${server.value.port}`)
  toast.success('Address copied')
}

const cpuLatest = computed(() => cpuHistory.value[cpuHistory.value.length - 1])
const ramLatest = computed(() => ramHistory.value[ramHistory.value.length - 1])
const playersLatest = computed(() => playerHistory.value[playerHistory.value.length - 1])

const livePlayersOnline = computed(() => {
  if (status.value !== 'online') return 0
  return server.value?.playersOnline ?? 0
})
</script>

<template>
  <div v-if="server" class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <transition name="banner">
      <div
        v-if="backupProgress !== null"
        class="sticky top-0 z-10 mb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-3"
      >
        <div class="rounded-md border bg-card/90 backdrop-blur p-3 shadow-sm">
          <div class="flex items-center gap-2 text-sm">
            <Save class="h-4 w-4 animate-pulse" />
            <span class="flex-1 font-medium">Backup in progress…</span>
            <span class="font-mono tabular-nums text-muted-foreground">{{ backupProgress }}%</span>
          </div>
          <div class="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              class="h-full bg-foreground transition-all duration-200 ease-linear"
              :style="{ width: `${backupProgress}%` }"
            />
          </div>
        </div>
      </div>
    </transition>

    <Button variant="ghost" size="sm" class="mb-4 -ml-3 gap-1.5 text-muted-foreground hover:text-foreground" @click="router.push({ name: 'servers' })">
      <ArrowLeft class="h-4 w-4" /> All servers
    </Button>

    <motion.div
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <Card class="mb-6 border-border/60 overflow-hidden">
        <CardContent class="p-4 sm:p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-start gap-3 sm:gap-4 min-w-0">
              <GameIcon :game="server.game" :size="'xl'" />
              <div class="min-w-0">
                <div class="flex items-center flex-wrap gap-2 sm:gap-3">
                  <h1 class="text-lg sm:text-xl font-bold tracking-tight">{{ server.name }}</h1>
                  <StatusBadge :status="status" />
                </div>
                <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  <span class="font-mono break-all">{{ server.ipAddress }}:{{ server.port }}</span>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button class="hover:text-foreground transition-colors" @click="copyAddress">
                        <Copy class="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Copy address</TooltipContent>
                  </Tooltip>
                  <span>·</span>
                  <span class="capitalize">{{ server.region.replace('-', ' ') }}</span>
                  <span>·</span>
                  <span>{{ server.version }}</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 sm:flex gap-2 shrink-0">
              <Button variant="outline" size="sm" class="gap-1.5" :disabled="isBusy" @click="runAction('restart')">
                <RotateCw class="h-4 w-4" :class="{ 'animate-spin': status === 'restarting' }" />
                <span class="hidden sm:inline">{{ status === 'restarting' ? 'Restarting…' : 'Restart' }}</span>
              </Button>
              <Button v-if="status === 'online' || status === 'stopping'" variant="destructive" size="sm" class="gap-1.5" :disabled="isBusy" @click="runAction('stop')">
                <Square class="h-4 w-4" />
                <span class="hidden sm:inline">{{ status === 'stopping' ? 'Stopping…' : 'Stop' }}</span>
              </Button>
              <Button v-else size="sm" class="gap-1.5" :disabled="isBusy" @click="runAction('start')">
                <Play class="h-4 w-4" />
                <span class="hidden sm:inline">{{ status === 'starting' ? 'Starting…' : 'Start' }}</span>
              </Button>
              <Button variant="outline" size="sm" class="gap-1.5" :disabled="backupProgress !== null" @click="runBackup">
                <Save class="h-4 w-4" />
                <span class="hidden sm:inline">{{ backupProgress !== null ? `${backupProgress}%` : 'Backup' }}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <Tabs v-model="activeTab" class="space-y-6">
      <TabsList class="grid grid-cols-4 w-full sm:max-w-xl h-9">
        <TabsTrigger value="overview" class="gap-1.5 text-xs sm:text-sm">
          <Activity class="h-3.5 w-3.5" /> Overview
        </TabsTrigger>
        <TabsTrigger value="console" class="gap-1.5 text-xs sm:text-sm">
          <Terminal class="h-3.5 w-3.5" /> Console
        </TabsTrigger>
        <TabsTrigger value="files" class="gap-1.5 text-xs sm:text-sm">
          <FolderOpen class="h-3.5 w-3.5" /> Files
        </TabsTrigger>
        <TabsTrigger value="plugins" class="gap-1.5 text-xs sm:text-sm">
          <Puzzle class="h-3.5 w-3.5" /> Plugins
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent class="p-4 sm:p-5">
              <div class="flex items-center justify-between mb-2">
                <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">CPU</p>
                <p class="text-base sm:text-lg font-bold tabular-nums">{{ cpuLatest }}%</p>
              </div>
              <ResourceChart label="CPU" :values="cpuHistory" color="hsl(0 0% 95%)" unit="%" />
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-4 sm:p-5">
              <div class="flex items-center justify-between mb-2">
                <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">RAM ({{ server.ramGb }} GB)</p>
                <p class="text-base sm:text-lg font-bold tabular-nums">{{ ramLatest }}%</p>
              </div>
              <ResourceChart label="RAM" :values="ramHistory" color="hsl(0 0% 75%)" unit="%" />
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-4 sm:p-5">
              <div class="flex items-center justify-between mb-2">
                <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Players</p>
                <p class="text-base sm:text-lg font-bold tabular-nums">{{ playersLatest }} / {{ server.playersMax }}</p>
              </div>
              <ResourceChart label="Players" :values="playerHistory" color="hsl(0 0% 55%)" :max="server.playersMax" />
            </CardContent>
          </Card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-base flex items-center gap-2">
                <Wifi class="h-4 w-4" /> Connection
              </CardTitle>
            </CardHeader>
            <CardContent class="text-sm">
              <dl class="space-y-2.5">
                <div class="flex justify-between gap-3"><dt class="text-muted-foreground">Game</dt><dd class="font-medium capitalize">{{ server.game }}</dd></div>
                <Separator />
                <div class="flex justify-between gap-3"><dt class="text-muted-foreground">Version</dt><dd class="font-medium text-right">{{ server.version }}</dd></div>
                <Separator />
                <div class="flex justify-between gap-3"><dt class="text-muted-foreground">Plan</dt><dd class="font-medium">{{ server.plan }}</dd></div>
                <Separator />
                <div class="flex justify-between gap-3"><dt class="text-muted-foreground">Region</dt><dd class="font-medium capitalize">{{ server.region.replace('-', ' ') }}</dd></div>
                <Separator />
                <div class="flex justify-between gap-3"><dt class="text-muted-foreground">Disk</dt><dd class="font-medium tabular-nums">{{ server.diskUsedGb }} / {{ server.diskGb }} GB</dd></div>
                <Separator />
                <div class="flex justify-between gap-3"><dt class="text-muted-foreground">Uptime</dt><dd class="font-medium tabular-nums">{{ server.uptimeHours }}h</dd></div>
                <Separator />
                <div class="flex justify-between gap-3"><dt class="text-muted-foreground">Renews</dt><dd class="font-medium">{{ server.expiresAt }}</dd></div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-base">Players online ({{ Math.min(players.length, livePlayersOnline) }})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul v-if="livePlayersOnline > 0" class="space-y-1">
                <motion.li
                  v-for="(p, i) in players.slice(0, livePlayersOnline)"
                  :key="p.uuid"
                  :initial="{ opacity: 0, x: -8 }"
                  :animate="{ opacity: 1, x: 0 }"
                  :transition="{ duration: 0.3, delay: 0.04 * i }"
                  class="flex items-center justify-between py-2"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <Avatar class="h-7 w-7">
                      <AvatarFallback class="text-[10px] bg-muted font-semibold">{{ p.username[0] }}</AvatarFallback>
                    </Avatar>
                    <div class="min-w-0">
                      <p class="text-sm font-medium truncate">{{ p.username }}</p>
                      <p class="text-[11px] text-muted-foreground">Joined {{ p.joinedAt }}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" class="font-mono tabular-nums text-[10px] shrink-0">{{ p.ping }} ms</Badge>
                </motion.li>
              </ul>
              <p v-else class="text-sm text-muted-foreground py-3 text-center">
                {{ status === 'online' ? 'No players online' : `Server is ${status}` }}
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="console" class="space-y-3">
        <Card class="overflow-hidden">
          <div
            ref="consoleEl"
            class="bg-zinc-950 text-zinc-100 p-3 sm:p-4 font-mono text-[11px] sm:text-xs h-[22rem] sm:h-[26rem] overflow-y-auto"
          >
            <div v-for="(line, i) in consoleLines" :key="i" class="leading-relaxed flex gap-2">
              <span class="text-zinc-500 select-none shrink-0">{{ line.timestamp }}</span>
              <span :class="{
                'text-amber-400': line.level === 'warn',
                'text-red-400': line.level === 'error',
                'text-emerald-400': line.level === 'system',
                'text-zinc-100': line.level === 'info',
              }" class="break-words min-w-0">{{ line.text }}</span>
            </div>
          </div>
        </Card>
        <form class="flex gap-2" @submit.prevent="sendCommand">
          <Input
            v-model="consoleInput"
            placeholder="say Hello, list, save-all…"
            class="flex-1 font-mono"
          />
          <Button type="submit" class="gap-1.5">
            <Send class="h-4 w-4" />
            <span class="hidden sm:inline">Send</span>
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="files">
        <Card class="overflow-hidden">
          <div class="px-4 sm:px-5 py-3 border-b text-xs sm:text-sm font-mono text-muted-foreground bg-muted/30">/var/server</div>
          <div class="divide-y">
            <template v-for="node in fileTree" :key="node.name">
              <div
                v-if="node.type === 'dir'"
                class="px-4 sm:px-5 py-2.5 flex items-center justify-between text-sm hover:bg-muted/50 cursor-pointer transition-colors gap-3"
                @click="toggleDir(node.name)"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <ChevronRight class="h-3.5 w-3.5 transition-transform text-muted-foreground shrink-0" :class="{ 'rotate-90': expandedDirs.has(node.name) }" />
                  <Folder class="h-4 w-4 text-amber-500 shrink-0" />
                  <span class="font-medium truncate">{{ node.name }}</span>
                </div>
                <span class="text-[11px] text-muted-foreground tabular-nums shrink-0">{{ node.modified }}</span>
              </div>
              <div v-else class="px-4 sm:px-5 py-2.5 flex items-center justify-between text-sm hover:bg-muted/50 transition-colors gap-3">
                <div class="flex items-center gap-2.5 ml-5 min-w-0">
                  <FileText class="h-4 w-4 text-muted-foreground shrink-0" />
                  <span class="truncate">{{ node.name }}</span>
                </div>
                <div class="flex items-center gap-2 sm:gap-4 text-[11px] text-muted-foreground shrink-0">
                  <span class="font-mono tabular-nums">{{ fmtSize(node.size) }}</span>
                  <span class="hidden sm:inline">{{ node.modified }}</span>
                </div>
              </div>
              <template v-if="node.type === 'dir' && expandedDirs.has(node.name) && node.children">
                <div
                  v-for="child in node.children"
                  :key="child.name"
                  class="px-4 sm:px-5 py-2 flex items-center justify-between text-sm hover:bg-muted/50 pl-10 sm:pl-12 transition-colors gap-3"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <Folder v-if="child.type === 'dir'" class="h-4 w-4 text-amber-500 shrink-0" />
                    <FileText v-else class="h-4 w-4 text-muted-foreground shrink-0" />
                    <span class="truncate">{{ child.name }}</span>
                  </div>
                  <div class="flex items-center gap-2 sm:gap-4 text-[11px] text-muted-foreground shrink-0">
                    <span class="font-mono tabular-nums">{{ fmtSize(child.size) }}</span>
                    <span class="hidden sm:inline">{{ child.modified }}</span>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="plugins" class="space-y-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input v-model="pluginSearch" placeholder="Search plugins…" class="pl-9" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            v-for="(p, i) in filteredPlugins"
            :key="p.id"
            :initial="{ opacity: 0, y: 6 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.25, delay: 0.03 * i }"
          >
            <Card class="hover:shadow-md transition-shadow">
              <CardContent class="p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-sm flex items-center gap-2 flex-wrap">
                      {{ p.name }}
                      <Badge variant="outline" class="font-normal text-[10px]">v{{ p.version }}</Badge>
                    </h4>
                    <p class="text-xs text-muted-foreground mt-1">{{ p.description }}</p>
                    <p class="text-[11px] text-muted-foreground/80 mt-2">
                      {{ p.author }} · {{ p.downloads.toLocaleString() }} downloads
                    </p>
                  </div>
                  <Switch
                    :model-value="installedPlugins.has(p.id)"
                    class="shrink-0"
                    @update:model-value="() => togglePlugin(p.id, p.name)"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </TabsContent>
    </Tabs>
  </div>

  <div v-else class="px-4 sm:px-6 lg:px-8 py-6">
    <Card>
      <CardContent class="py-16 text-center">
        <div class="text-5xl mb-3">🔍</div>
        <p class="font-medium">Server not found</p>
        <Button class="mt-4" @click="router.push({ name: 'servers' })">Back to servers</Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
