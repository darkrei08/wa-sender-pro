import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const useWhatsappStore = defineStore("whatsapp", () => {
  const connected = ref(false);
  const loggedIn = ref(false);
  const phone = ref(null);
  const engine = ref("wuzapi");
  const qrCode = ref(null);
  const loading = ref(false);
  const statusLabel = computed(() => connected.value ? "connected" : "disconnected");
  async function fetchStatus() {
    try {
      const res = await $fetch("/api/whatsapp/status");
      connected.value = res.data.connected;
      loggedIn.value = res.data.loggedIn;
      phone.value = res.data.phone || null;
      engine.value = res.data.activeEngine;
    } catch {
    }
  }
  async function fetchQR() {
    loading.value = true;
    try {
      const res = await $fetch("/api/whatsapp/qr");
      qrCode.value = res.data.qrCode;
    } catch {
      qrCode.value = null;
    } finally {
      loading.value = false;
    }
  }
  async function disconnect() {
    await $fetch("/api/whatsapp/disconnect", { method: "POST" });
    connected.value = false;
    loggedIn.value = false;
    phone.value = null;
  }
  return { connected, loggedIn, phone, engine, qrCode, loading, statusLabel, fetchStatus, fetchQR, disconnect };
});

export { useWhatsappStore as u };
//# sourceMappingURL=whatsapp-9cptPEWi.mjs.map
