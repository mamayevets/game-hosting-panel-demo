<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { activity } from '@/data/activity'
import type { ActivityKind, ActivityStatus } from '@/data/activity'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Server, Database, CreditCard, ShieldCheck, Puzzle, Search, ChevronRight, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-vue-next'
import { motion } from 'motion-v'

const router = useRouter()
const search = ref('')
const kindFilter = ref<ActivityKind | 'all'>('all')

const filtered = computed(() => activity.filter((a) => {
  if (kindFilter.value !== 'all' && a.kind !== kindFilter.value) return false
  if (search.value && !`${a.title} ${a.detail ?? ''}`.toLowerCase().includes(search.value.toLowerCase())) return false
  return true
}))

const kindIcon: Record<ActivityKind, typeof Server> = {
  server: Server,
  backup: Database,
  billing: CreditCard,
  auth: ShieldCheck,
  plugin: Puzzle,
}

const statusIcon: Record<ActivityStatus, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
}

const statusClass: Record<ActivityStatus, string> = {
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-muted-foreground',
}

function openServer(serverId?: string) {
  if (!serverId) return
  router.push({ name: 'server-detail', params: { id: serverId } })
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
    <header>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Activity log</h1>
      <p class="text-sm text-muted-foreground mt-1">Audit trail of every action across servers, backups, billing, and access.</p>
    </header>

    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input v-model="search" placeholder="Search events…" class="pl-9" />
      </div>
      <Select v-model="kindFilter">
        <SelectTrigger class="sm:w-44">
          <SelectValue placeholder="All kinds" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All kinds</SelectItem>
          <SelectItem value="server">Server</SelectItem>
          <SelectItem value="backup">Backup</SelectItem>
          <SelectItem value="billing">Billing</SelectItem>
          <SelectItem value="auth">Auth</SelectItem>
          <SelectItem value="plugin">Plugin</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Card>
      <CardContent class="p-0">
        <ol class="divide-y">
          <motion.li
            v-for="(item, i) in filtered"
            :key="item.id"
            :initial="{ opacity: 0, x: -6 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.25, delay: 0.03 * i }"
            class="px-4 sm:px-5 py-4 flex items-start gap-3 hover:bg-muted/40 transition-colors"
            :class="item.meta ? 'cursor-pointer' : ''"
            @click="openServer(item.meta)"
          >
            <div class="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <component :is="kindIcon[item.kind]" class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3 flex-wrap">
                <p class="text-sm font-medium leading-snug">{{ item.title }}</p>
                <span class="text-[11px] text-muted-foreground font-mono whitespace-nowrap">
                  {{ item.timestamp }}
                </span>
              </div>
              <p v-if="item.detail" class="text-xs text-muted-foreground mt-0.5">{{ item.detail }}</p>
              <div class="flex items-center gap-2 mt-2">
                <Badge variant="outline" class="capitalize text-[10px] font-normal">{{ item.kind }}</Badge>
                <span class="flex items-center gap-1 text-[11px]" :class="statusClass[item.status]">
                  <component :is="statusIcon[item.status]" class="h-3 w-3" />
                  <span class="capitalize">{{ item.status }}</span>
                </span>
                <span class="text-[11px] text-muted-foreground">· {{ item.actor }}</span>
              </div>
            </div>
            <ChevronRight v-if="item.meta" class="h-4 w-4 text-muted-foreground/50 shrink-0 mt-1" />
          </motion.li>
        </ol>
        <p v-if="filtered.length === 0" class="text-center text-sm text-muted-foreground py-12">
          No matching events.
        </p>
      </CardContent>
    </Card>
  </div>
</template>
