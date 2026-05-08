<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import QuickCreateDialog from '@/components/QuickCreateDialog.vue'
import CommandPalette from '@/components/CommandPalette.vue'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Menu, Sparkles, Search, Github } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const isAuthLayout = computed(() => route.meta.layout === 'auth')

useThemeStore()

const mobileNavOpen = ref(false)
const quickCreateOpen = ref(false)
const commandOpen = ref(false)

watch(() => route.fullPath, () => {
  mobileNavOpen.value = false
})

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    servers: 'Dashboard',
    'server-detail': 'Server',
    billing: 'Billing',
    account: 'Account',
    activity: 'Activity log',
    backups: 'Backups',
    'api-reference': 'API reference',
    settings: 'Settings',
    help: 'Help & support',
  }
  return map[route.name as string] ?? 'Test Panel'
})
</script>

<template>
  <TooltipProvider>
    <div v-if="isAuthLayout">
      <RouterView />
    </div>

    <div v-else class="min-h-screen flex bg-background w-full max-w-[100vw] overflow-x-hidden">
      <aside class="hidden lg:flex w-[260px] shrink-0">
        <Sidebar
          @quick-create="quickCreateOpen = true"
          @open-search="commandOpen = true"
        />
      </aside>

      <Sheet v-model:open="mobileNavOpen">
        <SheetContent side="left" class="p-0 w-[280px] flex flex-col">
          <SheetTitle class="sr-only">Navigation</SheetTitle>
          <SheetDescription class="sr-only">Main navigation menu.</SheetDescription>
          <Sidebar
            in-sheet
            @quick-create="quickCreateOpen = true; mobileNavOpen = false"
            @open-search="commandOpen = true; mobileNavOpen = false"
            @navigate="mobileNavOpen = false"
          />
        </SheetContent>
      </Sheet>

      <main class="flex-1 min-w-0 max-w-full flex flex-col overflow-x-hidden">
        <header class="flex items-center justify-between gap-2 px-3 lg:px-6 h-14 border-b sticky top-0 bg-background/90 backdrop-blur z-30">
          <div class="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="icon" class="lg:hidden h-9 w-9 shrink-0" aria-label="Open menu" @click="mobileNavOpen = true">
              <Menu class="h-4 w-4" />
            </Button>
            <div class="flex items-center gap-2 min-w-0">
              <div class="lg:hidden h-6 w-6 rounded-md bg-foreground flex items-center justify-center shrink-0">
                <Sparkles class="h-3 w-3 text-background" />
              </div>
              <span class="text-sm sm:text-base font-semibold truncate">{{ pageTitle }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              class="hidden md:inline-flex h-8 gap-2 text-muted-foreground"
              @click="commandOpen = true"
            >
              <Search class="h-3.5 w-3.5" />
              <span class="text-xs">Search…</span>
              <kbd class="text-[10px] px-1 py-0.5 rounded bg-muted font-sans">⌘K</kbd>
            </Button>
            <Button variant="ghost" size="icon" class="md:hidden h-9 w-9" aria-label="Search" @click="commandOpen = true">
              <Search class="h-4 w-4" />
            </Button>
            <a
              href="https://github.com/mamayevets/game-hosting-panel-demo"
              target="_blank"
              rel="noreferrer"
              class="h-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors px-2 gap-1.5 text-sm"
              aria-label="GitHub"
            >
              <Github class="h-4 w-4" />
              <span class="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </header>

        <RouterView v-slot="{ Component, route: r }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="r.fullPath" />
          </transition>
        </RouterView>
      </main>
    </div>

    <QuickCreateDialog v-model:open="quickCreateOpen" />
    <CommandPalette v-model:open="commandOpen" @quick-create="quickCreateOpen = true" />
    <Toaster position="top-right" rich-colors />
  </TooltipProvider>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
}
</style>
