<script setup lang="ts">
import { invoices } from '@/data/invoices'
import { plans } from '@/data/plans'
import { Download, CreditCard, CheckCircle2, Crown } from 'lucide-vue-next'
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const totalSpent = computed(() => invoices.reduce((sum, i) => sum + i.amount, 0))
const nextCharge = { amount: 35.46, date: '2026-06-01' }

function statusVariant(status: 'paid' | 'pending' | 'failed') {
  return status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'destructive'
}

function downloadInvoice() {
  toast.success('Invoice downloaded', { description: 'Generated as PDF in production.' })
}

function upgradeToPlan(name: string) {
  toast.info(`Upgrade to ${name}`, { description: 'Routes to Stripe checkout in production.' })
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
      class="mb-8"
    >
      <h1 class="text-2xl font-bold tracking-tight">Billing</h1>
      <p class="text-sm text-muted-foreground mt-1">Manage subscriptions, invoices, and payment methods</p>
    </motion.header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent class="p-5">
          <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Active subscription</p>
          <p class="text-2xl font-bold mt-1.5 tabular-nums">$35.46<span class="text-sm font-normal text-muted-foreground">/mo</span></p>
          <p class="text-xs text-muted-foreground mt-1">5 servers across all plans</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Next charge</p>
          <p class="text-2xl font-bold mt-1.5 tabular-nums">${{ nextCharge.amount }}</p>
          <p class="text-xs text-muted-foreground mt-1">on {{ nextCharge.date }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Lifetime spent</p>
          <p class="text-2xl font-bold mt-1.5 tabular-nums">${{ totalSpent.toFixed(2) }}</p>
          <p class="text-xs text-muted-foreground mt-1">across {{ invoices.length }} invoices</p>
        </CardContent>
      </Card>
    </div>

    <Card class="mb-8">
      <CardHeader class="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle class="text-base">Payment method</CardTitle>
        <Button variant="outline" size="sm">Update card</Button>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-3 p-4 bg-muted/40 rounded-lg border">
          <div class="h-10 w-14 rounded-md bg-foreground flex items-center justify-center">
            <CreditCard class="h-5 w-5 text-background" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">Visa ending in 4242</p>
            <p class="text-xs text-muted-foreground">Expires 09 / 2028</p>
          </div>
          <Badge class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20 gap-1">
            <CheckCircle2 class="h-3 w-3" /> Default
          </Badge>
        </div>
      </CardContent>
    </Card>

    <Card class="mb-8 overflow-hidden">
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Invoice history</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead class="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="inv in invoices" :key="inv.id" class="group">
              <TableCell class="font-mono text-xs">{{ inv.number }}</TableCell>
              <TableCell class="text-muted-foreground">{{ inv.date }}</TableCell>
              <TableCell>{{ inv.description }}</TableCell>
              <TableCell class="font-medium text-right tabular-nums">${{ inv.amount.toFixed(2) }}</TableCell>
              <TableCell>
                <Badge
                  :class="{
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20': inv.status === 'paid',
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/20': inv.status === 'pending',
                    'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/10 border-red-500/20': inv.status === 'failed',
                  }"
                  class="capitalize"
                  :variant="statusVariant(inv.status) === 'success' ? 'outline' : 'outline'"
                >{{ inv.status }}</Badge>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="icon" class="h-8 w-8 opacity-0 group-hover:opacity-100 transition" @click="downloadInvoice">
                  <Download class="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <section>
      <h2 class="font-semibold mb-4">Available plans</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          v-for="(plan, i) in plans"
          :key="plan.id"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.05 * i }"
          class="relative"
        >
          <Card
            class="h-full flex flex-col"
            :class="plan.popular ? 'border-primary ring-2 ring-primary/20 shadow-lg' : ''"
          >
            <Badge v-if="plan.popular" class="absolute -top-2.5 left-1/2 -translate-x-1/2 gap-1">
              <Crown class="h-3 w-3" /> Most popular
            </Badge>
            <CardContent class="p-6 flex-1 flex flex-col">
              <h3 class="font-bold text-lg">{{ plan.name }}</h3>
              <div class="mt-3 mb-4">
                <span class="text-3xl font-bold tabular-nums">${{ plan.pricePerMonth }}</span>
                <span class="text-sm text-muted-foreground"> / mo</span>
              </div>
              <p class="text-xs text-muted-foreground mb-4">
                {{ plan.ramGb }} GB RAM · {{ plan.cpuVcores }} vCPU · {{ plan.storageGb }} GB SSD
              </p>
              <Separator class="mb-4" />
              <ul class="space-y-1.5 text-sm flex-1 mb-4">
                <li v-for="f in plan.features" :key="f" class="flex items-start gap-2">
                  <CheckCircle2 class="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span class="text-muted-foreground">{{ f }}</span>
                </li>
              </ul>
              <Button
                class="w-full"
                :variant="plan.popular ? 'default' : 'outline'"
                @click="upgradeToPlan(plan.name)"
              >
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  </div>
</template>
