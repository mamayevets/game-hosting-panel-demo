export type ActivityKind = 'server' | 'backup' | 'billing' | 'auth' | 'plugin'
export type ActivityStatus = 'success' | 'warning' | 'error' | 'info'

export interface ActivityEntry {
  id: string
  timestamp: string
  kind: ActivityKind
  status: ActivityStatus
  actor: string
  title: string
  detail?: string
  meta?: string
}

export const activity: ActivityEntry[] = [
  { id: 'a1', timestamp: '2026-05-08 16:04:12', kind: 'server', status: 'success', actor: 'demo@test.host', title: 'Restarted ATM10 Modded Realm', detail: 'Reason: scheduled mod sync · downtime 14s', meta: 'srv_atm10' },
  { id: 'a2', timestamp: '2026-05-08 15:48:01', kind: 'backup', status: 'success', actor: 'system', title: 'Snapshot completed for Wipe Wednesday — RUST', detail: '47.2 GB compressed to 9.1 GB · stored EU-Central', meta: 'srv_rust' },
  { id: 'a3', timestamp: '2026-05-08 14:22:33', kind: 'plugin', status: 'success', actor: 'demo@test.host', title: 'Installed CoreProtect 22.4', detail: 'On ATM10 Modded Realm · auto-restart skipped', meta: 'srv_atm10' },
  { id: 'a4', timestamp: '2026-05-08 13:10:18', kind: 'server', status: 'warning', actor: 'system', title: 'High CPU on Wipe Wednesday — RUST', detail: 'Sustained > 80% for 6m before settling', meta: 'srv_rust' },
  { id: 'a5', timestamp: '2026-05-08 11:02:00', kind: 'billing', status: 'info', actor: 'system', title: 'Renewal scheduled', detail: 'GLK-2026-00582 · $35.46 USD on 2026-06-01' },
  { id: 'a6', timestamp: '2026-05-08 09:14:40', kind: 'auth', status: 'info', actor: 'demo@test.host', title: 'Signed in', detail: 'Browser session · IP 88.99.12.45 · Kyiv' },
  { id: 'a7', timestamp: '2026-05-07 22:41:09', kind: 'server', status: 'error', actor: 'system', title: 'ARK Tribe Cluster crashed', detail: 'Out of memory on save thread · auto-recovered' },
  { id: 'a8', timestamp: '2026-05-07 20:00:00', kind: 'backup', status: 'success', actor: 'system', title: 'Daily backup window started' },
  { id: 'a9', timestamp: '2026-05-07 17:32:11', kind: 'server', status: 'success', actor: 'demo@test.host', title: 'Provisioned Palworld With The Boys', detail: 'Plan Double 6GB · region EU-Central · v0.3.4', meta: 'srv_palworld' },
  { id: 'a10', timestamp: '2026-05-07 14:18:27', kind: 'billing', status: 'success', actor: 'system', title: 'Card on file updated', detail: 'Visa ending in 4242 · expires 09/2028' },
  { id: 'a11', timestamp: '2026-05-06 18:22:50', kind: 'plugin', status: 'success', actor: 'demo@test.host', title: 'Uninstalled Vault 1.7.3', detail: 'No active dependents detected', meta: 'srv_atm10' },
  { id: 'a12', timestamp: '2026-05-06 09:00:00', kind: 'auth', status: 'success', actor: 'demo@test.host', title: 'API key rotated', detail: 'glk_live_a8f3k2…N4yZ now active' },
]

export interface BackupEntry {
  id: string
  serverId: string
  serverName: string
  game: 'minecraft' | 'rust' | 'ark' | 'palworld' | 'valheim' | 'cs2'
  startedAt: string
  durationSec: number
  sizeGb: number
  type: 'manual' | 'scheduled'
  status: 'completed' | 'in-progress' | 'failed'
}

export const backups: BackupEntry[] = [
  { id: 'b1', serverId: 'srv_rust', serverName: 'Wipe Wednesday — RUST', game: 'rust', startedAt: '2026-05-08 15:30:00', durationSec: 1080, sizeGb: 9.1, type: 'scheduled', status: 'completed' },
  { id: 'b2', serverId: 'srv_atm10', serverName: 'ATM10 Modded Realm', game: 'minecraft', startedAt: '2026-05-08 04:00:00', durationSec: 472, sizeGb: 4.2, type: 'scheduled', status: 'completed' },
  { id: 'b3', serverId: 'srv_valheim', serverName: 'Valheim Sailing Crew', game: 'valheim', startedAt: '2026-05-08 04:00:00', durationSec: 88, sizeGb: 1.1, type: 'scheduled', status: 'completed' },
  { id: 'b4', serverId: 'srv_cs2', serverName: 'CS2 Practice Server', game: 'cs2', startedAt: '2026-05-08 04:00:00', durationSec: 134, sizeGb: 2.6, type: 'scheduled', status: 'completed' },
  { id: 'b5', serverId: 'srv_ark', serverName: 'ARK Tribe Cluster', game: 'ark', startedAt: '2026-05-08 04:00:00', durationSec: 1782, sizeGb: 28.4, type: 'scheduled', status: 'completed' },
  { id: 'b6', serverId: 'srv_atm10', serverName: 'ATM10 Modded Realm', game: 'minecraft', startedAt: '2026-05-07 22:11:08', durationSec: 410, sizeGb: 4.1, type: 'manual', status: 'completed' },
  { id: 'b7', serverId: 'srv_palworld', serverName: 'Palworld With The Boys', game: 'palworld', startedAt: '2026-05-07 04:00:00', durationSec: 0, sizeGb: 0, type: 'scheduled', status: 'failed' },
  { id: 'b8', serverId: 'srv_rust', serverName: 'Wipe Wednesday — RUST', game: 'rust', startedAt: '2026-05-07 04:00:00', durationSec: 996, sizeGb: 8.8, type: 'scheduled', status: 'completed' },
]

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  summary: string
  group: string
}

export const apiEndpoints: ApiEndpoint[] = [
  { method: 'GET', path: '/v1/servers', summary: 'List every server in the workspace', group: 'Servers' },
  { method: 'POST', path: '/v1/servers', summary: 'Provision a new game server', group: 'Servers' },
  { method: 'GET', path: '/v1/servers/{id}', summary: 'Fetch a single server with current resources', group: 'Servers' },
  { method: 'PATCH', path: '/v1/servers/{id}', summary: 'Update plan, region, version, or whitelist', group: 'Servers' },
  { method: 'DELETE', path: '/v1/servers/{id}', summary: 'Decommission and free the IP slot', group: 'Servers' },
  { method: 'POST', path: '/v1/servers/{id}/start', summary: 'Boot the runtime', group: 'Lifecycle' },
  { method: 'POST', path: '/v1/servers/{id}/stop', summary: 'Graceful shutdown with autosave', group: 'Lifecycle' },
  { method: 'POST', path: '/v1/servers/{id}/restart', summary: 'Restart with same config', group: 'Lifecycle' },
  { method: 'POST', path: '/v1/servers/{id}/backups', summary: 'Trigger a manual backup snapshot', group: 'Backups' },
  { method: 'GET', path: '/v1/servers/{id}/backups', summary: 'List backups for a server', group: 'Backups' },
  { method: 'POST', path: '/v1/servers/{id}/backups/{bid}/restore', summary: 'Restore from snapshot (destructive)', group: 'Backups' },
  { method: 'GET', path: '/v1/servers/{id}/console', summary: 'Stream console output (websocket)', group: 'Realtime' },
  { method: 'POST', path: '/v1/servers/{id}/console', summary: 'Send a command to the running server', group: 'Realtime' },
  { method: 'GET', path: '/v1/billing/invoices', summary: 'List paid + pending invoices', group: 'Billing' },
  { method: 'GET', path: '/v1/billing/plans', summary: 'List published plans', group: 'Billing' },
]

export const faqs = [
  { q: 'How do I migrate an existing server here?', a: 'Open Quick Create → "Migrate from another host" and paste the SFTP credentials. World files transfer in the background while DNS propagates.' },
  { q: 'Are backups automatic?', a: 'Yes — every server takes a daily snapshot at 04:00 in its region. The last 7 dailies + 4 weeklies are retained. Manual snapshots do not count toward the limit.' },
  { q: 'What happens during a restart?', a: 'A graceful "save-all" runs, the runtime exits, and the supervisor brings it back. Total downtime is usually under 20 seconds and players are warned 30 seconds in advance.' },
  { q: 'How is uptime measured?', a: 'External probe pings TCP/UDP every 60 seconds. A miss only counts toward downtime if three consecutive probes fail and the runtime supervisor confirms the process is gone.' },
  { q: 'Can I run a custom build?', a: 'Yes. Upload a JAR / executable to /custom-build inside Files. Restart and the supervisor will use it instead of the default version. Reverting just deletes the file.' },
  { q: 'Where is my data stored?', a: 'Each region writes to redundant NVMe arrays in the same datacenter. EU customer data never leaves the EU; US customer data never leaves the US.' },
]
