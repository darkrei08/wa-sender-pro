<template>
  <div class="p-8 space-y-8 animate-fade-in">
    <h1 class="text-3xl font-bold text-on-surface tracking-tight">{{ t('nav.settings') }}</h1>

    <div class="max-w-2xl space-y-6">
      <!-- WhatsApp Engine -->
      <div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Wifi class="w-5 h-5 text-primary" /> Motore WhatsApp
        </h2>
        <div class="grid grid-cols-2 gap-3">
          <button v-for="eng in store.settings.supportedEngines" :key="eng"
                  @click="store.settings.whatsappEngine = eng as any"
                  class="p-4 rounded-xl border text-left transition-all"
                  :class="store.settings.whatsappEngine === eng
                    ? 'border-primary bg-primary/10 text-on-surface'
                    : 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/20'">
            <p class="font-semibold text-sm">{{ eng === 'wuzapi' ? 'WuzAPI' : 'go-whatsapp (gowa)' }}</p>
            <p class="text-xs mt-1 opacity-70">{{ eng === 'wuzapi' ? 'asternic/wuzapi' : 'aldinokemal/go-whatsapp-web-multidevice' }}</p>
          </button>
        </div>
      </div>

      <!-- Rate Limiting -->
      <div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Clock class="w-5 h-5 text-secondary" /> Rate Limiting
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-on-surface-variant font-medium">Ritardo Min (s)</label>
            <input v-model.number="store.settings.delayMin" type="number" min="5" max="300"
                   class="w-full mt-1 p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none transition-colors" />
          </div>
          <div>
            <label class="text-sm text-on-surface-variant font-medium">Ritardo Max (s)</label>
            <input v-model.number="store.settings.delayMax" type="number" min="10" max="600"
                   class="w-full mt-1 p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none transition-colors" />
          </div>
        </div>
        <div class="mt-4">
          <label class="text-sm text-on-surface-variant font-medium">Max Messaggi / Ora</label>
          <input v-model.number="store.settings.maxMessagesPerHour" type="number" min="1" max="1000"
                 class="w-full mt-1 p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none transition-colors" />
        </div>
      </div>

      <!-- Anti-Ban -->
      <div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Shield class="w-5 h-5 text-tertiary" /> Anti-Ban (Spintax)
        </h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-on-surface font-medium">Variazione Testo Automatica</p>
            <p class="text-xs text-on-surface-variant mt-1">Randomizza i messaggi usando sintassi {'{'}opzione1|opzione2{'}'}</p>
          </div>
          <button @click="store.settings.spintaxEnabled = !store.settings.spintaxEnabled"
                  class="w-12 h-7 rounded-full transition-colors relative"
                  :class="store.settings.spintaxEnabled ? 'bg-primary' : 'bg-white/20'">
            <div class="w-5 h-5 bg-white rounded-full absolute top-1 transition-transform"
                 :class="store.settings.spintaxEnabled ? 'translate-x-6' : 'translate-x-1'"></div>
          </button>
        </div>
      </div>

      <!-- Save -->
      <div class="flex items-center gap-4">
        <button @click="store.saveSettings" :disabled="store.loading"
                class="px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all disabled:opacity-50">
          {{ store.loading ? 'Salvando...' : 'Salva Impostazioni' }}
        </button>
        <span v-if="store.saved" class="text-sm text-primary font-medium animate-fade-in">✅ Salvato!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Wifi, Clock, Shield } from 'lucide-vue-next'
import { useI18n } from '#i18n'
import { useSettingsStore } from '~/stores/settings'

const { t } = useI18n()
const store = useSettingsStore()

onMounted(() => store.fetchSettings())
</script>
