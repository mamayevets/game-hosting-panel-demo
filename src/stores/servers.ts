import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servers as seed } from '@/data/servers'
import type { Server, Game, Region, ServerStatus } from '@/types'

export interface NewServerInput {
  name: string
  game: Game
  plan: string
  region: Region
}

const PLAN_DEFAULTS: Record<string, { ramGb: number; diskGb: number; playersMax: number }> = {
  'Double 6GB': { ramGb: 6, diskGb: 50, playersMax: 10 },
  'Quadro 8GB': { ramGb: 8, diskGb: 75, playersMax: 20 },
  'Ultra 12GB': { ramGb: 12, diskGb: 100, playersMax: 50 },
  'Pro 16GB': { ramGb: 16, diskGb: 200, playersMax: 100 },
}

const VERSION_DEFAULTS: Record<Game, string> = {
  minecraft: '1.20.1 Vanilla',
  rust: 'Vanilla',
  ark: 'Ascended',
  palworld: 'v0.3.4',
  valheim: '0.218.21',
  cs2: 'CS2 Build 11071',
}

const PORT_DEFAULTS: Record<Game, number> = {
  minecraft: 25565,
  rust: 28015,
  ark: 7777,
  palworld: 8211,
  valheim: 2456,
  cs2: 27015,
}

function nextIp() {
  return `10.${(Math.random() * 200 | 0) + 20}.${(Math.random() * 200 | 0) + 20}.${(Math.random() * 200 | 0) + 20}`
}

export const useServersStore = defineStore('servers', () => {
  const list = ref<Server[]>([...seed])

  function addServer(input: NewServerInput): Server {
    const plan = PLAN_DEFAULTS[input.plan] ?? { ramGb: 8, diskGb: 75, playersMax: 20 }
    const today = new Date()
    const expires = new Date(today)
    expires.setMonth(today.getMonth() + 1)

    const server: Server = {
      id: `srv_${Math.random().toString(36).slice(2, 8)}`,
      name: input.name.trim(),
      game: input.game,
      status: 'starting' satisfies ServerStatus,
      region: input.region,
      plan: input.plan,
      ramGb: plan.ramGb,
      ramUsedPercent: 0,
      cpuPercent: 0,
      diskGb: plan.diskGb,
      diskUsedGb: 0,
      playersOnline: 0,
      playersMax: plan.playersMax,
      uptimeHours: 0,
      ipAddress: nextIp(),
      port: PORT_DEFAULTS[input.game],
      version: VERSION_DEFAULTS[input.game],
      createdAt: today.toISOString().slice(0, 10),
      expiresAt: expires.toISOString().slice(0, 10),
    }

    list.value = [server, ...list.value]

    setTimeout(() => {
      const i = list.value.findIndex((s) => s.id === server.id)
      if (i !== -1) {
        list.value = [
          ...list.value.slice(0, i),
          { ...list.value[i], status: 'online', cpuPercent: 12, ramUsedPercent: 28, playersOnline: 0, uptimeHours: 0 },
          ...list.value.slice(i + 1),
        ]
      }
    }, 4000)

    return server
  }

  return { list, addServer }
})
