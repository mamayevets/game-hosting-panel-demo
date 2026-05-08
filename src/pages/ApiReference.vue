<script setup lang="ts">
import { computed } from 'vue'
import { apiEndpoints } from '@/data/activity'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { toast } from 'vue-sonner'

const grouped = computed(() => {
  const map = new Map<string, typeof apiEndpoints>()
  for (const e of apiEndpoints) {
    if (!map.has(e.group)) map.set(e.group, [])
    map.get(e.group)!.push(e)
  }
  return [...map.entries()]
})

const methodClass: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10',
  POST: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/10',
  PATCH: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/10',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/10',
}

function copyPath(path: string) {
  navigator.clipboard.writeText(path)
  toast.success('Path copied')
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto space-y-6">
    <motion.header
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
      class="space-y-3"
    >
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight">API reference</h1>
        <p class="text-sm text-muted-foreground mt-1">REST endpoints for the hosting panel.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2">
        <Badge variant="outline" class="font-mono text-[11px] py-1.5 px-2.5 w-full sm:w-auto justify-center sm:justify-start">
          api.testpanel.dev
        </Badge>
        <Button variant="outline" size="sm" class="w-full sm:w-auto gap-1.5" @click="toast.message('Postman collection', { description: 'Generate ready-to-import collection in production.' })">
          <ExternalLink class="h-3.5 w-3.5" /> Postman collection
        </Button>
      </div>
    </motion.header>

    <motion.div :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4, delay: 0.05 }">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Authentication</CardTitle>
          <CardDescription class="text-xs">Send your API key in the Authorization header.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre class="text-[11px] sm:text-xs bg-muted/50 rounded-md border p-3 font-mono overflow-x-auto whitespace-pre"><code>curl https://api.testpanel.dev/v1/servers \
  -H "Authorization: Bearer glk_live_…"</code></pre>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div
      v-for="([group, endpoints], gi) in grouped"
      :key="group"
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.1 + 0.04 * gi }"
    >
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">{{ group }}</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <ul class="divide-y">
            <li
              v-for="e in endpoints"
              :key="e.method + e.path"
              class="p-3 sm:px-4 hover:bg-muted/40 transition-colors group"
            >
              <div class="flex items-center gap-2 mb-1">
                <Badge :class="methodClass[e.method]" class="font-mono text-[10px] uppercase border w-14 justify-center shrink-0">
                  {{ e.method }}
                </Badge>
                <code class="text-xs font-mono flex-1 min-w-0 break-all">{{ e.path }}</code>
                <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground shrink-0" @click="copyPath(e.path)">
                  <Copy class="h-3.5 w-3.5" />
                </Button>
              </div>
              <p class="text-[11px] text-muted-foreground ml-[60px]">{{ e.summary }}</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>
