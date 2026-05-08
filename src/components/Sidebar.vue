<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'
import {
  Server, CreditCard, UserCircle, LogOut, Sun, Moon,
  Plus, Mail, Settings, HelpCircle, Search, ChevronUp,
  Activity, Database, FileText, Sparkles,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { computed } from 'vue'
import { toast } from 'vue-sonner'

const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()

const initials = computed(() => {
  const name = auth.email ?? 'demo'
  return name.slice(0, 2).toUpperCase()
})

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

function quickCreate() {
  toast.message('Quick create', { description: 'Opens a multi-step provisioning wizard in production.' })
}

function comingSoon(label: string) {
  toast.message(label, { description: 'Coming soon.' })
}

const primaryNav = [
  { name: 'servers', label: 'Servers', icon: Server },
  { name: 'billing', label: 'Billing', icon: CreditCard },
  { name: 'account', label: 'Account', icon: UserCircle },
] as const

const resourceNav = [
  { label: 'Activity log', icon: Activity },
  { label: 'Backups', icon: Database },
  { label: 'API reference', icon: FileText },
] as const

const bottomNav = [
  { label: 'Settings', icon: Settings },
  { label: 'Get help', icon: HelpCircle },
  { label: 'Search', icon: Search, hint: '⌘K' },
] as const
</script>

<template>
  <aside class="w-[260px] shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
    <div class="px-4 py-3 flex items-center gap-2.5">
      <div class="h-7 w-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
        <Sparkles class="h-3.5 w-3.5 text-background" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold leading-none truncate">Godlike</p>
        <p class="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Hosting Panel</p>
      </div>
    </div>

    <div class="px-3 pt-1 pb-3 flex items-center gap-1">
      <Button class="flex-1 justify-start gap-2 h-8" size="sm" @click="quickCreate">
        <Plus class="h-3.5 w-3.5" />
        <span class="text-xs font-semibold">Quick Create</span>
      </Button>
      <Button variant="outline" size="icon" class="h-8 w-8 shrink-0" @click="comingSoon('Inbox')">
        <Mail class="h-3.5 w-3.5" />
      </Button>
    </div>

    <Separator />

    <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-3">
      <div class="space-y-0.5">
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
            @click="navigate"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </a>
        </RouterLink>
      </div>

      <div class="space-y-0.5">
        <p class="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">Resources</p>
        <button
          v-for="item in resourceNav"
          :key="item.label"
          class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
          @click="comingSoon(item.label)"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </button>
      </div>
    </nav>

    <Separator />

    <div class="p-2 space-y-0.5">
      <button
        v-for="item in bottomNav"
        :key="item.label"
        class="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        @click="comingSoon(item.label)"
      >
        <span class="flex items-center gap-2.5">
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </span>
        <kbd v-if="'hint' in item" class="text-[10px] px-1.5 py-0.5 rounded bg-muted font-sans text-muted-foreground/70">{{ item.hint }}</kbd>
      </button>
      <button
        class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        @click="theme.toggle"
      >
        <Sun v-if="theme.mode === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
        {{ theme.mode === 'dark' ? 'Light mode' : 'Dark mode' }}
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
        <DropdownMenuItem @click="router.push({ name: 'account' })">
          <UserCircle class="h-4 w-4 mr-2" />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuItem @click="router.push({ name: 'billing' })">
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
  </aside>
</template>
