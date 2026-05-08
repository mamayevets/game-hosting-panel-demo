<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
  Server, CreditCard, UserCircle, LogOut,
  Plus, Mail, Settings, HelpCircle, Search,
  Activity, Database, FileText, Sparkles, ChevronUp,
  Globe, Crown,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { setLocale, availableLocales, type Locale } from '@/i18n'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { computed } from 'vue'

const props = defineProps<{ inSheet?: boolean }>()
const emit = defineEmits<{ quickCreate: []; openSearch: []; navigate: [] }>()

const auth = useAuthStore()
const router = useRouter()
const { t, locale } = useI18n()

const initials = computed(() => {
  const name = auth.email ?? 'demo'
  return name.slice(0, 2).toUpperCase()
})

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

function switchLanguage(code: Locale) {
  setLocale(code)
}

const primaryNav = [
  { name: 'servers', labelKey: 'sidebar.nav.servers', icon: Server },
  { name: 'billing', labelKey: 'sidebar.nav.billing', icon: CreditCard },
  { name: 'subscription', labelKey: 'sidebar.nav.subscription', icon: Crown },
  { name: 'account', labelKey: 'sidebar.nav.account', icon: UserCircle },
] as const

const resourceNav = [
  { name: 'activity', labelKey: 'sidebar.nav.activity', icon: Activity },
  { name: 'backups', labelKey: 'sidebar.nav.backups', icon: Database },
  { name: 'api-reference', labelKey: 'sidebar.nav.apiReference', icon: FileText },
] as const

const bottomNav = [
  { name: 'settings', labelKey: 'sidebar.nav.settings', icon: Settings },
  { name: 'help', labelKey: 'sidebar.nav.help', icon: HelpCircle },
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
        <p class="text-sm font-semibold leading-none truncate">{{ t('sidebar.title') }}</p>
        <p class="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{{ t('sidebar.subtitle') }}</p>
      </div>
    </div>

    <div class="px-3 pt-1 pb-2 flex items-center gap-1">
      <Button class="flex-1 justify-start gap-2 h-8" size="sm" @click="emit('quickCreate'); emit('navigate')">
        <Plus class="h-3.5 w-3.5" />
        <span class="text-xs font-semibold">{{ t('sidebar.quickCreate') }}</span>
      </Button>
      <Button variant="outline" size="icon" class="h-8 w-8 shrink-0" aria-label="Inbox" @click="emit('navigate')">
        <Mail class="h-3.5 w-3.5" />
      </Button>
    </div>

    <div class="px-3 pb-2">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="w-full justify-start gap-2 h-8 text-xs text-muted-foreground">
            <Globe class="h-3.5 w-3.5" />
            <span>{{ locale === 'uk' ? 'Українська' : 'English' }}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="w-40">
          <DropdownMenuItem v-for="loc in availableLocales" :key="loc.code" :class="locale === loc.code ? 'bg-sidebar-accent' : ''" @click="switchLanguage(loc.code)">
            {{ loc.label }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
          {{ t(item.labelKey) }}
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
          {{ t(item.labelKey) }}
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
          {{ t(item.labelKey) }}
        </a>
      </RouterLink>
      <button
        class="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        @click="emit('openSearch'); emit('navigate')"
      >
        <span class="flex items-center gap-2.5">
          <Search class="h-4 w-4" />
          {{ t('sidebar.search') }}
        </span>
        <kbd class="text-[10px] px-1.5 py-0.5 rounded bg-muted font-sans text-muted-foreground/70">{{ t('sidebar.searchShortcut') }}</kbd>
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
            <p class="text-[10px] text-muted-foreground">{{ t('sidebar.user.owner') }}</p>
          </div>
          <ChevronUp class="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" class="w-56">
        <DropdownMenuLabel>{{ auth.email }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="router.push({ name: 'account' }); emit('navigate')">
          <UserCircle class="h-4 w-4 mr-2" />
          {{ t('sidebar.user.accountSettings') }}
        </DropdownMenuItem>
        <DropdownMenuItem @click="router.push({ name: 'billing' }); emit('navigate')">
          <CreditCard class="h-4 w-4 mr-2" />
          {{ t('sidebar.nav.billing') }}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleLogout">
          <LogOut class="h-4 w-4 mr-2" />
          {{ t('sidebar.user.signOut') }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
