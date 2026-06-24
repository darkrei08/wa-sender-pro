import { defineComponent, ref, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { Clock, Cpu, HardDrive, Wifi, Terminal } from 'lucide-vue-next';
import { a as useI18n } from './server.mjs';
import { u as useWhatsappStore } from './whatsapp-9cptPEWi.mjs';
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
import 'pinia';
import 'perfect-debounce';
import '@vue/shared';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "api-status",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const waStore = useWhatsappStore();
    ref(null);
    const logs = ref([]);
    const metrics = ref([
      { label: "Uptime", value: "0s", icon: Clock },
      { label: "Engine", value: "WuzAPI", icon: Cpu },
      { label: "DB Size", value: "\u2014", icon: HardDrive }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 space-y-6 animate-fade-in" }, _attrs))}><h1 class="text-3xl font-bold text-on-surface tracking-tight">${ssrInterpolate(unref(t)("nav.api_status"))}</h1><div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden"><div class="${ssrRenderClass([unref(waStore).connected ? "bg-primary/20" : "bg-error/20", "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] pointer-events-none"])}"></div><div class="flex items-center justify-between"><div class="flex items-center gap-4"><div class="${ssrRenderClass([unref(waStore).connected ? "bg-primary/10" : "bg-error/10", "w-14 h-14 rounded-xl flex items-center justify-center"])}">`);
      _push(ssrRenderComponent(unref(Wifi), {
        class: ["w-7 h-7", unref(waStore).connected ? "text-primary" : "text-error"]
      }, null, _parent));
      _push(`</div><div><h2 class="text-xl font-bold text-on-surface">WhatsApp Engine</h2><p class="text-sm text-on-surface-variant">${ssrInterpolate(unref(waStore).engine.toUpperCase())} \u2014 ${ssrInterpolate(unref(waStore).connected ? "Connesso" : "Disconnesso")}</p></div></div><div class="flex items-center gap-3"><span class="${ssrRenderClass([unref(waStore).connected ? "bg-primary shadow-[0_0_10px_rgba(37,211,102,0.8)] animate-glow-pulse" : "bg-error shadow-[0_0_10px_rgba(255,59,48,0.8)]", "w-3 h-3 rounded-full"])}"></span><span class="${ssrRenderClass([unref(waStore).connected ? "text-primary" : "text-error", "text-sm font-semibold"])}">${ssrInterpolate(unref(waStore).connected ? "ONLINE" : "OFFLINE")}</span></div></div>`);
      if (unref(waStore).phone) {
        _push(`<div class="mt-4 p-3 bg-white/5 rounded-lg"><p class="text-sm text-on-surface-variant">Numero collegato: <span class="text-on-surface font-mono">+${ssrInterpolate(unref(waStore).phone)}</span></p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><!--[-->`);
      ssrRenderList(metrics.value, (metric) => {
        _push(`<div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5"><div class="flex items-center gap-2 mb-2">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(metric.icon), { class: "w-4 h-4 text-on-surface-variant" }, null), _parent);
        _push(`<span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">${ssrInterpolate(metric.label)}</span></div><p class="text-2xl font-bold text-on-surface">${ssrInterpolate(metric.value)}</p></div>`);
      });
      _push(`<!--]--></div><div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"><div class="px-4 py-3 border-b border-white/5 flex items-center justify-between"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Terminal), { class: "w-4 h-4 text-primary" }, null, _parent));
      _push(`<span class="text-sm font-semibold text-on-surface">Live Logs</span></div><button class="text-xs text-on-surface-variant hover:text-on-surface transition-colors"> Pulisci </button></div><div class="h-64 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-black/30"><!--[-->`);
      ssrRenderList(logs.value, (log, i) => {
        _push(`<div class="opacity-80 hover:opacity-100 transition-opacity"><span class="text-on-surface-variant/50">[${ssrInterpolate(log.time)}]</span><span class="${ssrRenderClass(log.level === "error" ? "text-error" : log.level === "warn" ? "text-yellow-400" : "text-primary")}">${ssrInterpolate(log.msg)}</span></div>`);
      });
      _push(`<!--]-->`);
      if (!logs.value.length) {
        _push(`<div class="text-on-surface-variant/50">In attesa di log...</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/api-status.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=api-status-DkA8qqQR.mjs.map
