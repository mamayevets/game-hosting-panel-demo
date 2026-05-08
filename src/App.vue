<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { useThemeStore } from './stores/theme'

const route = useRoute()
const isAuthLayout = computed(() => route.meta.layout === 'auth')

useThemeStore() // initialize theme on mount
</script>

<template>
  <div v-if="isAuthLayout">
    <RouterView />
  </div>
  <div v-else class="min-h-screen flex bg-slate-50 dark:bg-slate-950">
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
