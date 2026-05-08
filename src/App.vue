<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { useThemeStore } from '@/stores/theme'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const route = useRoute()
const isAuthLayout = computed(() => route.meta.layout === 'auth')

useThemeStore()
</script>

<template>
  <TooltipProvider>
    <div v-if="isAuthLayout">
      <RouterView />
    </div>
    <div v-else class="min-h-screen flex bg-background">
      <Sidebar />
      <main class="flex-1 overflow-y-auto">
        <RouterView v-slot="{ Component, route: r }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="r.fullPath" />
          </transition>
        </RouterView>
      </main>
    </div>
    <Toaster position="top-right" rich-colors />
  </TooltipProvider>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
