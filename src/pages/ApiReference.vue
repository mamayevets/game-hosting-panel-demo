<script setup lang="ts">
import { computed } from 'vue'
import { apiEndpoints } from '@/data/activity'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  GET: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  POST: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  PATCH: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/30',
}

function copyPath(path: string) {
  navigator.clipboard.writeText(path)
  toast.success('Path copied')
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-5xl mx-auto">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight">API reference</h1>
        <p class="text-sm text-muted-foreground mt-1">REST endpoints for the hosting panel · base URL <code class="text-xs px-1 py-0.5 bg-muted rounded">https://api.testpanel.dev</code></p>
      </div>
      <Button variant="outline" class="self-start sm:self-auto" @click="toast.message('Postman collection', { description: 'Generate ready-to-import collection in production.' })">
        <ExternalLink class="h-4 w-4 mr-1.5" /> Postman collection
      </Button>
    </header>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">Authentication</CardTitle>
        <CardDescription>Send your API key in the Authorization header. Keys are scoped per-workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <pre class="text-xs bg-muted/50 rounded-md border p-3 font-mono overflow-x-auto"><code>curl https://api.testpanel.dev/v1/servers \
  -H "Authorization: Bearer glk_live_…"</code></pre>
      </CardContent>
    </Card>

    <motion.div
      v-for="([group, endpoints], gi) in grouped"
      :key="group"
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.35, delay: 0.05 * gi }"
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
              class="px-4 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors group"
            >
              <Badge :class="methodClass[e.method]" class="font-mono text-[10px] uppercase border w-14 justify-center shrink-0">
                {{ e.method }}
              </Badge>
              <code class="text-xs font-mono flex-1 min-w-0 truncate">{{ e.path }}</code>
              <span class="hidden sm:inline text-xs text-muted-foreground flex-1 min-w-0 truncate">{{ e.summary }}</span>
              <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition" @click="copyPath(e.path)">
                <Copy class="h-3.5 w-3.5" />
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>
