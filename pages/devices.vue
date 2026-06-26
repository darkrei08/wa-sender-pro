<template>
  <div class="p-8 h-full flex flex-col">
    <!-- Blocker Message -->
    <div v-if="route.query.blocked" class="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3">
      <AlertCircle class="w-6 h-6 text-error flex-shrink-0" />
      <div>
        <h4 class="text-error font-semibold text-sm">Accesso bloccato</h4>
        <p class="text-error/80 text-sm">Devi connettere almeno un dispositivo WhatsApp per accedere a quella pagina.</p>
      </div>
    </div>

    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-on-surface">{{ t('nav.devices') }}</h2>
        <p class="text-on-surface-variant mt-1">Gestisci i dispositivi WhatsApp collegati al tuo team.</p>
      </div>
      <NuxtLink :to="localePath('/connect')" class="px-5 py-2.5 bg-primary hover:bg-primary-fixed-dim text-surface font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
        <Smartphone class="w-5 h-5" />
        Connetti Dispositivo
      </NuxtLink>
    </div>

    <!-- Devices Grid -->
    <div v-if="waStore.loading" class="flex-1 flex items-center justify-center">
      <Loader2 class="w-8 h-8 text-primary animate-spin" />
    </div>
    
    <div v-else-if="waStore.sessions.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
      <Smartphone class="w-16 h-16 text-on-surface-variant mb-4 opacity-50" />
      <h3 class="text-xl font-semibold mb-2">Nessun dispositivo</h3>
      <p class="text-on-surface-variant mb-6 text-center max-w-md">Non hai ancora collegato nessun dispositivo WhatsApp. Collegalo ora per sbloccare Rubrica, Campagne e Live Chat.</p>
      <NuxtLink :to="localePath('/connect')" class="px-5 py-2.5 bg-primary hover:bg-primary-fixed-dim text-surface font-semibold rounded-lg transition-colors flex items-center gap-2">
        <QrCode class="w-5 h-5" />
        Scansiona QR Code
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="session in waStore.sessions" :key="session.id" 
           class="bg-surface-container/50 backdrop-blur-md border rounded-2xl p-6 shadow-lg relative group transition-colors"
           :class="session.connected ? 'border-primary/20' : 'border-error/20'">
        
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl flex items-center justify-center" :class="session.connected ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'">
              <Smartphone class="w-6 h-6" />
            </div>
            <div>
              <h4 class="font-bold text-on-surface">{{ session.phone ? '+' + session.phone : 'In attesa...' }}</h4>
              <p class="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{{ session.engine }}</p>
            </div>
          </div>
          <div class="w-3 h-3 rounded-full shadow-sm" :class="session.connected ? 'bg-primary shadow-primary/50' : 'bg-error shadow-error/50'"></div>
        </div>

        <div class="space-y-2 mb-6">
          <div class="flex justify-between text-sm">
            <span class="text-on-surface-variant">Stato:</span>
            <span class="font-semibold" :class="session.connected ? 'text-primary' : 'text-error'">
              {{ session.connected ? 'Connesso' : 'Disconnesso' }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-on-surface-variant">Ultimo sync:</span>
            <span class="text-on-surface">{{ new Date(session.updatedAt).toLocaleTimeString() }}</span>
          </div>
        </div>

        <button @click="disconnectSession(session.id)" class="w-full py-2.5 border border-error/30 text-error hover:bg-error/10 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
          <LogOut class="w-4 h-4" />
          Disconnetti
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { Smartphone, LogOut, Loader2, QrCode, AlertCircle } from 'lucide-vue-next'
import { useI18n, useLocalePath } from '#i18n'
import { useWhatsappStore } from '~/stores/whatsapp'

const { t } = useI18n()
const localePath = useLocalePath()
const waStore = useWhatsappStore()
const route = useRoute()
const addToast = inject('addToast') as Function

const disconnectSession = async (tokenId: string) => {
  if (!confirm('Sei sicuro di voler disconnettere questo dispositivo?')) return
  try {
    await waStore.disconnect(tokenId)
    addToast('Dispositivo disconnesso', 'success')
  } catch (e) {
    addToast('Errore durante la disconnessione', 'error')
  }
}

onMounted(() => {
  waStore.fetchSessions()
})
</script>
