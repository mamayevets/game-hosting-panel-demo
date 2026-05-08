<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Key, Shield, Bell, Copy, RotateCw } from 'lucide-vue-next'

const auth = useAuthStore()

const profile = ref({
  fullName: 'Max Mamay',
  email: auth.email ?? 'demo@godlike.host',
  company: 'Mamay Studios',
  timezone: 'Europe/Kyiv',
})

const twoFactorEnabled = ref(false)
const apiKey = ref('glk_live_a8f3k2…N4yZ')
const notifications = ref({
  serverDown: true,
  paymentFailed: true,
  weeklyReport: false,
  productUpdates: true,
})

function regenerate() {
  apiKey.value = 'glk_live_' + Math.random().toString(36).slice(2, 10) + '…' + Math.random().toString(36).slice(2, 6)
}

function copyKey() {
  navigator.clipboard.writeText(apiKey.value)
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl font-bold">Account</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your profile, security, and notifications</p>
    </header>

    <section class="card p-6 mb-6">
      <h2 class="font-semibold mb-4">Profile</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium mb-1">Full name</label>
          <input v-model="profile.fullName" class="input" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Email</label>
          <input v-model="profile.email" class="input" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Company</label>
          <input v-model="profile.company" class="input" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Timezone</label>
          <select v-model="profile.timezone" class="input">
            <option>Europe/Kyiv</option>
            <option>Europe/London</option>
            <option>America/New_York</option>
            <option>Asia/Singapore</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button class="btn-primary">Save changes</button>
      </div>
    </section>

    <section class="card p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-semibold flex items-center gap-2"><Shield class="h-4 w-4 text-brand-600" /> Security</h2>
          <p class="text-xs text-slate-500 mt-0.5">Two-factor auth and active sessions</p>
        </div>
      </div>
      <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div>
          <p class="text-sm font-medium">Two-factor authentication</p>
          <p class="text-xs text-slate-500 mt-0.5">{{ twoFactorEnabled ? 'Enabled — TOTP via authenticator app' : 'Disabled' }}</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="twoFactorEnabled" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-brand-600 transition relative
                      after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5
                      after:transition peer-checked:after:translate-x-5"></div>
        </label>
      </div>
    </section>

    <section class="card p-6 mb-6">
      <div class="mb-4">
        <h2 class="font-semibold flex items-center gap-2"><Key class="h-4 w-4 text-brand-600" /> API Keys</h2>
        <p class="text-xs text-slate-500 mt-0.5">Programmatic access to the Godlike API</p>
      </div>
      <div class="flex items-center gap-2">
        <code class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs font-mono">{{ apiKey }}</code>
        <button @click="copyKey" class="btn-secondary text-xs flex items-center gap-1.5"><Copy class="h-3.5 w-3.5" /> Copy</button>
        <button @click="regenerate" class="btn-secondary text-xs flex items-center gap-1.5"><RotateCw class="h-3.5 w-3.5" /> Regenerate</button>
      </div>
    </section>

    <section class="card p-6">
      <div class="mb-4">
        <h2 class="font-semibold flex items-center gap-2"><Bell class="h-4 w-4 text-brand-600" /> Notifications</h2>
      </div>
      <div class="space-y-3">
        <label class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div>
            <p class="text-sm font-medium">Server goes down</p>
            <p class="text-xs text-slate-500">Email alert if any of your servers stops responding</p>
          </div>
          <input v-model="notifications.serverDown" type="checkbox" class="h-4 w-4 accent-brand-600" />
        </label>
        <label class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div>
            <p class="text-sm font-medium">Payment failed</p>
            <p class="text-xs text-slate-500">Be notified if a charge doesn't go through</p>
          </div>
          <input v-model="notifications.paymentFailed" type="checkbox" class="h-4 w-4 accent-brand-600" />
        </label>
        <label class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div>
            <p class="text-sm font-medium">Weekly usage report</p>
            <p class="text-xs text-slate-500">Summary of CPU, RAM, and player activity each Monday</p>
          </div>
          <input v-model="notifications.weeklyReport" type="checkbox" class="h-4 w-4 accent-brand-600" />
        </label>
        <label class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div>
            <p class="text-sm font-medium">Product updates</p>
            <p class="text-xs text-slate-500">New games, features, and releases</p>
          </div>
          <input v-model="notifications.productUpdates" type="checkbox" class="h-4 w-4 accent-brand-600" />
        </label>
      </div>
    </section>
  </div>
</template>
