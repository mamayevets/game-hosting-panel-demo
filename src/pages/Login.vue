<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Gamepad2 } from 'lucide-vue-next'
import { motion } from 'motion-v'

const router = useRouter()
const auth = useAuthStore()

const email = ref('demo@godlike.host')
const password = ref('demo')
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  await new Promise((r) => setTimeout(r, 450))
  auth.login(email.value)
  router.push({ name: 'servers' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted/40 relative overflow-hidden">
    <div class="absolute inset-0 -z-10 opacity-40 dark:opacity-20" aria-hidden="true">
      <div class="absolute -top-1/2 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/30 blur-3xl" />
      <div class="absolute -bottom-1/2 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-3xl" />
    </div>

    <motion.div
      :initial="{ opacity: 0, y: 16 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeOut' }"
      class="w-full max-w-md"
    >
      <div class="text-center mb-6">
        <motion.div
          :initial="{ scale: 0.8, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          :transition="{ delay: 0.1, type: 'spring', stiffness: 200 }"
          class="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30 ring-1 ring-white/10"
        >
          <Gamepad2 class="h-7 w-7 text-primary-foreground" />
        </motion.div>
        <h1 class="mt-5 text-2xl font-bold tracking-tight">Welcome to Godlike</h1>
        <p class="text-sm text-muted-foreground mt-1.5">Sign in to manage your game servers</p>
      </div>

      <Card class="border-border/60 shadow-xl shadow-foreground/5 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <CardHeader class="pb-4">
          <CardTitle class="text-lg">Sign in</CardTitle>
          <CardDescription>Demo build · any email and password works.</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" required autocomplete="email" />
            </div>
            <div class="space-y-1.5">
              <Label for="password">Password</Label>
              <Input id="password" v-model="password" type="password" required autocomplete="current-password" />
            </div>
            <Button type="submit" class="w-full" :disabled="submitting">
              <Loader2 v-if="submitting" class="h-4 w-4 mr-1.5 animate-spin" />
              {{ submitting ? 'Signing in…' : 'Sign in' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p class="text-center text-xs text-muted-foreground/80 mt-6">
        Concept demo by Mamay · UI for the Godlike full-stack interview
      </p>
    </motion.div>
  </div>
</template>
