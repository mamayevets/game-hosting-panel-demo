<script setup lang="ts">
import { computed } from 'vue'
import { plans } from '@/data/plans'
import { invoices } from '@/data/invoices'
import { nextCharge } from '@/data/billing'
import {
  CreditCard, CheckCircle2, Crown, MoreHorizontal,
  ArrowUpRight, Calendar, Receipt,
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const totalSpent = computed(() => invoices.reduce((sum, i) => sum + i.amount, 0))

function upgradeToPlan(name: string) {
  toast.info(t('subscription.upgradeTo', { name }), { description: 'Routes to Stripe checkout in production.' })
}

function notify(label: string, description?: string) {
  toast.message(label, description ? { description } : undefined)
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">{{ t('subscription.title') }}</h1>
      <p class="text-sm text-muted-foreground mt-1">{{ t('subscription.subtitle') }}</p>
    </motion.header>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.05 }">
      <Card>
        <CardHeader class="pb-3">
          <div class="flex items-center gap-2">
            <Badge class="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" /> {{ t('subscription.plan.active') }}
            </Badge>
            <span class="text-xs text-muted-foreground">{{ t('subscription.plan.workspacePlan') }}</span>
          </div>
          <CardTitle class="text-2xl sm:text-3xl tabular-nums mt-2">${{ nextCharge.amount.toFixed(2) }}<span class="text-sm font-normal text-muted-foreground">{{ t('subscription.plan.perMonth') }}</span></CardTitle>
          <CardDescription class="text-xs">
            {{ t('subscription.plan.renews') }} {{ nextCharge.date }} · Visa · 4242
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" class="w-full sm:w-auto gap-1.5" @click="notify('Update payment', 'Routes to Stripe customer portal.')">
              <CreditCard class="h-3.5 w-3.5" /> {{ t('subscription.plan.updateCard') }}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" class="w-full sm:w-auto gap-1.5">
                  {{ t('subscription.plan.manage') }}
                  <MoreHorizontal class="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-56">
                <DropdownMenuItem @click="notify(t('subscription.plan.pause'), 'Servers stay live for 14 days.')">{{ t('subscription.plan.pause') }}</DropdownMenuItem>
                <DropdownMenuItem @click="notify(t('subscription.plan.switchAnnual'), 'Save 17% with annual billing.')">{{ t('subscription.plan.switchAnnual') }}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-destructive focus:text-destructive" @click="notify(t('subscription.plan.cancel'), 'All servers stop at end of billing period.')">{{ t('subscription.plan.cancel') }}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.1 }">
      <div class="grid grid-cols-2 gap-3">
        <Card>
          <CardContent class="p-4">
            <div class="flex items-center gap-2 mb-1.5">
              <Calendar class="h-3.5 w-3.5 text-muted-foreground" />
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{{ t('subscription.nextCharge') }}</p>
            </div>
            <p class="text-lg sm:text-xl font-semibold tabular-nums">${{ nextCharge.amount.toFixed(2) }}</p>
            <p class="text-[11px] text-muted-foreground mt-0.5">{{ nextCharge.date }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="flex items-center gap-2 mb-1.5">
              <Receipt class="h-3.5 w-3.5 text-muted-foreground" />
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{{ t('subscription.lifetime') }}</p>
            </div>
            <p class="text-lg sm:text-xl font-semibold tabular-nums">${{ totalSpent.toFixed(2) }}</p>
            <p class="text-[11px] text-muted-foreground mt-0.5">{{ invoices.length }} {{ t('billing.stats.invoices') }}</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>

    <motion.section :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.15 }">
      <h2 class="text-base font-semibold mb-1">{{ t('subscription.availablePlans.title') }}</h2>
      <p class="text-xs text-muted-foreground mb-3">{{ t('subscription.availablePlans.subtitle') }}</p>

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
                <Crown class="h-3 w-3" /> {{ t('subscription.availablePlans.popular') }}
              </Badge>
            </div>
            <div class="flex items-baseline gap-1 mb-1.5">
              <span class="text-xl font-bold tabular-nums">${{ plan.pricePerMonth }}</span>
              <span class="text-xs text-muted-foreground">{{ t('subscription.availablePlans.perMonth') }}</span>
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
              {{ t('subscription.availablePlans.choosePlan') }}
              <ArrowUpRight class="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  </div>
</template>
