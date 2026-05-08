<script setup lang="ts">
import { ref } from 'vue'
import { faqs } from '@/data/activity'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown, MessageSquare, BookOpen, Headphones, ExternalLink } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const open = ref<number | null>(0)
const message = ref('')

function toggle(i: number) {
  open.value = open.value === i ? null : i
}

function sendMessage() {
  if (!message.value.trim()) return
  toast.success('Message sent', { description: 'A human replies within 2 hours during EU business hours.' })
  message.value = ''
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
    <header>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Help &amp; support</h1>
      <p class="text-sm text-muted-foreground mt-1">Common questions and a direct line to the on-call engineer.</p>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <motion.div
        v-for="(card, i) in [
          { title: 'Documentation', desc: 'Setup guides, plugin recipes, and migration playbooks.', icon: BookOpen, action: 'Open docs' },
          { title: 'Community', desc: 'Discord with 4k+ admins and our engineers active daily.', icon: MessageSquare, action: 'Join Discord' },
          { title: 'Priority support', desc: '24/7 on-call for Pro plans. Email + phone bridge.', icon: Headphones, action: 'Open ticket' },
        ]"
        :key="card.title"
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.04 * i }"
      >
        <Card class="h-full">
          <CardContent class="p-5 flex flex-col h-full">
            <div class="h-9 w-9 rounded-md bg-muted flex items-center justify-center mb-3">
              <component :is="card.icon" class="h-4 w-4" />
            </div>
            <p class="font-medium text-sm">{{ card.title }}</p>
            <p class="text-xs text-muted-foreground mt-1 flex-1">{{ card.desc }}</p>
            <Button variant="outline" size="sm" class="mt-4 w-full justify-start" @click="toast.message(card.action, { description: 'Hooked to the relevant URL in production.' })">
              {{ card.action }}
              <ExternalLink class="h-3 w-3 ml-auto" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Frequently asked questions</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <ul class="divide-y">
          <li v-for="(faq, i) in faqs" :key="i">
            <button class="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-muted/40 transition-colors" @click="toggle(i)">
              <span class="text-sm font-medium">{{ faq.q }}</span>
              <ChevronDown class="h-4 w-4 text-muted-foreground transition-transform shrink-0" :class="{ 'rotate-180': open === i }" />
            </button>
            <div v-if="open === i" class="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {{ faq.a }}
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Send a message</CardTitle>
        <CardDescription>Describe what's going on. The on-call engineer pages back within 2 hours during EU business hours, otherwise next business day.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="space-y-1.5">
          <Label for="msg" class="text-xs">Message</Label>
          <textarea
            id="msg"
            v-model="message"
            rows="4"
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="What's broken or confusing?"
          />
        </div>
        <div class="flex justify-end">
          <Button :disabled="!message.trim()" @click="sendMessage">Send</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
