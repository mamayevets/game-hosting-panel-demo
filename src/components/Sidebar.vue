<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'
import { Server, CreditCard, UserCircle, LogOut, Sun, Moon } from 'lucide-vue-next'

const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside class="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
    <div class="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">G</div>
        <div>
          <p class="text-sm font-semibold leading-none">Godlike</p>
          <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Hosting Panel</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-3 space-y-1">
      <RouterLink
        :to="{ name: 'servers' }"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        active-class="!bg-brand-50 !text-brand-700 dark:!bg-brand-500/10 dark:!text-brand-400"
      >
        <Server class="h-4 w-4" />
        Servers
      </RouterLink>
      <RouterLink
        :to="{ name: 'billing' }"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        active-class="!bg-brand-50 !text-brand-700 dark:!bg-brand-500/10 dark:!text-brand-400"
      >
        <CreditCard class="h-4 w-4" />
        Billing
      </RouterLink>
      <RouterLink
        :to="{ name: 'account' }"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        active-class="!bg-brand-50 !text-brand-700 dark:!bg-brand-500/10 dark:!text-brand-400"
      >
        <UserCircle class="h-4 w-4" />
        Account
      </RouterLink>
    </nav>

    <div class="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
      <button
        @click="theme.toggle"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <Sun v-if="theme.mode === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
        {{ theme.mode === 'dark' ? 'Light mode' : 'Dark mode' }}
      </button>
      <div class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <p class="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
        <p class="text-sm font-medium truncate">{{ auth.email }}</p>
        <button
          @click="handleLogout"
          class="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <LogOut class="h-3 w-3" />
          Sign out
        </button>
      </div>
    </div>
  </aside>
</template>
