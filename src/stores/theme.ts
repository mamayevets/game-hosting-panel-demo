import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.add('dark')
  }
  return { mode: 'dark' as const }
})
