<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { servers } from '../data/servers'
import { initialConsole, players, plugins as pluginCatalog, fileTree } from '../data/console'
import StatusBadge from '../components/StatusBadge.vue'
import GameIcon from '../components/GameIcon.vue'
import ResourceChart from '../components/ResourceChart.vue'
import {
  Play, Square, RotateCw, Save, Activity, Terminal, FolderOpen, Puzzle,
  ArrowLeft, Folder, FileText, ChevronRight,
  Copy, Wifi,
} from 'lucide-vue-next'
import type { ConsoleLine } from '../types'

const route = useRoute()
const router = useRouter()
const server = computed(() => servers.find((s) => s.id === route.params.id))

const tabs = ['overview', 'console', 'files', 'plugins'] as const
type Tab = typeof tabs[number]
const activeTab = ref<Tab>('overview')

// Resource history (rolling 30 seconds, mock streaming)
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
  if (!server.value || server.value.status !== 'online') return
  cpuHistory.value = [...cpuHistory.value.slice(1), Math.max(0, Math.min(100, Math.round(server.value.cpuPercent + (Math.random() - 0.5) * 18)))]
  ramHistory.value = [...ramHistory.value.slice(1), Math.max(0, Math.min(100, Math.round(server.value.ramUsedPercent + (Math.random() - 0.5) * 6)))]
  playerHistory.value = [...playerHistory.value.slice(1), server.value.playersOnline + (Math.random() > 0.85 ? 1 : 0)]
}

// Console
const consoleLines = ref<ConsoleLine[]>(initialConsole.slice())
const consoleInput = ref('')
const consoleEl = ref<HTMLElement | null>(null)

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
    'Listening on 0.0.0.0:25565',
    'CraftyKid: dinner break, brb',
    'CraftyKid left the game',
    'BlockMaster42: nice base!',
    'Auto-saving world…',
  ]
  const text = samples[Math.floor(Math.random() * samples.length)]
  const now = new Date()
  const ts = now.toTimeString().slice(0, 8)
  pushLine({ timestamp: ts, level: 'info', text })
}

function sendCommand() {
  if (!consoleInput.value.trim()) return
  const ts = new Date().toTimeString().slice(0, 8)
  pushLine({ timestamp: ts, level: 'system', text: `> ${consoleInput.value}` })
  setTimeout(() => {
    pushLine({ timestamp: ts, level: 'info', text: `Command "${consoleInput.value}" executed (mock)` })
  }, 200)
  consoleInput.value = ''
}

onMounted(() => {
  if (!server.value) return
  timer = window.setInterval(() => {
    tick()
    if (Math.random() > 0.5 && server.value?.status === 'online') streamRandomLine()
  }, 2500)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

// Files
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

// Plugins
const pluginSearch = ref('')
const installedPlugins = ref(new Set(pluginCatalog.filter((p) => p.installed).map((p) => p.id)))
const filteredPlugins = computed(() =>
  pluginCatalog.filter((p) =>
    !pluginSearch.value || p.name.toLowerCase().includes(pluginSearch.value.toLowerCase()),
  ),
)
function togglePlugin(id: string) {
  if (installedPlugins.value.has(id)) installedPlugins.value.delete(id)
  else installedPlugins.value.add(id)
}

function action(label: string) {
  alert(`${label} (mock — connect to real API in production)`)
}

function copyAddress() {
  if (!server.value) return
  navigator.clipboard.writeText(`${server.value.ipAddress}:${server.value.port}`)
}
</script>

<template>
  <div v-if="server" class="p-8 max-w-7xl mx-auto">
    <button
      @click="router.push({ name: 'servers' })"
      class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 mb-4 transition"
    >
      <ArrowLeft class="h-4 w-4" /> All servers
    </button>

    <header class="card p-6 mb-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-start gap-4">
          <GameIcon :game="server.game" size="lg" />
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold">{{ server.name }}</h1>
              <StatusBadge :status="server.status" />
            </div>
            <div class="flex items-center gap-3 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              <span class="font-mono">{{ server.ipAddress }}:{{ server.port }}</span>
              <button @click="copyAddress" class="hover:text-slate-900 dark:hover:text-slate-100" title="Copy">
                <Copy class="h-3.5 w-3.5" />
              </button>
              <span>·</span>
              <span>{{ server.region }}</span>
              <span>·</span>
              <span>{{ server.version }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="action('Restart')" class="btn-secondary flex items-center gap-1.5">
            <RotateCw class="h-4 w-4" /> Restart
          </button>
          <button v-if="server.status === 'online'" @click="action('Stop')" class="btn-danger flex items-center gap-1.5">
            <Square class="h-4 w-4" /> Stop
          </button>
          <button v-else @click="action('Start')" class="btn-primary flex items-center gap-1.5">
            <Play class="h-4 w-4" /> Start
          </button>
          <button @click="action('Backup')" class="btn-secondary flex items-center gap-1.5">
            <Save class="h-4 w-4" /> Backup
          </button>
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <div class="border-b border-slate-200 dark:border-slate-800 mb-6">
      <div class="flex gap-1">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition capitalize"
          :class="activeTab === tab
            ? 'border-brand-600 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'"
        >
          <Activity v-if="tab === 'overview'" class="h-4 w-4" />
          <Terminal v-if="tab === 'console'" class="h-4 w-4" />
          <FolderOpen v-if="tab === 'files'" class="h-4 w-4" />
          <Puzzle v-if="tab === 'plugins'" class="h-4 w-4" />
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Overview tab -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">CPU</p>
            <p class="text-lg font-bold">{{ cpuHistory[cpuHistory.length - 1] }}%</p>
          </div>
          <ResourceChart label="CPU" :values="cpuHistory" color="#6366f1" unit="%" />
        </div>
        <div class="card p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">RAM ({{ server.ramGb }} GB)</p>
            <p class="text-lg font-bold">{{ ramHistory[ramHistory.length - 1] }}%</p>
          </div>
          <ResourceChart label="RAM" :values="ramHistory" color="#10b981" unit="%" />
        </div>
        <div class="card p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Players</p>
            <p class="text-lg font-bold">{{ playerHistory[playerHistory.length - 1] }} / {{ server.playersMax }}</p>
          </div>
          <ResourceChart label="Players" :values="playerHistory" color="#f59e0b" :max="server.playersMax" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6">
          <h3 class="font-semibold mb-4 flex items-center gap-2"><Wifi class="h-4 w-4 text-brand-600" /> Connection</h3>
          <dl class="text-sm space-y-2">
            <div class="flex justify-between"><dt class="text-slate-500">Game</dt><dd class="font-medium capitalize">{{ server.game }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Version</dt><dd class="font-medium">{{ server.version }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Plan</dt><dd class="font-medium">{{ server.plan }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Region</dt><dd class="font-medium">{{ server.region }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Disk usage</dt><dd class="font-medium">{{ server.diskUsedGb }} / {{ server.diskGb }} GB</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Uptime</dt><dd class="font-medium">{{ server.uptimeHours }}h</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Created</dt><dd class="font-medium">{{ server.createdAt }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Renews</dt><dd class="font-medium">{{ server.expiresAt }}</dd></div>
          </dl>
        </div>

        <div class="card p-6">
          <h3 class="font-semibold mb-4">Players online ({{ Math.min(players.length, server.playersOnline) }})</h3>
          <ul class="space-y-2 text-sm">
            <li
              v-for="p in players.slice(0, server.playersOnline)"
              :key="p.uuid"
              class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div class="flex items-center gap-2.5">
                <div class="h-7 w-7 rounded bg-slate-200 dark:bg-slate-700 grid place-items-center text-xs font-medium">{{ p.username[0] }}</div>
                <div>
                  <p class="font-medium">{{ p.username }}</p>
                  <p class="text-xs text-slate-500">Joined {{ p.joinedAt }}</p>
                </div>
              </div>
              <span class="text-xs text-slate-500 font-mono">{{ p.ping }} ms</span>
            </li>
            <li v-if="server.playersOnline === 0" class="text-sm text-slate-400 py-3 text-center">No players online</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Console tab -->
    <div v-if="activeTab === 'console'" class="space-y-3">
      <div
        ref="consoleEl"
        class="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs h-96 overflow-y-auto border border-slate-800"
      >
        <div v-for="(line, i) in consoleLines" :key="i" class="leading-relaxed">
          <span class="text-slate-500 mr-2">{{ line.timestamp }}</span>
          <span :class="{
            'text-amber-400': line.level === 'warn',
            'text-red-400': line.level === 'error',
            'text-emerald-400': line.level === 'system',
          }">{{ line.text }}</span>
        </div>
      </div>
      <form @submit.prevent="sendCommand" class="flex gap-2">
        <input
          v-model="consoleInput"
          placeholder="Enter a command (try: say Hello, list, save-all)…"
          class="input flex-1 font-mono"
        />
        <button type="submit" class="btn-primary">Send</button>
      </form>
    </div>

    <!-- Files tab -->
    <div v-if="activeTab === 'files'" class="card overflow-hidden">
      <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-500">/var/server</div>
      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <template v-for="node in fileTree" :key="node.name">
          <div
            v-if="node.type === 'dir'"
            class="px-5 py-2.5 flex items-center justify-between text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            @click="toggleDir(node.name)"
          >
            <div class="flex items-center gap-2.5">
              <ChevronRight class="h-3.5 w-3.5 transition" :class="{ 'rotate-90': expandedDirs.has(node.name) }" />
              <Folder class="h-4 w-4 text-amber-500" />
              <span class="font-medium">{{ node.name }}</span>
            </div>
            <span class="text-xs text-slate-400">{{ node.modified }}</span>
          </div>
          <div v-else class="px-5 py-2.5 flex items-center justify-between text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
            <div class="flex items-center gap-2.5 ml-5">
              <FileText class="h-4 w-4 text-slate-400" />
              <span>{{ node.name }}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-slate-400">
              <span class="font-mono">{{ fmtSize(node.size) }}</span>
              <span>{{ node.modified }}</span>
            </div>
          </div>
          <template v-if="node.type === 'dir' && expandedDirs.has(node.name) && node.children">
            <div
              v-for="child in node.children"
              :key="child.name"
              class="px-5 py-2 flex items-center justify-between text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 pl-12"
            >
              <div class="flex items-center gap-2.5">
                <Folder v-if="child.type === 'dir'" class="h-4 w-4 text-amber-500" />
                <FileText v-else class="h-4 w-4 text-slate-400" />
                <span>{{ child.name }}</span>
              </div>
              <div class="flex items-center gap-4 text-xs text-slate-400">
                <span class="font-mono">{{ fmtSize(child.size) }}</span>
                <span>{{ child.modified }}</span>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Plugins tab -->
    <div v-if="activeTab === 'plugins'" class="space-y-4">
      <input v-model="pluginSearch" placeholder="Search plugins…" class="input" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="p in filteredPlugins" :key="p.id" class="card p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold">{{ p.name }} <span class="text-xs text-slate-400 font-normal">v{{ p.version }}</span></h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ p.description }}</p>
              <div class="text-xs text-slate-400 mt-2">
                {{ p.author }} · {{ p.downloads.toLocaleString() }} downloads
              </div>
            </div>
            <button
              @click="togglePlugin(p.id)"
              class="text-xs font-medium px-3 py-1.5 rounded-md transition shrink-0"
              :class="installedPlugins.has(p.id)
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-red-500/10 hover:text-red-600 hover:dark:text-red-400'
                : 'bg-brand-600 text-white hover:bg-brand-700'"
            >
              {{ installedPlugins.has(p.id) ? 'Installed' : 'Install' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-8">
    <div class="card p-16 text-center">
      <p class="text-slate-400 text-5xl mb-3">🔍</p>
      <p class="text-slate-600 dark:text-slate-400 font-medium">Server not found</p>
      <button @click="router.push({ name: 'servers' })" class="btn-primary mt-4">Back to servers</button>
    </div>
  </div>
</template>
