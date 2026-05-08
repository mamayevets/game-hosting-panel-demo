import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const stored = localStorage.getItem('demo-theme') as 'light' | 'dark' | null
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const mode = ref<'light' | 'dark'>(stored ?? (prefersDark ? 'dark' : 'light'))

  function apply() {
    document.documentElement.classList.toggle('dark', mode.value === 'dark')
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  watch(mode, (m) => {
    localStorage.setItem('demo-theme', m)
    apply()
  }, { immediate: true })

  return { mode, toggle }
})
