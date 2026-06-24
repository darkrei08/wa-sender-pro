/**
 * WhatsApp Connection Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWhatsappStore = defineStore('whatsapp', () => {
  const connected = ref(false)
  const loggedIn = ref(false)
  const phone = ref<string | null>(null)
  const engine = ref('wuzapi')
  const qrCode = ref<string | null>(null)
  const loading = ref(false)

  const statusLabel = computed(() => connected.value ? 'connected' : 'disconnected')

  async function fetchStatus() {
    try {
      const res = await $fetch<{ data: any }>('/api/whatsapp/status')
      connected.value = res.data.connected
      loggedIn.value = res.data.loggedIn
      phone.value = res.data.phone || null
      engine.value = res.data.activeEngine
    } catch { /* silent */ }
  }

  async function fetchQR() {
    loading.value = true
    try {
      const res = await $fetch<{ data: any }>('/api/whatsapp/qr')
      qrCode.value = res.data.qrCode
    } catch { qrCode.value = null }
    finally { loading.value = false }
  }

  async function disconnect() {
    await $fetch('/api/whatsapp/disconnect', { method: 'POST' })
    connected.value = false
    loggedIn.value = false
    phone.value = null
  }

  return { connected, loggedIn, phone, engine, qrCode, loading, statusLabel, fetchStatus, fetchQR, disconnect }
})
