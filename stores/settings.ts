/**
 * Settings Store
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface AppSettings {
  delayMin: number
  delayMax: number
  maxMessagesPerHour: number
  spintaxEnabled: boolean
  whatsappEngine: 'wuzapi' | 'gowa'
  supportedEngines: string[]
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({
    delayMin: 15,
    delayMax: 45,
    maxMessagesPerHour: 100,
    spintaxEnabled: true,
    whatsappEngine: 'wuzapi',
    supportedEngines: ['wuzapi', 'gowa'],
  })
  const loading = ref(false)
  const saved = ref(false)

  async function fetchSettings() {
    loading.value = true
    try {
      const res = await $fetch<{ data: AppSettings }>('/api/settings')
      settings.value = res.data
    } finally { loading.value = false }
  }

  async function saveSettings() {
    loading.value = true
    saved.value = false
    try {
      await $fetch('/api/settings', { method: 'PUT', body: settings.value })
      saved.value = true
      setTimeout(() => { saved.value = false }, 3000)
    } finally { loading.value = false }
  }

  return { settings, loading, saved, fetchSettings, saveSettings }
})
