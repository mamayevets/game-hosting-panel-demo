<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
  Server, CreditCard, UserCircle, LogOut,
  Plus, Mail, Settings, HelpCircle, Search,
  Activity, Database, FileText, Sparkles, ChevronUp,
  Crown,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { computed } from 'vue'

const props = defineProps<{ inSheet?: boolean }>()
const emit = defineEmits<{ quickCreate: []; openSearch: []; navigate: [] }>()

const auth = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  const name = auth.email ?? 'demo'
  return name.slice(0, 2).toUpperCase()
})

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

const primaryNav = [
  { name: 'servers', label: 'Servers', icon: Server },
  { name: 'billing', label: 'Billing', icon: CreditCard },
  { name: 'subscription', label: 'Subscription', icon: Crown },
  { name: 'account', label: 'Account', icon: UserCircle },
] as const

const resourceNav = [
  { name: 'activity', label: 'Activity log', icon: Activity },
  { name: 'backups', label: 'Backups', icon: Database },
  { name: 'api-reference', label: 'API reference', icon: FileText },
] as const

const bottomNav = [
  { name: 'settings', label: 'Settings', icon: Settings },
  { name: 'help', label: 'Help & support', icon: HelpCircle },
] as const
</script>

<template>
  <div
    class="h-full w-full flex flex-col bg-sidebar text-sidebar-foreground"
    :class="!props.inSheet ? 'border-r' : ''"
  >
    <div class="px-4 py-3 flex items-center gap-2.5">
      <div class="h-7 w-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
        <Sparkles class="h-3.5 w-3.5 text-background" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold leading-none truncate">Test Panel</p>
        <p class="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Hosting Demo</p>
      </div>
    </div>

    <div class="px-3 pt-1 pb-3 flex items-center gap-1">
      <Button class="flex-1 justify-start gap-2 h-8" size="sm" @click="emit('quickCreate'); emit('navigate')">
        <Plus class="h-3.5 w-3.5" />
        <span class="text-xs font-semibold">Quick Create</span>
      </Button>
      <Button variant="outline" size="icon" class="h-8 w-8 shrink-0" aria-label="Inbox" @click="emit('navigate')">
        <Mail class="h-3.5 w-3.5" />
      </Button>
    </div>

    <Separator />

    <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
      <RouterLink
        v-for="item in primaryNav"
        :key="item.name"
        v-slot="{ isActive, navigate, href }"
        :to="{ name: item.name }"
        custom
      >
        <a
          :href="href"
          class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors"
          :class="isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'"
          @click="(e: MouseEvent) => { navigate(e); emit('navigate') }"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </a>
      </RouterLink>
      <RouterLink
        v-for="item in resourceNav"
        :key="item.name"
        v-slot="{ isActive, navigate, href }"
        :to="{ name: item.name }"
        custom
      >
        <a
          :href="href"
          class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors"
          :class="isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'"
          @click="(e: MouseEvent) => { navigate(e); emit('navigate') }"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </a>
      </RouterLink>
    </nav>

    <Separator />

    <div class="p-2 space-y-0.5">
      <RouterLink
        v-for="item in bottomNav"
        :key="item.name"
        v-slot="{ isActive, navigate, href }"
        :to="{ name: item.name }"
        custom
      >
        <a
          :href="href"
          class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors"
          :class="isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'"
          @click="(e: MouseEvent) => { navigate(e); emit('navigate') }"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </a>
      </RouterLink>
      <button
        class="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        @click="emit('openSearch'); emit('navigate')"
      >
        <span class="flex items-center gap-2.5">
          <Search class="h-4 w-4" />
          Search
        </span>
        <kbd class="text-[10px] px-1.5 py-0.5 rounded bg-muted font-sans text-muted-foreground/70">⌘K</kbd>
      </button>
    </div>

    <Separator />

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button class="m-2 flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-sidebar-accent/60 transition-colors text-left">
          <Avatar class="h-8 w-8">
            <AvatarFallback class="bg-foreground text-background text-xs font-semibold">{{ initials }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium truncate">{{ auth.email }}</p>
            <p class="text-[10px] text-muted-foreground">Owner</p>
          </div>
          <ChevronUp class="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" class="w-56">
        <DropdownMenuLabel>{{ auth.email }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="router.push({ name: 'account' }); emit('navigate')">
          <UserCircle class="h-4 w-4 mr-2" />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuItem @click="router.push({ name: 'billing' }); emit('navigate')">
          <CreditCard class="h-4 w-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleLogout">
          <LogOut class="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
