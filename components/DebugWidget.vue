<template>
  <div v-if="isOpen" class="fixed bottom-6 right-6 z-50 w-96 bg-surface-container-high/90 backdrop-blur-xl border border-error/20 rounded-xl shadow-2xl overflow-hidden flex flex-col">
    <!-- Header -->
    <div class="px-4 py-3 bg-error/10 border-b border-error/20 flex justify-between items-center cursor-pointer" @click="isCollapsed = !isCollapsed">
      <div class="flex items-center gap-2">
        <Bug class="w-4 h-4 text-error" />
        <span class="font-bold text-sm text-error">{{ t('debug.title') }}</span>
      </div>
      <div class="flex gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
      </div>
    </div>

    <!-- Body -->
    <div v-show="!isCollapsed" class="p-4 flex flex-col gap-4 max-h-96">
      <div class="flex gap-2">
        <button class="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-xs font-medium rounded border border-white/10 transition-colors">
          {{ t('debug.mock_connect') }}
        </button>
        <button class="flex-1 px-3 py-2 bg-error/20 hover:bg-error/30 text-error text-xs font-medium rounded border border-error/30 transition-colors">
          {{ t('debug.disconnect') }}
        </button>
      </div>
      
      <!-- Live Logs -->
      <div class="flex-1 bg-black/50 rounded p-3 overflow-y-auto font-mono text-[10px] text-green-400 space-y-1">
        <div v-for="(log, i) in logs" :key="i" class="opacity-80 hover:opacity-100">
          <span class="text-gray-500">[{{ log.time }}]</span> {{ log.msg }}
        </div>
      </div>
      
      <button @click="logs = []" class="w-full py-1.5 text-xs text-gray-400 hover:text-white transition-colors">
        {{ t('debug.clear_logs') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bug } from 'lucide-vue-next'
import { useI18n } from '#i18n'

const { t } = useI18n()
const isOpen = ref(true) // Should check env/config in app.vue, this component is only rendered if active
const isCollapsed = ref(false)

const logs = ref([
  { time: new Date().toLocaleTimeString(), msg: 'Nuxt Nitro Server Started' },
  { time: new Date().toLocaleTimeString(), msg: 'WuzAPI Engine initialized' },
  { time: new Date().toLocaleTimeString(), msg: 'Waiting for socket connection...' }
])

onMounted(() => {
  // Mock live logs for demonstration
  setInterval(() => {
    if (logs.value.length > 50) logs.value.shift()
    logs.value.push({ time: new Date().toLocaleTimeString(), msg: 'Ping system health: OK' })
  }, 5000)
})
</script>
