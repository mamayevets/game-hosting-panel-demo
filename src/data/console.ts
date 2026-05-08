import type { ConsoleLine, PlayerEntry, Plugin, FileNode } from '../types'

export const initialConsole: ConsoleLine[] = [
  { timestamp: '14:21:03', level: 'system', text: '[Sail] Starting Minecraft server (1.20.1 / Forge 47.3)' },
  { timestamp: '14:21:04', level: 'info', text: 'Loading 412 mods…' },
  { timestamp: '14:21:18', level: 'info', text: 'Done (14.2s)! For help, type "help"' },
  { timestamp: '14:21:18', level: 'info', text: 'Listening on 0.0.0.0:25565' },
  { timestamp: '14:23:42', level: 'info', text: 'CraftyKid joined the game' },
  { timestamp: '14:24:11', level: 'info', text: 'NerdyDad joined the game' },
  { timestamp: '14:31:55', level: 'warn', text: 'Can\'t keep up! Is the server overloaded? Running 1234ms behind' },
  { timestamp: '14:42:08', level: 'info', text: 'Saving the game (this may take a moment)' },
  { timestamp: '14:42:11', level: 'info', text: 'Saved the game' },
  { timestamp: '14:55:30', level: 'info', text: 'CraftyKid: anyone got cobalt?' },
  { timestamp: '14:55:48', level: 'info', text: 'NerdyDad: yeah, in the chest by the smeltery' },
  { timestamp: '15:02:14', level: 'info', text: 'Otherworlds joined the game' },
  { timestamp: '15:14:22', level: 'info', text: '<Otherworlds> hi everyone' },
  { timestamp: '15:18:01', level: 'info', text: 'Auto-saving world…' },
  { timestamp: '15:18:04', level: 'info', text: 'Auto-save done' },
]

export const players: PlayerEntry[] = [
  { uuid: 'a1b2c3d4', username: 'CraftyKid', joinedAt: '14:23:42', ping: 28 },
  { uuid: 'e5f6g7h8', username: 'NerdyDad', joinedAt: '14:24:11', ping: 41 },
  { uuid: 'i9j0k1l2', username: 'Otherworlds', joinedAt: '15:02:14', ping: 67 },
  { uuid: 'm3n4o5p6', username: 'BlockMaster42', joinedAt: '15:08:32', ping: 33 },
  { uuid: 'q7r8s9t0', username: 'PixelArcher', joinedAt: '15:14:55', ping: 88 },
  { uuid: 'u1v2w3x4', username: 'RedstoneQueen', joinedAt: '15:21:09', ping: 22 },
  { uuid: 'y5z6a7b8', username: 'NetherKnight', joinedAt: '15:38:41', ping: 51 },
]

export const plugins: Plugin[] = [
  { id: 'p_essentials', name: 'EssentialsX', description: 'Core commands and permissions', author: 'EssentialsX Team', version: '2.20.1', downloads: 8_400_000, installed: true },
  { id: 'p_worldedit', name: 'WorldEdit', description: 'In-game world editor', author: 'EngineHub', version: '7.3.0', downloads: 12_100_000, installed: true },
  { id: 'p_luckperms', name: 'LuckPerms', description: 'Permissions plugin', author: 'lucko', version: '5.4.115', downloads: 6_700_000, installed: true },
  { id: 'p_chestshop', name: 'ChestShop', description: 'Sign-based shop system', author: 'Acrobot', version: '4.0.1', downloads: 1_200_000, installed: false },
  { id: 'p_dynmap', name: 'Dynmap', description: 'Live web-based map of your world', author: 'webbukkit', version: '3.7-beta-9', downloads: 4_300_000, installed: false },
  { id: 'p_coreprotect', name: 'CoreProtect', description: 'Block logging / rollback', author: 'Intelli', version: '22.4', downloads: 5_900_000, installed: true },
  { id: 'p_vault', name: 'Vault', description: 'Permissions / chat / economy hook', author: 'creatorfromhell', version: '1.7.3', downloads: 9_800_000, installed: false },
  { id: 'p_griefprevention', name: 'GriefPrevention', description: 'Player land claims', author: 'RoboMWM', version: '17.0.0', downloads: 2_400_000, installed: false },
]

export const fileTree: FileNode[] = [
  {
    name: 'world',
    type: 'dir',
    modified: '2026-05-08 12:42',
    children: [
      { name: 'level.dat', type: 'file', size: 12_842, modified: '2026-05-08 12:42' },
      { name: 'session.lock', type: 'file', size: 24, modified: '2026-05-08 12:21' },
      {
        name: 'region',
        type: 'dir',
        modified: '2026-05-08 12:42',
        children: [
          { name: 'r.0.0.mca', type: 'file', size: 4_290_133, modified: '2026-05-08 12:42' },
          { name: 'r.0.1.mca', type: 'file', size: 3_812_096, modified: '2026-05-08 12:38' },
          { name: 'r.-1.0.mca', type: 'file', size: 2_145_280, modified: '2026-05-08 12:31' },
        ],
      },
    ],
  },
  {
    name: 'plugins',
    type: 'dir',
    modified: '2026-05-08 12:21',
    children: [
      { name: 'EssentialsX-2.20.1.jar', type: 'file', size: 2_891_402, modified: '2026-04-17 09:11' },
      { name: 'WorldEdit-7.3.0.jar', type: 'file', size: 4_125_902, modified: '2026-04-17 09:11' },
      { name: 'LuckPerms-5.4.115.jar', type: 'file', size: 1_954_111, modified: '2026-04-17 09:11' },
      { name: 'CoreProtect-22.4.jar', type: 'file', size: 1_412_028, modified: '2026-04-17 09:11' },
    ],
  },
  { name: 'server.properties', type: 'file', size: 1_182, modified: '2026-05-07 08:12' },
  { name: 'whitelist.json', type: 'file', size: 268, modified: '2026-05-06 21:33' },
  { name: 'ops.json', type: 'file', size: 142, modified: '2026-04-22 11:08' },
  { name: 'eula.txt', type: 'file', size: 220, modified: '2026-02-14 10:01' },
  { name: 'logs', type: 'dir', modified: '2026-05-08 12:42' },
  { name: 'mods', type: 'dir', modified: '2026-04-17 09:08' },
  { name: 'config', type: 'dir', modified: '2026-04-17 09:09' },
]
