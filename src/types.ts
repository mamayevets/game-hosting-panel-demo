export type Game = 'minecraft' | 'ark' | 'rust' | 'palworld' | 'valheim' | 'cs2'

export type ServerStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'restarting'

export type Region = 'eu-west' | 'eu-central' | 'us-east' | 'us-west' | 'asia-singapore'

export interface Server {
  id: string
  name: string
  game: Game
  status: ServerStatus
  region: Region
  plan: string
  ramGb: number
  ramUsedPercent: number
  cpuPercent: number
  diskGb: number
  diskUsedGb: number
  playersOnline: number
  playersMax: number
  uptimeHours: number
  ipAddress: string
  port: number
  version: string
  createdAt: string
  expiresAt: string
}

export interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  currency: 'USD' | 'EUR'
  status: 'paid' | 'pending' | 'failed'
  description: string
  pdfUrl: string
}

export interface Plan {
  id: string
  name: string
  game: Game
  ramGb: number
  cpuVcores: number
  storageGb: number
  pricePerMonth: number
  features: string[]
  popular?: boolean
}

export interface ConsoleLine {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'system'
  text: string
}

export interface PlayerEntry {
  uuid: string
  username: string
  joinedAt: string
  ping: number
}

export interface Plugin {
  id: string
  name: string
  description: string
  author: string
  version: string
  downloads: number
  installed: boolean
}

export interface FileNode {
  name: string
  type: 'file' | 'dir'
  size?: number
  modified: string
  children?: FileNode[]
}
