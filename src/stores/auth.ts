import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const email = ref<string | null>(localStorage.getItem('demo-email'))
  const isAuthenticated = computed(() => email.value !== null)

  function login(emailValue: string) {
    email.value = emailValue
    localStorage.setItem('demo-email', emailValue)
  }

  function logout() {
    email.value = null
    localStorage.removeItem('demo-email')
  }

  return { email, isAuthenticated, login, logout }
})
