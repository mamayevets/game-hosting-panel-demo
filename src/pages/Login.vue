<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('demo@godlike.host')
const password = ref('demo')
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  await new Promise((r) => setTimeout(r, 350))
  auth.login(email.value)
  router.push({ name: 'servers' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
    <div class="w-full max-w-md">
      <div class="text-center mb-6">
        <div class="h-12 w-12 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">G</div>
        <h1 class="mt-4 text-2xl font-bold">Welcome to Godlike</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to manage your game servers</p>
      </div>

      <div class="card p-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-medium mb-1">Email</label>
            <input v-model="email" type="email" required class="input" />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1">Password</label>
            <input v-model="password" type="password" required class="input" />
            <p class="text-[11px] text-slate-400 mt-1.5">Demo: any email and password will work.</p>
          </div>
          <button type="submit" :disabled="submitting" class="btn-primary w-full">
            {{ submitting ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-slate-400 mt-6">
        Concept demo by Mamay · UI for the Godlike full-stack interview
      </p>
    </div>
  </div>
</template>
