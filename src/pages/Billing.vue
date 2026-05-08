<script setup lang="ts">
import { invoices } from '@/data/invoices'
import { plans } from '@/data/plans'
import { servers } from '@/data/servers'
import {
  Download, CreditCard, CheckCircle2, Crown, ArrowUpRight,
  Calendar, Receipt, Wallet, MoreHorizontal,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const totalSpent = computed(() => invoices.reduce((sum, i) => sum + i.amount, 0))
const nextCharge = { amount: 35.46, date: '2026-06-01' }
const planTotalGb = computed(() => servers.reduce((s, srv) => s + srv.ramGb, 0))
const planUsedPercent = computed(() => {
  const used = servers.reduce((s, srv) => s + (srv.ramGb * srv.ramUsedPercent) / 100, 0)
  return Math.round((used / planTotalGb.value) * 100)
})
const totalDiskGb = computed(() => servers.reduce((s, srv) => s + srv.diskGb, 0))
const usedDiskGb = computed(() => servers.reduce((s, srv) => s + srv.diskUsedGb, 0))
const diskUsedPercent = computed(() => Math.round((usedDiskGb.value / totalDiskGb.value) * 100))
const totalPlayerSlots = computed(() => servers.reduce((s, srv) => s + srv.playersMax, 0))
const usedPlayerSlots = computed(() => servers.reduce((s, srv) => s + srv.playersOnline, 0))

const filterYear = ref<'all' | '2026' | '2025'>('all')
const filteredInvoices = computed(() => {
  if (filterYear.value === 'all') return invoices
  return invoices.filter((i) => i.date.startsWith(filterYear.value))
})

function downloadInvoice(num: string) {
  toast.success(`Downloaded ${num}`, { description: 'Generated as PDF in production.' })
}

function upgradeToPlan(name: string) {
  toast.info(`Upgrade to ${name}`, { description: 'Routes to Stripe checkout in production.' })
}

function notify(label: string, description?: string) {
  toast.message(label, description ? { description } : undefined)
}
</script>

<template>
  <div class="px-3 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6 min-w-0">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
      class="min-w-0"
    >
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Billing</h1>
      <p class="text-sm text-muted-foreground mt-1 break-words">Manage your subscription and invoices.</p>
    </motion.header>

    <motion.div
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.05 }"
    >
      <Card class="overflow-hidden border-border/60">
        <CardContent class="p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 min-w-0">
            <div class="space-y-1.5 min-w-0 w-full sm:w-auto">
              <div class="flex items-center gap-2 flex-wrap">
                <Badge class="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" /> Active
                </Badge>
                <span class="text-xs text-muted-foreground break-words">Workspace plan · 5 servers · monthly</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">${{ nextCharge.amount.toFixed(2) }}<span class="text-sm sm:text-base font-normal text-muted-foreground">/mo</span></h2>
              <p class="text-xs text-muted-foreground break-words">
                Renews <span class="font-medium text-foreground">{{ nextCharge.date }}</span> · Visa · 4242
              </p>
            </div>
            <div class="grid grid-cols-2 sm:flex gap-2 sm:shrink-0 w-full sm:w-auto">
              <Button variant="outline" size="sm" class="gap-1.5 w-full sm:w-auto min-w-0" @click="notify('Update payment', 'Routes to Stripe customer portal.')">
                <CreditCard class="h-3.5 w-3.5 shrink-0" />
                <span class="truncate">Update card</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" size="sm" class="gap-1.5 w-full sm:w-auto min-w-0">
                    <span class="truncate">Manage</span>
                    <MoreHorizontal class="h-3.5 w-3.5 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-44">
                  <DropdownMenuItem @click="notify('Pause subscription', 'Servers stay live for 14 days.')">Pause subscription</DropdownMenuItem>
                  <DropdownMenuItem @click="notify('Switch to annual', 'Save 17% with annual billing.')">Switch to annual</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive focus:text-destructive" @click="notify('Cancel subscription', 'All servers stop at end of billing period.')">Cancel subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator class="my-5" />

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 min-w-0">
            <div class="min-w-0">
              <div class="flex items-center justify-between gap-2 text-xs mb-1.5">
                <span class="text-muted-foreground font-medium truncate">RAM</span>
                <span class="tabular-nums font-mono shrink-0">{{ planUsedPercent }}%</span>
              </div>
              <Progress :model-value="planUsedPercent" class="h-1.5" />
              <p class="text-[11px] text-muted-foreground mt-1.5 tabular-nums truncate">
                {{ ((planUsedPercent / 100) * planTotalGb).toFixed(1) }} / {{ planTotalGb }} GB
              </p>
            </div>
            <div class="min-w-0">
              <div class="flex items-center justify-between gap-2 text-xs mb-1.5">
                <span class="text-muted-foreground font-medium truncate">Disk</span>
                <span class="tabular-nums font-mono shrink-0">{{ diskUsedPercent }}%</span>
              </div>
              <Progress :model-value="diskUsedPercent" class="h-1.5" />
              <p class="text-[11px] text-muted-foreground mt-1.5 tabular-nums truncate">
                {{ usedDiskGb.toFixed(1) }} / {{ totalDiskGb }} GB
              </p>
            </div>
            <div class="min-w-0">
              <div class="flex items-center justify-between gap-2 text-xs mb-1.5">
                <span class="text-muted-foreground font-medium truncate">Players</span>
                <span class="tabular-nums font-mono shrink-0">{{ usedPlayerSlots }}/{{ totalPlayerSlots }}</span>
              </div>
              <Progress :model-value="(usedPlayerSlots / totalPlayerSlots) * 100" class="h-1.5" />
              <p class="text-[11px] text-muted-foreground mt-1.5 truncate">Across all servers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <motion.div
        v-for="(stat, i) in [
          { label: 'Next charge', value: `$${nextCharge.amount.toFixed(2)}`, sub: `on ${nextCharge.date}`, icon: Calendar },
          { label: 'Lifetime spent', value: `$${totalSpent.toFixed(2)}`, sub: `${invoices.length} invoices`, icon: Receipt },
          { label: 'Payment method', value: 'Visa · 4242', sub: 'Expires 09 / 2028', icon: Wallet },
        ]"
        :key="stat.label"
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, delay: 0.1 + 0.04 * i }"
      >
        <Card>
          <CardContent class="p-4 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{{ stat.label }}</p>
              <p class="text-lg sm:text-xl font-semibold mt-1.5 tabular-nums truncate">{{ stat.value }}</p>
              <p class="text-[11px] text-muted-foreground mt-0.5 truncate">{{ stat.sub }}</p>
            </div>
            <div class="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle class="text-base">Invoice history</CardTitle>
          <CardDescription class="text-xs mt-0.5">Auto-generated and emailed on each successful charge.</CardDescription>
        </div>
        <Button variant="outline" size="sm" class="text-xs h-8 hidden sm:inline-flex" @click="notify('Export CSV', 'All invoices in date range.')">Export</Button>
      </CardHeader>
      <CardContent class="p-0">
        <ul class="divide-y sm:hidden">
          <li v-for="inv in filteredInvoices" :key="inv.id" class="px-4 py-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-medium truncate">{{ inv.description }}</p>
              <p class="text-[11px] text-muted-foreground font-mono mt-0.5">{{ inv.number }} · {{ inv.date }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-sm font-semibold tabular-nums">${{ inv.amount.toFixed(2) }}</span>
              <Button variant="ghost" size="icon" class="h-7 w-7" @click="downloadInvoice(inv.number)">
                <Download class="h-3.5 w-3.5" />
              </Button>
            </div>
          </li>
          <li v-if="filteredInvoices.length === 0" class="text-center text-sm text-muted-foreground py-8">
            No invoices.
          </li>
        </ul>

        <div class="hidden sm:block overflow-x-auto">
          <Table class="min-w-[640px]">
            <TableHeader class="bg-muted/40">
              <TableRow class="hover:bg-transparent">
                <TableHead>Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead class="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="inv in filteredInvoices" :key="inv.id" class="group">
                <TableCell class="font-mono text-xs">{{ inv.number }}</TableCell>
                <TableCell class="text-muted-foreground">{{ inv.date }}</TableCell>
                <TableCell>{{ inv.description }}</TableCell>
                <TableCell class="font-medium text-right tabular-nums">${{ inv.amount.toFixed(2) }}</TableCell>
                <TableCell>
                  <Badge
                    :class="{
                      'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20': inv.status === 'paid',
                      'bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-amber-500/20': inv.status === 'pending',
                      'bg-red-500/10 text-red-500 hover:bg-red-500/10 border-red-500/20': inv.status === 'failed',
                    }"
                    class="capitalize"
                    variant="outline"
                  >{{ inv.status }}</Badge>
                </TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="icon" class="h-8 w-8 opacity-0 group-hover:opacity-100 transition" @click="downloadInvoice(inv.number)">
                    <Download class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <section>
      <div class="flex items-end justify-between mb-3">
        <div>
          <h2 class="text-base font-semibold">Available plans</h2>
          <p class="text-xs text-muted-foreground mt-0.5">Switch any time. Change applies to the next billing cycle.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div
          v-for="(plan, i) in plans"
          :key="plan.id"
          :initial="{ opacity: 0, y: 8 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.04 * i }"
          class="relative"
        >
          <Card
            class="h-full flex flex-col"
            :class="plan.popular ? 'border-foreground/40 ring-1 ring-foreground/20' : ''"
          >
            <CardContent class="p-5 flex-1 flex flex-col">
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-semibold">{{ plan.name }}</h3>
                <Badge v-if="plan.popular" class="gap-1 bg-foreground text-background hover:bg-foreground border-transparent">
                  <Crown class="h-3 w-3" /> Popular
                </Badge>
              </div>
              <div class="mt-3 mb-4 flex items-baseline gap-1">
                <span class="text-2xl font-bold tabular-nums">${{ plan.pricePerMonth }}</span>
                <span class="text-xs text-muted-foreground">/ mo</span>
              </div>
              <p class="text-[11px] text-muted-foreground tabular-nums">
                {{ plan.ramGb }} GB · {{ plan.cpuVcores }} vCPU · {{ plan.storageGb }} GB SSD
              </p>
              <Separator class="my-4" />
              <ul class="space-y-1.5 text-[13px] flex-1 mb-4">
                <li v-for="f in plan.features.slice(0, 5)" :key="f" class="flex items-start gap-1.5">
                  <CheckCircle2 class="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span class="text-muted-foreground">{{ f }}</span>
                </li>
              </ul>
              <Button
                class="w-full gap-1.5"
                size="sm"
                :variant="plan.popular ? 'default' : 'outline'"
                @click="upgradeToPlan(plan.name)"
              >
                Choose plan
                <ArrowUpRight class="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  </div>
</template>
