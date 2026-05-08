<script setup lang="ts">
import { invoices } from '@/data/invoices'
import { servers } from '@/data/servers'
import { Download } from 'lucide-vue-next'
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const totalSpent = computed(() => invoices.reduce((sum, i) => sum + i.amount, 0))
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
  toast.success(`${t('common.downloaded')} ${num}`, { description: 'Generated as PDF in production.' })
}

const usageRows = computed(() => [
  { labelKey: 'billing.usage.ram', percent: planUsedPercent.value, sub: `${((planUsedPercent.value / 100) * planTotalGb.value).toFixed(1)} of ${planTotalGb.value} GB` },
  { labelKey: 'billing.usage.disk', percent: diskUsedPercent.value, sub: `${usedDiskGb.value.toFixed(1)} of ${totalDiskGb.value} GB` },
  { labelKey: 'billing.usage.playerSlots', percent: playersPercent.value, sub: `${usedPlayerSlots.value} of ${totalPlayerSlots.value} reserved` },
])
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">{{ t('billing.title') }}</h1>
      <p class="text-sm text-muted-foreground mt-1">{{ t('billing.subtitle') }}</p>
    </motion.header>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.1 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">{{ t('billing.usage.title') }}</CardTitle>
          <CardDescription class="text-xs">{{ t('billing.usage.subtitle') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-for="row in usageRows" :key="row.labelKey">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium">{{ t(row.labelKey) }}</span>
              <span class="text-sm font-mono tabular-nums">{{ row.percent }}%</span>
            </div>
            <Progress :model-value="row.percent" class="h-1.5 mt-2" />
            <p class="text-xs text-muted-foreground mt-1.5">{{ row.sub }}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.15 }">
      <div class="grid grid-cols-2 gap-3">
        <Card>
          <CardContent class="p-4">
            <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">{{ t('billing.stats.next') }}</p>
            <p class="text-lg sm:text-xl font-semibold tabular-nums">${{ totalSpent > 0 ? (totalSpent / invoices.length).toFixed(2) : '0.00' }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <p class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">{{ t('billing.stats.lifetime') }}</p>
            <p class="text-lg sm:text-xl font-semibold tabular-nums">${{ totalSpent.toFixed(2) }}</p>
            <p class="text-[11px] text-muted-foreground mt-0.5">{{ invoices.length }} {{ t('billing.stats.invoices') }}</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.2 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">{{ t('billing.invoices.title') }}</CardTitle>
          <CardDescription class="text-xs">{{ t('billing.invoices.subtitle') }}</CardDescription>
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
                <Download class="h-3 w-3" /> {{ t('billing.invoices.download') }}
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>
