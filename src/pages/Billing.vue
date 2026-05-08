<script setup lang="ts">
import { invoices } from '@/data/invoices'
import { nextCharge } from '@/data/billing'
import { Download } from 'lucide-vue-next'
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const totalSpent = computed(() => invoices.reduce((sum, i) => sum + i.amount, 0))

function downloadInvoice(num: string) {
  toast.success(`Downloaded ${num}`, { description: 'Generated as PDF in production.' })
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Billing</h1>
      <p class="text-sm text-muted-foreground mt-1">Invoices and payment history.</p>
    </motion.header>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.05 }">
      <Card>
        <CardContent class="p-5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <Badge variant="outline" class="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 text-[10px]">
                  Active
                </Badge>
                <span class="text-xs text-muted-foreground">Workspace plan</span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-bold tabular-nums">${{ nextCharge.amount.toFixed(2) }}</span>
                <span class="text-sm text-muted-foreground">/mo</span>
              </div>
              <p class="text-xs text-muted-foreground mt-0.5">Renews {{ nextCharge.date }} · Visa · 4242</p>
            </div>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" class="h-8" @click="toast.message('Update payment', { description: 'Routes to Stripe customer portal.' })">
                Update card
              </Button>
              <Button variant="outline" size="sm" class="h-8" @click="toast.message('Manage subscription', { description: 'Stripe portal in production.' })">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.1 }">
      <div class="grid grid-cols-3 gap-3">
        <div class="p-4 rounded-lg border">
          <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Next charge</p>
          <p class="text-lg font-semibold tabular-nums mt-1">${{ nextCharge.amount.toFixed(2) }}</p>
          <p class="text-[11px] text-muted-foreground">{{ nextCharge.date }}</p>
        </div>
        <div class="p-4 rounded-lg border">
          <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Lifetime</p>
          <p class="text-lg font-semibold tabular-nums mt-1">${{ totalSpent.toFixed(2) }}</p>
          <p class="text-[11px] text-muted-foreground">{{ invoices.length }} invoices</p>
        </div>
        <div class="p-4 rounded-lg border">
          <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Plan</p>
          <p class="text-lg font-semibold mt-1">Pro</p>
          <p class="text-[11px] text-muted-foreground">6 servers</p>
        </div>
      </div>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.15 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Invoice history</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <div class="divide-y divide-border">
            <div v-for="inv in invoices" :key="inv.id" class="px-5 py-3.5 flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ inv.description }}</p>
                <p class="text-[11px] text-muted-foreground font-mono mt-0.5">{{ inv.number }} · {{ inv.date }}</p>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-sm font-semibold tabular-nums">${{ inv.amount.toFixed(2) }}</span>
                <Badge
                  variant="outline"
                  :class="{
                    'bg-emerald-500/5 text-emerald-500 border-emerald-500/20': inv.status === 'paid',
                    'bg-amber-500/5 text-amber-500 border-amber-500/20': inv.status === 'pending',
                    'bg-red-500/5 text-red-500 border-red-500/20': inv.status === 'failed',
                  }"
                  class="capitalize text-[10px] px-1.5 py-0"
                >
                  {{ inv.status }}
                </Badge>
                <Button variant="ghost" size="sm" class="h-7 px-2 text-xs gap-1.5 hidden sm:inline-flex" @click="downloadInvoice(inv.number)">
                  <Download class="h-3 w-3" /> PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>
