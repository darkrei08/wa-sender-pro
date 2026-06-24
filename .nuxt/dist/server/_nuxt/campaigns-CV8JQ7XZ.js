import { ref, computed, defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { Plus, Play, Pause } from "lucide-vue-next";
import { a as useI18n } from "../server.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/@nuxt/nitro-server/dist/runtime/h3-compat.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/klona/dist/index.mjs";
import "#internal/nuxt/paths";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/defu/dist/defu.mjs";
import { defineStore } from "pinia";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/ofetch/dist/node.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/hookable/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/unctx/dist/index.mjs";
import "vue-router";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/ufo/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/perfect-debounce/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/@unhead/vue/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/cookie-es/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/h3/dist/index.mjs";
import "@vue/devtools-api";
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const useCampaignsStore = defineStore("campaigns", () => {
  const campaigns = ref([]);
  const loading = ref(false);
  const activeProgress = ref(null);
  let pollInterval = null;
  const activeCampaign = computed(() => campaigns.value.find((c) => c.status === "RUNNING"));
  async function fetchCampaigns() {
    loading.value = true;
    try {
      const res = await $fetch("/api/campaigns", { query: { limit: 100 } });
      campaigns.value = res.data;
    } finally {
      loading.value = false;
    }
  }
  async function createCampaign(data) {
    const res = await $fetch("/api/campaigns", { method: "POST", body: data });
    await fetchCampaigns();
    return res.data;
  }
  async function startCampaign(id) {
    await $fetch(`/api/campaigns/${id}/start`, { method: "POST" });
    startPolling(id);
    await fetchCampaigns();
  }
  async function pauseCampaign(id) {
    await $fetch(`/api/campaigns/${id}/pause`, { method: "POST" });
    stopPolling();
    await fetchCampaigns();
  }
  async function pollProgress(id) {
    try {
      const res = await $fetch(`/api/campaigns/${id}/status`);
      activeProgress.value = res.data;
      if (!res.data.isActive && res.data.status !== "RUNNING") {
        stopPolling();
        await fetchCampaigns();
      }
    } catch {
    }
  }
  function startPolling(id) {
    stopPolling();
    pollProgress(id);
    pollInterval = setInterval();
  }
  function stopPolling() {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
    activeProgress.value = null;
  }
  return { campaigns, loading, activeProgress, activeCampaign, fetchCampaigns, createCampaign, startCampaign, pauseCampaign, startPolling, stopPolling };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "campaigns",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const store = useCampaignsStore();
    const showWizard = ref(false);
    const wizardStep = ref(1);
    const templates = ref([]);
    const newCampaign = ref({ name: "", templateId: "", delayMin: 15, delayMax: 45 });
    function statusClass(status) {
      const map = {
        DRAFT: "bg-white/10 text-on-surface-variant",
        RUNNING: "bg-primary/20 text-primary animate-glow-pulse",
        PAUSED: "bg-yellow-500/20 text-yellow-400",
        COMPLETED: "bg-tertiary/20 text-tertiary",
        FAILED: "bg-error/20 text-error"
      };
      return map[status] || map.DRAFT;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 space-y-6 animate-fade-in" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-3xl font-bold text-on-surface tracking-tight">${ssrInterpolate(unref(t)("nav.campaigns"))}</h1><button class="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Plus), { class: "w-5 h-5" }, null, _parent));
      _push(` Nuova Campagna </button></div>`);
      if (unref(store).activeProgress) {
        _push(`<div class="bg-surface-container/40 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 relative overflow-hidden"><div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 rounded-full blur-[80px] pointer-events-none"></div><div class="flex items-center justify-between mb-4"><div><h3 class="font-semibold text-on-surface">Campagna in corso</h3><p class="text-sm text-on-surface-variant">${ssrInterpolate(unref(store).activeProgress.sentCount + unref(store).activeProgress.failedCount)} / ${ssrInterpolate(unref(store).activeProgress.totalCount)}</p></div><span class="text-2xl font-bold text-primary">${ssrInterpolate(unref(store).activeProgress.progress)}%</span></div><div class="w-full bg-white/10 rounded-full h-2 overflow-hidden"><div class="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: unref(store).activeProgress.progress + "%" })}"></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-4">`);
      if (unref(store).loading) {
        _push(`<!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="bg-surface-container/40 border border-white/10 rounded-2xl p-6"><div class="h-5 bg-white/5 rounded w-1/3 animate-pulse mb-3"></div><div class="h-4 bg-white/5 rounded w-1/4 animate-pulse"></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(store).campaigns, (campaign) => {
          _push(`<div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"><div class="flex items-center justify-between"><div><h3 class="font-semibold text-on-surface text-lg">${ssrInterpolate(campaign.name)}</h3><p class="text-sm text-on-surface-variant mt-1">Template: ${ssrInterpolate(campaign.template?.name || "—")}</p></div><div class="flex items-center gap-3"><span class="${ssrRenderClass([statusClass(campaign.status), "px-3 py-1 text-xs font-bold rounded-full"])}">${ssrInterpolate(campaign.status)}</span>`);
          if (campaign.status === "DRAFT") {
            _push(`<button class="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">`);
            _push(ssrRenderComponent(unref(Play), { class: "w-4 h-4" }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          if (campaign.status === "RUNNING") {
            _push(`<button class="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-colors">`);
            _push(ssrRenderComponent(unref(Pause), { class: "w-4 h-4" }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex gap-6 mt-4 text-sm text-on-surface-variant"><span>📤 ${ssrInterpolate(campaign.sentCount)} inviati</span><span>❌ ${ssrInterpolate(campaign.failedCount)} falliti</span><span>⏱️ ${ssrInterpolate(campaign.delayMin)}–${ssrInterpolate(campaign.delayMax)}s delay</span></div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showWizard.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div class="w-full max-w-xl bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-in"><h3 class="text-lg font-bold text-on-surface mb-6">Crea Nuova Campagna</h3><div class="flex gap-2 mb-6"><!--[-->`);
          ssrRenderList(3, (s) => {
            _push2(`<div class="${ssrRenderClass([wizardStep.value >= s ? "bg-primary" : "bg-white/10", "flex-1 h-1 rounded-full transition-colors"])}"></div>`);
          });
          _push2(`<!--]--></div>`);
          if (wizardStep.value === 1) {
            _push2(`<div class="space-y-4"><label class="block text-sm font-medium text-on-surface-variant">Nome Campagna</label><input${ssrRenderAttr("value", newCampaign.value.name)} type="text" placeholder="Es: Promo Estate 2026" class="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none"></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (wizardStep.value === 2) {
            _push2(`<div class="space-y-4"><label class="block text-sm font-medium text-on-surface-variant">Template Messaggio</label><select class="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(newCampaign.value.templateId) ? ssrLooseContain(newCampaign.value.templateId, "") : ssrLooseEqual(newCampaign.value.templateId, "")) ? " selected" : ""}>Seleziona template...</option><!--[-->`);
            ssrRenderList(templates.value, (tmpl) => {
              _push2(`<option${ssrRenderAttr("value", tmpl.id)}${ssrIncludeBooleanAttr(Array.isArray(newCampaign.value.templateId) ? ssrLooseContain(newCampaign.value.templateId, tmpl.id) : ssrLooseEqual(newCampaign.value.templateId, tmpl.id)) ? " selected" : ""}>${ssrInterpolate(tmpl.name)}</option>`);
            });
            _push2(`<!--]--></select></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (wizardStep.value === 3) {
            _push2(`<div class="space-y-4"><label class="block text-sm font-medium text-on-surface-variant">Ritardo tra messaggi (secondi)</label><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-on-surface-variant">Min</label><input${ssrRenderAttr("value", newCampaign.value.delayMin)} type="number" min="5" max="300" class="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none"></div><div><label class="text-xs text-on-surface-variant">Max</label><input${ssrRenderAttr("value", newCampaign.value.delayMax)} type="number" min="10" max="600" class="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm focus:border-primary outline-none"></div></div><p class="text-xs text-on-surface-variant">Contatti: TUTTI</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex justify-between mt-6"><button class="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">${ssrInterpolate(wizardStep.value > 1 ? "← Indietro" : "Annulla")}</button>`);
          if (wizardStep.value < 3) {
            _push2(`<button${ssrIncludeBooleanAttr(wizardStep.value === 1 && !newCampaign.value.name || wizardStep.value === 2 && !newCampaign.value.templateId) ? " disabled" : ""} class="px-5 py-2 bg-primary text-on-primary font-semibold rounded-lg transition-all disabled:opacity-30"> Avanti → </button>`);
          } else {
            _push2(`<button class="px-5 py-2 bg-primary text-on-primary font-semibold rounded-lg shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all"> Crea Campagna </button>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/campaigns.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=campaigns-CV8JQ7XZ.js.map
