<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'
import { Globe2, Sliders, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const defaultRegion = ref('eu-central')
const autoBackup = ref(true)
const reducedMotion = ref(false)
const compactMode = ref(false)

function save() {
  toast.success('Workspace preferences saved')
}

function dangerous() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
    <header>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
      <p class="text-sm text-muted-foreground mt-1">Workspace-level preferences. Personal settings live under Account.</p>
    </header>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base flex items-center gap-2">
            <Sliders class="h-4 w-4" /> Defaults
          </CardTitle>
          <CardDescription>Pre-fill these every time you provision a new server.</CardDescription>
        </CardHeader>
        <CardContent class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <Label class="text-xs flex items-center gap-1.5"><Globe2 class="h-3.5 w-3.5" /> Default region</Label>
            <Select v-model="defaultRegion">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="eu-west">EU West (Frankfurt)</SelectItem>
                <SelectItem value="eu-central">EU Central (Helsinki)</SelectItem>
                <SelectItem value="us-east">US East (Virginia)</SelectItem>
                <SelectItem value="us-west">US West (Oregon)</SelectItem>
                <SelectItem value="asia-singapore">Asia (Singapore)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.05 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Behavior</CardTitle>
          <CardDescription>How the panel and your servers behave by default.</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
          <div class="divide-y">
            <div class="px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-medium">Daily auto-backup</p>
                <p class="text-xs text-muted-foreground mt-0.5">Run a snapshot of every server at 04:00 in its region.</p>
              </div>
              <Switch v-model="autoBackup" />
            </div>
            <div class="px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-medium">Reduced motion</p>
                <p class="text-xs text-muted-foreground mt-0.5">Disable page transitions and stagger animations.</p>
              </div>
              <Switch v-model="reducedMotion" />
            </div>
            <div class="px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-medium">Compact tables</p>
                <p class="text-xs text-muted-foreground mt-0.5">Tighter row spacing in lists and tables.</p>
              </div>
              <Switch v-model="compactMode" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <div class="flex justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button @click="save">Save changes</Button>
    </div>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.1 }">
      <Card class="border-destructive/30">
        <CardHeader class="pb-3">
          <CardTitle class="text-base flex items-center gap-2 text-destructive">
            <Trash2 class="h-4 w-4" /> Danger zone
          </CardTitle>
          <CardDescription>These actions are permanent. Removing a workspace cancels all subscriptions and decommissions every server immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" @click="dangerous">Delete workspace</Button>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>
