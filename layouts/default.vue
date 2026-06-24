<template>
  <div class="min-h-screen bg-surface dark:bg-[#12161f] text-on-surface transition-colors duration-300 flex">
    <!-- Sidebar -->
    <aside class="w-[280px] bg-surface-container/50 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between">
      <div class="p-6">
        <h1 class="text-xl font-bold text-primary mb-8 tracking-tighter">WA Sender Pro</h1>
        <nav class="space-y-2">
          <NuxtLink :to="localePath('/')" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors" exact-active-class="bg-primary/10 text-primary border-l-2 border-primary">
            <LayoutDashboard class="w-5 h-5" />
            <span class="font-medium text-sm">{{ t('nav.home') }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/connect')" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors" active-class="bg-primary/10 text-primary border-l-2 border-primary">
            <QrCode class="w-5 h-5" />
            <span class="font-medium text-sm">{{ t('connect.title') }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/contacts')" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors" active-class="bg-primary/10 text-primary border-l-2 border-primary">
            <Users class="w-5 h-5" />
            <span class="font-medium text-sm">{{ t('nav.contacts') }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/campaigns')" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors" active-class="bg-primary/10 text-primary border-l-2 border-primary">
            <Megaphone class="w-5 h-5" />
            <span class="font-medium text-sm">{{ t('nav.campaigns') }}</span>
          </NuxtLink>
        </nav>
      </div>

      <div class="p-6 border-t border-white/5 space-y-4">
        <!-- Theme & Lang Switcher -->
        <div class="flex items-center justify-between">
          <button @click="toggleColorMode" class="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Sun v-if="colorMode.value === 'dark'" class="w-5 h-5 text-gray-400" />
            <Moon v-else class="w-5 h-5 text-gray-400" />
          </button>
          
          <div class="flex gap-2">
            <NuxtLink :to="switchLocalePath('en')" class="text-xs font-bold px-2 py-1 rounded" :class="locale === 'en' ? 'bg-primary text-surface' : 'text-gray-400 hover:text-white'">EN</NuxtLink>
            <NuxtLink :to="switchLocalePath('it')" class="text-xs font-bold px-2 py-1 rounded" :class="locale === 'it' ? 'bg-primary text-surface' : 'text-gray-400 hover:text-white'">IT</NuxtLink>
          </div>
        </div>

        <nav class="space-y-2">
          <NuxtLink :to="localePath('/settings')" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors" active-class="bg-primary/10 text-primary">
            <Settings class="w-5 h-5" />
            <span class="font-medium text-sm">{{ t('nav.settings') }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/api-status')" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors" active-class="bg-primary/10 text-primary">
            <Activity class="w-5 h-5" />
            <span class="font-medium text-sm">{{ t('nav.api_status') }}</span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-auto relative">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Users, Megaphone, Settings, Activity, QrCode, Sun, Moon } from 'lucide-vue-next'
import { useI18n, useLocalePath, useSwitchLocalePath } from '#i18n'
import { useColorMode } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
