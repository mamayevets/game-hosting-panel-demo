<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { servers } from '@/data/servers'
import {
  Server, CreditCard, UserCircle, Activity, Database, FileText, Settings, HelpCircle, Plus,
} from 'lucide-vue-next'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ quickCreate: [] }>()
const router = useRouter()

function go(name: string, params?: Record<string, string>) {
  open.value = false
  router.push({ name, params })
}

function trigger(action: 'quick-create') {
  open.value = false
  if (action === 'quick-create') emit('quickCreate')
}

function onKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="Type a command or search…" />
    <CommandList>
      <CommandEmpty>No matches found.</CommandEmpty>
      <CommandGroup heading="Actions">
        <CommandItem value="quick-create" @select="trigger('quick-create')">
          <Plus class="h-4 w-4 mr-2" /> Quick create a server
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Navigate">
        <CommandItem value="servers" @select="go('servers')">
          <Server class="h-4 w-4 mr-2" /> Dashboard / Servers
        </CommandItem>
        <CommandItem value="billing" @select="go('billing')">
          <CreditCard class="h-4 w-4 mr-2" /> Billing
        </CommandItem>
        <CommandItem value="account" @select="go('account')">
          <UserCircle class="h-4 w-4 mr-2" /> Account
        </CommandItem>
        <CommandItem value="activity" @select="go('activity')">
          <Activity class="h-4 w-4 mr-2" /> Activity log
        </CommandItem>
        <CommandItem value="backups" @select="go('backups')">
          <Database class="h-4 w-4 mr-2" /> Backups
        </CommandItem>
        <CommandItem value="api-reference" @select="go('api-reference')">
          <FileText class="h-4 w-4 mr-2" /> API reference
        </CommandItem>
        <CommandItem value="settings" @select="go('settings')">
          <Settings class="h-4 w-4 mr-2" /> Settings
        </CommandItem>
        <CommandItem value="help" @select="go('help')">
          <HelpCircle class="h-4 w-4 mr-2" /> Help & support
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Servers">
        <CommandItem
          v-for="s in servers"
          :key="s.id"
          :value="`${s.name} ${s.game} ${s.ipAddress}`"
          @select="go('server-detail', { id: s.id })"
        >
          <Server class="h-4 w-4 mr-2" /> {{ s.name }}
          <span class="ml-auto text-xs text-muted-foreground capitalize">{{ s.game }}</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
