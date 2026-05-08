<script setup lang="ts">
import { ref, computed } from 'vue'
import { servers } from '../data/servers'
import StatusBadge from '../components/StatusBadge.vue'
import GameIcon from '../components/GameIcon.vue'
import type { Game, ServerStatus } from '../types'
import { Search, Plus, Cpu, MemoryStick, Users, MapPin } from 'lucide-vue-next'

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

const games: Game[] = ['minecraft', 'rust', 'ark', 'palworld', 'valheim', 'cs2']
const gameLabel: Record<Game, string> = {
  minecraft: 'Minecraft',
  rust: 'RUST',
  ark: 'ARK',
  palworld: 'Palworld',
  valheim: 'Valheim',
  cs2: 'CS2',
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <header class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold">Your servers</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ servers.length }} servers · {{ onlineCount }} online · {{ totalPlayers }} players right now
        </p>
      </div>
      <button class="btn-primary flex items-center gap-1.5">
        <Plus class="h-4 w-4" /> New server
      </button>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="card p-4">
        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Servers online</p>
        <p class="text-2xl font-bold mt-1">{{ onlineCount }} / {{ servers.length }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Total RAM</p>
        <p class="text-2xl font-bold mt-1">{{ totalRam }} GB</p>
      </div>
      <div class="card p-4">
        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Players online</p>
        <p class="text-2xl font-bold mt-1">{{ totalPlayers }}</p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search servers…"
          class="input pl-9"
        />
      </div>
      <select v-model="gameFilter" class="input sm:w-44">
        <option value="all">All games</option>
        <option v-for="g in games" :key="g" :value="g">{{ gameLabel[g] }}</option>
      </select>
      <select v-model="statusFilter" class="input sm:w-44">
        <option value="all">All statuses</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
        <option value="starting">Starting</option>
      </select>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <RouterLink
        v-for="server in filtered"
        :key="server.id"
        :to="{ name: 'server-detail', params: { id: server.id } }"
        class="card p-5 hover:shadow-lg hover:border-brand-500/50 dark:hover:border-brand-500/50 transition group cursor-pointer"
      >
        <div class="flex items-start gap-4">
          <GameIcon :game="server.game" size="lg" />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="font-semibold truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">{{ server.name }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{{ server.ipAddress }}:{{ server.port }}</p>
              </div>
              <StatusBadge :status="server.status" />
            </div>

            <div class="grid grid-cols-2 gap-3 mt-4">
              <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Cpu class="h-3.5 w-3.5" />
                <span>{{ server.cpuPercent }}% CPU</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MemoryStick class="h-3.5 w-3.5" />
                <span>{{ server.ramUsedPercent }}% of {{ server.ramGb }}GB</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Users class="h-3.5 w-3.5" />
                <span>{{ server.playersOnline }} / {{ server.playersMax }} players</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin class="h-3.5 w-3.5" />
                <span>{{ server.region }}</span>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span class="text-slate-500 dark:text-slate-400">{{ server.plan }} · {{ server.version }}</span>
              <span class="text-brand-600 dark:text-brand-400 font-medium group-hover:translate-x-0.5 transition">Manage →</span>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <div v-if="filtered.length === 0" class="card p-16 text-center mt-6">
      <p class="text-slate-400 text-5xl mb-3">📭</p>
      <p class="text-slate-600 dark:text-slate-400 font-medium">No servers match your filters</p>
    </div>
  </div>
</template>
