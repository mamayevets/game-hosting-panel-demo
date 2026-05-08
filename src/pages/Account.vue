<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Key, Shield, Bell, Copy, RotateCw, User2 } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const auth = useAuthStore()

const profile = ref({
  fullName: '',
  email: auth.email ?? 'demo@test.host',
  company: '',
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

const notifList = [
  { key: 'serverDown' as const, label: 'Server goes down', desc: 'Email alert if any of your servers stops responding' },
  { key: 'paymentFailed' as const, label: 'Payment failed', desc: "Be notified if a charge doesn't go through" },
  { key: 'weeklyReport' as const, label: 'Weekly usage report', desc: 'Summary of CPU, RAM, and player activity each Monday' },
  { key: 'productUpdates' as const, label: 'Product updates', desc: 'New games, features, and releases' },
]

function regenerate() {
  apiKey.value = 'glk_live_' + Math.random().toString(36).slice(2, 10) + '…' + Math.random().toString(36).slice(2, 6)
  toast.success('API key regenerated', { description: 'Old key revoked immediately.' })
}

function copyKey() {
  navigator.clipboard.writeText(apiKey.value)
  toast.success('Key copied to clipboard')
}

function saveProfile() {
  toast.success('Profile saved')
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Account</h1>
      <p class="text-sm text-muted-foreground mt-1">Manage your profile, security, and notifications</p>
    </motion.header>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base flex items-center gap-2">
          <User2 class="h-4 w-4 text-primary" /> Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <Label for="fullName">Full name</Label>
            <Input id="fullName" v-model="profile.fullName" />
          </div>
          <div class="space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" v-model="profile.email" type="email" />
          </div>
          <div class="space-y-1.5">
            <Label for="company">Company</Label>
            <Input id="company" v-model="profile.company" />
          </div>
          <div class="space-y-1.5">
            <Label for="timezone">Timezone</Label>
            <Select v-model="profile.timezone">
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Kyiv">Europe/Kyiv</SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="America/New_York">America/New_York</SelectItem>
                <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <Button @click="saveProfile">Save changes</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base flex items-center gap-2">
          <Shield class="h-4 w-4 text-primary" /> Security
        </CardTitle>
        <CardDescription>Two-factor auth and active sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between p-4 bg-muted/40 rounded-lg border">
          <div>
            <p class="text-sm font-medium">Two-factor authentication</p>
            <p class="text-xs text-muted-foreground mt-0.5">
              {{ twoFactorEnabled ? 'Enabled — TOTP via authenticator app' : 'Disabled' }}
            </p>
          </div>
          <Switch v-model="twoFactorEnabled" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base flex items-center gap-2">
          <Key class="h-4 w-4 text-primary" /> API Keys
        </CardTitle>
        <CardDescription>Programmatic access to the Godlike API</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-2 flex-wrap">
          <code class="flex-1 min-w-[12rem] px-3 py-2 bg-muted rounded-md text-xs font-mono border">{{ apiKey }}</code>
          <Button variant="outline" size="sm" class="gap-1.5" @click="copyKey">
            <Copy class="h-3.5 w-3.5" /> Copy
          </Button>
          <Button variant="outline" size="sm" class="gap-1.5" @click="regenerate">
            <RotateCw class="h-3.5 w-3.5" /> Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base flex items-center gap-2">
          <Bell class="h-4 w-4 text-primary" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <div class="divide-y">
          <div
            v-for="n in notifList"
            :key="n.key"
            class="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
          >
            <div>
              <p class="text-sm font-medium">{{ n.label }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{{ n.desc }}</p>
            </div>
            <Switch v-model="notifications[n.key]" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
