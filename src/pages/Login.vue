<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-vue-next'
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
  <div class="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div
        class="absolute inset-0 opacity-[0.07] dark:opacity-[0.04]"
        style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 24px 24px"
      />
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-foreground/[0.04] blur-3xl" />
    </div>

    <motion.div
      :initial="{ opacity: 0, y: 16 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeOut' }"
      class="w-full max-w-sm"
    >
      <div class="text-center mb-8">
        <motion.div
          :initial="{ scale: 0.85, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          :transition="{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }"
          class="h-11 w-11 mx-auto rounded-xl bg-foreground flex items-center justify-center"
        >
          <Sparkles class="h-5 w-5 text-background" />
        </motion.div>
        <h1 class="mt-5 text-xl font-semibold tracking-tight">Welcome back</h1>
        <p class="text-sm text-muted-foreground mt-1.5">Sign in to your Godlike hosting panel</p>
      </div>

      <Card>
        <CardHeader class="pb-4 space-y-1">
          <CardTitle class="text-base">Sign in</CardTitle>
          <CardDescription class="text-xs">Demo build · any email and password works</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-1.5">
              <Label for="email" class="text-xs">Email</Label>
              <Input id="email" v-model="email" type="email" required autocomplete="email" />
            </div>
            <div class="space-y-1.5">
              <Label for="password" class="text-xs">Password</Label>
              <Input id="password" v-model="password" type="password" required autocomplete="current-password" />
            </div>
            <Button type="submit" class="w-full" :disabled="submitting">
              <Loader2 v-if="submitting" class="h-4 w-4 mr-1.5 animate-spin" />
              {{ submitting ? 'Signing in…' : 'Sign in' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p class="text-center text-xs text-muted-foreground mt-6">
        Concept demo · UI for the Godlike full-stack interview
      </p>
    </motion.div>
  </div>
</template>
