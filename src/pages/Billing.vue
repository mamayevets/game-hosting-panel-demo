<script setup lang="ts">
import { invoices } from '@/data/invoices'
import { plans } from '@/data/plans'
import { servers } from '@/data/servers'
import { Download, CreditCard, CheckCircle2, Crown, MoreHorizontal, ArrowUpRight, Receipt, Calendar } from 'lucide-vue-next'
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
const playersPercent = computed(() => Math.round((usedPlayerSlots.value / totalPlayerSlots.value) * 100))

function downloadInvoice(num: string) {
  toast.success(`Downloaded ${num}`, { description: 'Generated as PDF in production.' })
}

function upgradeToPlan(name: string) {
  toast.info(`Upgrade to ${name}`, { description: 'Routes to Stripe checkout in production.' })
}

function notify(label: string, description?: string) {
  toast.message(label, description ? { description } : undefined)
}

const usageRows = computed(() => [
  { label: 'RAM', percent: planUsedPercent.value, sub: `${((planUsedPercent.value / 100) * planTotalGb.value).toFixed(1)} of ${planTotalGb.value} GB` },
  { label: 'Disk', percent: diskUsedPercent.value, sub: `${usedDiskGb.value.toFixed(1)} of ${totalDiskGb.value} GB` },
  { label: 'Player slots', percent: playersPercent.value, sub: `${usedPlayerSlots.value} of ${totalPlayerSlots.value} reserved` },
])
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Billing</h1>
      <p class="text-sm text-muted-foreground mt-1">Manage your subscription and invoices.</p>
    </motion.header>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.05 }">
      <Card>
        <CardHeader class="pb-3">
          <div class="flex items-center gap-2">
            <Badge class="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" /> Active
            </Badge>
            <span class="text-xs text-muted-foreground">Workspace plan</span>
          </div>
          <CardTitle class="text-2xl sm:text-3xl tabular-nums mt-2">${{ nextCharge.amount.toFixed(2) }}<span class="text-sm font-normal text-muted-foreground">/mo</span></CardTitle>
          <CardDescription class="text-xs">
            Renews {{ nextCharge.date }} · Visa · 4242
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" class="w-full sm:w-auto gap-1.5" @click="notify('Update payment', 'Routes to Stripe customer portal.')">
              <CreditCard class="h-3.5 w-3.5" /> Update card
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" class="w-full sm:w-auto gap-1.5">
                  Manage
                  <MoreHorizontal class="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-56">
                <DropdownMenuItem @click="notify('Pause subscription', 'Servers stay live for 14 days.')">Pause subscription</DropdownMenuItem>
                <DropdownMenuItem @click="notify('Switch to annual', 'Save 17% with annual billing.')">Switch to annual</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-destructive focus:text-destructive" @click="notify('Cancel subscription', 'All servers stop at end of billing period.')">Cancel subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.1 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Usage</CardTitle>
          <CardDescription class="text-xs">Across every server in this workspace.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-for="row in usageRows" :key="row.label">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium">{{ row.label }}</span>
              <span class="text-sm font-mono tabular-nums">{{ row.percent }}%</span>
            </div>
            <Progress :model-value="row.percent" class="h-1.5 mt-2" />
            <p class="text-xs text-muted-foreground mt-1.5">{{ row.sub }}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.15 }">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent class="p-4">
            <div class="flex items-center gap-2 mb-1.5">
              <Calendar class="h-3.5 w-3.5 text-muted-foreground" />
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Next</p>
            </div>
            <p class="text-lg sm:text-xl font-semibold tabular-nums">${{ nextCharge.amount.toFixed(2) }}</p>
            <p class="text-[11px] text-muted-foreground mt-0.5">{{ nextCharge.date }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="flex items-center gap-2 mb-1.5">
              <Receipt class="h-3.5 w-3.5 text-muted-foreground" />
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Lifetime</p>
            </div>
            <p class="text-lg sm:text-xl font-semibold tabular-nums">${{ totalSpent.toFixed(2) }}</p>
            <p class="text-[11px] text-muted-foreground mt-0.5">{{ invoices.length }} invoices</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.2 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Invoice history</CardTitle>
          <CardDescription class="text-xs">Auto-generated and emailed on each successful charge.</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
          <ul class="divide-y">
            <li v-for="inv in invoices" :key="inv.id" class="p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-medium">{{ inv.description }}</p>
                  <p class="text-[11px] text-muted-foreground font-mono mt-1">{{ inv.number }} · {{ inv.date }}</p>
                </div>
                <div class="flex flex-col items-end gap-1.5 shrink-0">
                  <span class="text-sm font-semibold tabular-nums">${{ inv.amount.toFixed(2) }}</span>
                  <Badge
                    variant="outline"
                    :class="{
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10': inv.status === 'paid',
                      'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10': inv.status === 'pending',
                      'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/10': inv.status === 'failed',
                    }"
                    class="capitalize text-[10px]"
                  >{{ inv.status }}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" class="h-7 px-2 mt-2 text-xs gap-1.5" @click="downloadInvoice(inv.number)">
                <Download class="h-3 w-3" /> Download PDF
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>

    <motion.section :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.25 }">
      <h2 class="text-base font-semibold mb-1">Available plans</h2>
      <p class="text-xs text-muted-foreground mb-3">Switch any time. Change applies to the next billing cycle.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card
          v-for="plan in plans"
          :key="plan.id"
          :class="plan.popular ? 'border-foreground/40 ring-1 ring-foreground/20' : ''"
        >
          <CardContent class="p-4">
            <div class="flex items-center justify-between gap-2 mb-2">
              <h3 class="font-semibold">{{ plan.name }}</h3>
              <Badge v-if="plan.popular" class="gap-1 bg-foreground text-background hover:bg-foreground border-transparent text-[10px]">
                <Crown class="h-3 w-3" /> Popular
              </Badge>
            </div>
            <div class="flex items-baseline gap-1 mb-1.5">
              <span class="text-xl font-bold tabular-nums">${{ plan.pricePerMonth }}</span>
              <span class="text-xs text-muted-foreground">/ mo</span>
            </div>
            <p class="text-[11px] text-muted-foreground tabular-nums mb-3">
              {{ plan.ramGb }} GB · {{ plan.cpuVcores }} vCPU · {{ plan.storageGb }} GB SSD
            </p>
            <Separator class="mb-3" />
            <ul class="space-y-1 text-[12px] text-muted-foreground mb-4">
              <li v-for="f in plan.features.slice(0, 4)" :key="f" class="flex items-start gap-1.5">
                <CheckCircle2 class="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                <span>{{ f }}</span>
              </li>
            </ul>
            <Button
              class="w-full gap-1.5 h-10"
              :variant="plan.popular ? 'default' : 'outline'"
              @click="upgradeToPlan(plan.name)"
            >
              Choose plan
              <ArrowUpRight class="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  </div>
</template>
