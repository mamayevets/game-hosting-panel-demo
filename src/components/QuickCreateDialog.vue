<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Game, Region } from '@/types'
import { Loader2, Sparkles } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useServersStore } from '@/stores/servers'

const open = defineModel<boolean>('open', { default: false })

const router = useRouter()
const servers = useServersStore()
const submitting = ref(false)
const name = ref('')
const game = ref<Game>('minecraft')
const region = ref<Region>('eu-central')
const plan = ref<'Double 6GB' | 'Quadro 8GB' | 'Ultra 12GB' | 'Pro 16GB'>('Quadro 8GB')

const games: { value: Game; label: string }[] = [
  { value: 'minecraft', label: 'Minecraft' },
  { value: 'rust', label: 'RUST' },
  { value: 'ark', label: 'ARK: Survival Ascended' },
  { value: 'palworld', label: 'Palworld' },
  { value: 'valheim', label: 'Valheim' },
  { value: 'cs2', label: 'CS2' },
]

const regions: { value: Region; label: string }[] = [
  { value: 'eu-west', label: 'EU West (Frankfurt)' },
  { value: 'eu-central', label: 'EU Central (Helsinki)' },
  { value: 'us-east', label: 'US East (Virginia)' },
  { value: 'us-west', label: 'US West (Oregon)' },
  { value: 'asia-singapore', label: 'Asia (Singapore)' },
]

async function submit() {
  if (!name.value.trim()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 600))
  const created = servers.addServer({
    name: name.value,
    game: game.value,
    plan: plan.value,
    region: region.value,
  })
  submitting.value = false
  open.value = false
  toast.success('Server provisioning…', {
    description: `${created.name} · ${created.plan} · ${created.region.replace('-', ' ')}`,
    action: {
      label: 'Open',
      onClick: () => router.push({ name: 'server-detail', params: { id: created.id } }),
    },
  })
  name.value = ''
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[460px]">
      <DialogHeader>
        <div class="h-9 w-9 rounded-md bg-foreground flex items-center justify-center mb-2">
          <Sparkles class="h-4 w-4 text-background" />
        </div>
        <DialogTitle>Provision a new game server</DialogTitle>
        <DialogDescription>
          Configure the basics. You can refine plugins, world settings, and ports after the runtime spins up.
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4 py-2" @submit.prevent="submit">
        <div class="space-y-1.5">
          <Label for="name">Server name</Label>
          <Input id="name" v-model="name" placeholder="e.g. Tuesday Movie Night" required />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="game">Game</Label>
            <Select v-model="game">
              <SelectTrigger id="game">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="g in games" :key="g.value" :value="g.value">{{ g.label }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="plan">Plan</Label>
            <Select v-model="plan">
              <SelectTrigger id="plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Double 6GB">Double 6GB · $6.29/mo</SelectItem>
                <SelectItem value="Quadro 8GB">Quadro 8GB · $12.99/mo</SelectItem>
                <SelectItem value="Ultra 12GB">Ultra 12GB · $18.99/mo</SelectItem>
                <SelectItem value="Pro 16GB">Pro 16GB · $28.99/mo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="space-y-1.5">
          <Label for="region">Region</Label>
          <Select v-model="region">
            <SelectTrigger id="region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="r in regions" :key="r.value" :value="r.value">{{ r.label }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>

      <DialogFooter>
        <Button variant="outline" @click="open = false">Cancel</Button>
        <Button :disabled="submitting || !name.trim()" @click="submit">
          <Loader2 v-if="submitting" class="h-3.5 w-3.5 mr-1.5 animate-spin" />
          {{ submitting ? 'Provisioning…' : 'Create server' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
