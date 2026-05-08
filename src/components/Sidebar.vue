<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'
import { Server, CreditCard, UserCircle, LogOut, Sun, Moon, Gamepad2, ChevronUp } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { computed } from 'vue'

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

const navItems = [
  { name: 'servers', label: 'Servers', icon: Server },
  { name: 'billing', label: 'Billing', icon: CreditCard },
  { name: 'account', label: 'Account', icon: UserCircle },
] as const
</script>

<template>
  <aside class="w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
    <div class="px-5 py-5">
      <div class="flex items-center gap-2.5">
        <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md shadow-primary/20 ring-1 ring-white/10">
          <Gamepad2 class="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p class="text-sm font-semibold leading-none">Godlike</p>
          <p class="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Hosting Panel</p>
        </div>
      </div>
    </div>

    <Separator />

    <nav class="flex-1 p-3 space-y-0.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        v-slot="{ isActive, navigate, href }"
        :to="{ name: item.name }"
        custom
      >
        <a
          :href="href"
          class="group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'"
          @click="navigate"
        >
          <span
            v-if="isActive"
            class="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-primary"
            aria-hidden="true"
          />
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </a>
      </RouterLink>
    </nav>

    <Separator />

    <div class="p-3 space-y-2">
      <Button variant="ghost" size="sm" class="w-full justify-start gap-2 px-3 text-muted-foreground" @click="theme.toggle">
        <Sun v-if="theme.mode === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
        {{ theme.mode === 'dark' ? 'Light mode' : 'Dark mode' }}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            class="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-sidebar-accent/60 transition-colors text-left"
          >
            <Avatar class="h-8 w-8">
              <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">{{ initials }}</AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium truncate">{{ auth.email }}</p>
              <p class="text-[10px] text-muted-foreground">Owner</p>
            </div>
            <ChevronUp class="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" class="w-56">
          <DropdownMenuLabel>Signed in</DropdownMenuLabel>
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
    </div>
  </aside>
</template>
