<script setup lang="ts">
import { invoices } from '../data/invoices'
import { plans } from '../data/plans'
import { Download, CreditCard, CheckCircle2 } from 'lucide-vue-next'
import { computed } from 'vue'

const totalSpent = computed(() => invoices.reduce((sum, i) => sum + i.amount, 0))
const nextCharge = computed(() => ({
  amount: 35.46,
  date: '2026-06-01',
}))
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl font-bold">Billing</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage subscriptions, invoices, and payment methods</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="card p-5">
        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Active subscription</p>
        <p class="text-2xl font-bold mt-1">$35.46/mo</p>
        <p class="text-xs text-slate-500 mt-1">5 servers across all plans</p>
      </div>
      <div class="card p-5">
        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Next charge</p>
        <p class="text-2xl font-bold mt-1">${{ nextCharge.amount }}</p>
        <p class="text-xs text-slate-500 mt-1">on {{ nextCharge.date }}</p>
      </div>
      <div class="card p-5">
        <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Lifetime spent</p>
        <p class="text-2xl font-bold mt-1">${{ totalSpent.toFixed(2) }}</p>
        <p class="text-xs text-slate-500 mt-1">across {{ invoices.length }} invoices</p>
      </div>
    </div>

    <section class="card p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold">Payment method</h2>
        <button class="btn-secondary text-xs">Update card</button>
      </div>
      <div class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <CreditCard class="h-6 w-6 text-slate-400" />
        <div class="flex-1">
          <p class="text-sm font-medium">Visa ending in 4242</p>
          <p class="text-xs text-slate-500">Expires 09 / 2028</p>
        </div>
        <span class="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 class="h-3 w-3" /> Default
        </span>
      </div>
    </section>

    <section class="card mb-8 overflow-hidden">
      <header class="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h2 class="font-semibold">Invoice history</h2>
      </header>
      <table class="w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr class="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th class="px-6 py-3 font-medium">Number</th>
            <th class="px-6 py-3 font-medium">Date</th>
            <th class="px-6 py-3 font-medium">Description</th>
            <th class="px-6 py-3 font-medium">Amount</th>
            <th class="px-6 py-3 font-medium">Status</th>
            <th class="px-6 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
            <td class="px-6 py-3.5 font-mono text-xs">{{ inv.number }}</td>
            <td class="px-6 py-3.5 text-slate-500">{{ inv.date }}</td>
            <td class="px-6 py-3.5">{{ inv.description }}</td>
            <td class="px-6 py-3.5 font-medium">${{ inv.amount.toFixed(2) }}</td>
            <td class="px-6 py-3.5">
              <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="{
                  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400': inv.status === 'paid',
                  'bg-amber-500/10 text-amber-700 dark:text-amber-400': inv.status === 'pending',
                  'bg-red-500/10 text-red-700 dark:text-red-400': inv.status === 'failed',
                }"
              >{{ inv.status }}</span>
            </td>
            <td class="px-6 py-3.5 text-right">
              <button class="text-slate-400 hover:text-brand-600 transition" title="Download PDF">
                <Download class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2 class="font-semibold mb-4">Available plans</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="card p-6 flex flex-col"
          :class="{ 'ring-2 ring-brand-500 relative': plan.popular }"
        >
          <span v-if="plan.popular" class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-brand-600 text-white uppercase tracking-wider px-2 py-0.5 rounded-full">Most popular</span>
          <h3 class="font-bold text-lg">{{ plan.name }}</h3>
          <div class="mt-3 mb-4">
            <span class="text-3xl font-bold">${{ plan.pricePerMonth }}</span>
            <span class="text-sm text-slate-500"> / mo</span>
          </div>
          <p class="text-xs text-slate-500 mb-4">{{ plan.ramGb }} GB RAM · {{ plan.cpuVcores }} vCPU · {{ plan.storageGb }} GB SSD</p>
          <ul class="space-y-1.5 text-sm flex-1 mb-4">
            <li v-for="f in plan.features" :key="f" class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span class="text-slate-600 dark:text-slate-400">{{ f }}</span>
            </li>
          </ul>
          <button class="btn-secondary text-sm">Upgrade</button>
        </div>
      </div>
    </section>
  </div>
</template>
