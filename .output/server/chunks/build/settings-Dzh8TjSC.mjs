import { defineComponent, mergeProps, unref, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Wifi, Clock, Shield } from 'lucide-vue-next';
import { a as useI18n } from './server.mjs';
import { defineStore } from 'pinia';
import '../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'node:url';
import 'perfect-debounce';
import '@vue/shared';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const useSettingsStore = defineStore("settings", () => {
  const settings = ref({
    delayMin: 15,
    delayMax: 45,
    maxMessagesPerHour: 100,
    spintaxEnabled: true,
    whatsappEngine: "wuzapi",
    supportedEngines: ["wuzapi", "gowa"]
  });
  const loading = ref(false);
  const saved = ref(false);
  async function fetchSettings() {
    loading.value = true;
    try {
      const res = await $fetch("/api/settings");
      settings.value = res.data;
    } finally {
      loading.value = false;
    }
  }
  async function saveSettings() {
    loading.value = true;
    saved.value = false;
    try {
      await $fetch("/api/settings", { method: "PUT", body: settings.value });
      saved.value = true;
      setTimeout(() => {
        saved.value = false;
      }, 3e3);
    } finally {
      loading.value = false;
    }
  }
  return { settings, loading, saved, fetchSettings, saveSettings };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const store = useSettingsStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 space-y-8 animate-fade-in" }, _attrs))}><h1 class="text-3xl font-bold text-on-surface tracking-tight">${ssrInterpolate(unref(t)("nav.settings"))}</h1><div class="max-w-2xl space-y-6"><div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"><h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Wifi), { class: "w-5 h-5 text-primary" }, null, _parent));
      _push(` Motore WhatsApp </h2><div class="grid grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(unref(store).settings.supportedEngines, (eng) => {
        _push(`<button class="${ssrRenderClass([unref(store).settings.whatsappEngine === eng ? "border-primary bg-primary/10 text-on-surface" : "border-white/10 bg-white/5 text-on-surface-variant hover:border-white/20", "p-4 rounded-xl border text-left transition-all"])}"><p class="font-semibold text-sm">${ssrInterpolate(eng === "wuzapi" ? "WuzAPI" : "go-whatsapp (gowa)")}</p><p class="text-xs mt-1 opacity-70">${ssrInterpolate(eng === "wuzapi" ? "asternic/wuzapi" : "aldinokemal/go-whatsapp-web-multidevice")}</p></button>`);
      });
      _push(`<!--]--></div></div><div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"><h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Clock), { class: "w-5 h-5 text-secondary" }, null, _parent));
      _push(` Rate Limiting </h2><div class="grid grid-cols-2 gap-4"><div><label class="text-sm text-on-surface-variant font-medium">Ritardo Min (s)</label><input${ssrRenderAttr("value", unref(store).settings.delayMin)} type="number" min="5" max="300" class="w-full mt-1 p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none transition-colors"></div><div><label class="text-sm text-on-surface-variant font-medium">Ritardo Max (s)</label><input${ssrRenderAttr("value", unref(store).settings.delayMax)} type="number" min="10" max="600" class="w-full mt-1 p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none transition-colors"></div></div><div class="mt-4"><label class="text-sm text-on-surface-variant font-medium">Max Messaggi / Ora</label><input${ssrRenderAttr("value", unref(store).settings.maxMessagesPerHour)} type="number" min="1" max="1000" class="w-full mt-1 p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none transition-colors"></div></div><div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"><h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Shield), { class: "w-5 h-5 text-tertiary" }, null, _parent));
      _push(` Anti-Ban (Spintax) </h2><div class="flex items-center justify-between"><div><p class="text-sm text-on-surface font-medium">Variazione Testo Automatica</p><p class="text-xs text-on-surface-variant mt-1">Randomizza i messaggi usando sintassi {&#39;{&#39;}opzione1|opzione2{&#39;}&#39;}</p></div><button class="${ssrRenderClass([unref(store).settings.spintaxEnabled ? "bg-primary" : "bg-white/20", "w-12 h-7 rounded-full transition-colors relative"])}"><div class="${ssrRenderClass([unref(store).settings.spintaxEnabled ? "translate-x-6" : "translate-x-1", "w-5 h-5 bg-white rounded-full absolute top-1 transition-transform"])}"></div></button></div></div><div class="flex items-center gap-4"><button${ssrIncludeBooleanAttr(unref(store).loading) ? " disabled" : ""} class="px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all disabled:opacity-50">${ssrInterpolate(unref(store).loading ? "Salvando..." : "Salva Impostazioni")}</button>`);
      if (unref(store).saved) {
        _push(`<span class="text-sm text-primary font-medium animate-fade-in">\u2705 Salvato!</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-Dzh8TjSC.mjs.map
