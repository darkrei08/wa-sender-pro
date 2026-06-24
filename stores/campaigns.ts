/**
 * Campaigns Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Campaign {
  id: string
  name: string
  status: string
  templateId: string
  template?: { name: string }
  totalCount: number
  sentCount: number
  failedCount: number
  delayMin: number
  delayMax: number
  startedAt?: string | null
  completedAt?: string | null
  createdAt: string
}

interface CampaignProgress {
  id: string
  status: string
  totalCount: number
  sentCount: number
  failedCount: number
  progress: number
  isActive: boolean
}

export const useCampaignsStore = defineStore('campaigns', () => {
  const campaigns = ref<Campaign[]>([])
  const loading = ref(false)
  const activeProgress = ref<CampaignProgress | null>(null)
  let pollInterval: ReturnType<typeof setInterval> | null = null

  const activeCampaign = computed(() => campaigns.value.find(c => c.status === 'RUNNING'))

  async function fetchCampaigns() {
    loading.value = true
    try {
      const res = await $fetch<{ data: Campaign[] }>('/api/campaigns', { query: { limit: 100 } })
      campaigns.value = res.data
    } finally { loading.value = false }
  }

  async function createCampaign(data: Record<string, unknown>) {
    const res = await $fetch<{ data: Campaign }>('/api/campaigns', { method: 'POST', body: data })
    await fetchCampaigns()
    return res.data
  }

  async function startCampaign(id: string) {
    await $fetch(`/api/campaigns/${id}/start`, { method: 'POST' })
    startPolling(id)
    await fetchCampaigns()
  }

  async function pauseCampaign(id: string) {
    await $fetch(`/api/campaigns/${id}/pause`, { method: 'POST' })
    stopPolling()
    await fetchCampaigns()
  }

  async function pollProgress(id: string) {
    try {
      const res = await $fetch<{ data: CampaignProgress }>(`/api/campaigns/${id}/status`)
      activeProgress.value = res.data
      if (!res.data.isActive && res.data.status !== 'RUNNING') {
        stopPolling()
        await fetchCampaigns()
      }
    } catch { /* silent */ }
  }

  function startPolling(id: string) {
    stopPolling()
    pollProgress(id)
    pollInterval = setInterval(() => pollProgress(id), 3000)
  }

  function stopPolling() {
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
    activeProgress.value = null
  }

  return { campaigns, loading, activeProgress, activeCampaign, fetchCampaigns, createCampaign, startCampaign, pauseCampaign, startPolling, stopPolling }
})
