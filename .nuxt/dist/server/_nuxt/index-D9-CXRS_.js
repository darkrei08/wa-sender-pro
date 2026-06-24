import { defineComponent, ref, computed, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode } from "vue/server-renderer";
import { Users, Megaphone, Send, TrendingUp } from "lucide-vue-next";
import { a as useI18n } from "../server.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/@nuxt/nitro-server/dist/runtime/h3-compat.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/klona/dist/index.mjs";
import "#internal/nuxt/paths";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/defu/dist/defu.mjs";
import { u as useWhatsappStore } from "./whatsapp-9cptPEWi.js";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/ofetch/dist/node.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/hookable/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/unctx/dist/index.mjs";
import "pinia";
import "vue-router";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/ufo/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/perfect-debounce/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/@unhead/vue/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/cookie-es/dist/index.mjs";
import "/home/ema/Scrivania/altri repooo/wa-sender-pro/node_modules/h3/dist/index.mjs";
import "@vue/devtools-api";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const waStore = useWhatsappStore();
    const stats = ref(null);
    const kpis = computed(() => [
      { label: t("dashboard.total_contacts"), value: stats.value?.totalContacts ?? "—", icon: Users, iconBg: "bg-primary/10", iconColor: "text-primary", glow: "bg-primary/20", sub: `${stats.value?.activeContacts ?? 0} attivi` },
      { label: t("dashboard.active_campaigns"), value: stats.value?.activeCampaigns ?? "—", icon: Megaphone, iconBg: "bg-secondary/10", iconColor: "text-secondary", glow: "bg-secondary/20" },
      { label: t("dashboard.messages_sent"), value: stats.value?.sentMessages ?? "—", icon: Send, iconBg: "bg-tertiary/10", iconColor: "text-tertiary", glow: "bg-tertiary/20", sub: `${stats.value?.failedMessages ?? 0} falliti` },
      { label: "Success Rate", value: stats.value ? `${stats.value.successRate}%` : "—", icon: TrendingUp, iconBg: "bg-primary/10", iconColor: "text-primary", glow: "bg-primary/20" }
    ]);
    function statusClass(status) {
      const map = {
        DRAFT: "bg-white/10 text-on-surface-variant",
        RUNNING: "bg-primary/20 text-primary",
        PAUSED: "bg-yellow-500/20 text-yellow-400",
        COMPLETED: "bg-tertiary/20 text-tertiary",
        FAILED: "bg-error/20 text-error"
      };
      return map[status] || map.DRAFT;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 space-y-8 animate-fade-in" }, _attrs))}><div><h1 class="text-3xl font-bold text-on-surface tracking-tight">${ssrInterpolate(unref(t)("nav.home"))}</h1><p class="text-on-surface-variant mt-1">${ssrInterpolate(unref(t)("dashboard.status"))}: WhatsApp ${ssrInterpolate(unref(waStore).statusLabel)}</p></div><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"><!--[-->`);
      ssrRenderList(kpis.value, (kpi) => {
        _push(`<div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all"><div class="${ssrRenderClass([kpi.glow, "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-60"])}"></div><div class="flex items-center gap-3 mb-3"><div class="${ssrRenderClass([kpi.iconBg, "w-10 h-10 rounded-xl flex items-center justify-center"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(kpi.icon), {
          class: ["w-5 h-5", kpi.iconColor]
        }, null), _parent);
        _push(`</div><span class="text-sm text-on-surface-variant font-medium">${ssrInterpolate(kpi.label)}</span></div><p class="text-3xl font-bold text-on-surface tracking-tight">${ssrInterpolate(kpi.value)}</p>`);
        if (kpi.sub) {
          _push(`<p class="text-xs text-on-surface-variant mt-1">${ssrInterpolate(kpi.sub)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"><h2 class="text-lg font-semibold text-on-surface mb-4">${ssrInterpolate(unref(t)("dashboard.recent_campaigns"))}</h2>`);
      if (stats.value?.recentCampaigns?.length) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(stats.value.recentCampaigns, (c) => {
          _push(`<div class="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><div><p class="font-medium text-on-surface text-sm">${ssrInterpolate(c.name)}</p><p class="text-xs text-on-surface-variant">${ssrInterpolate(c.template?.name)}</p></div><span class="${ssrRenderClass([statusClass(c.status), "px-3 py-1 text-xs font-bold rounded-full"])}">${ssrInterpolate(c.status)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-on-surface-variant text-sm">Nessuna campagna ancora.</p>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-D9-CXRS_.js.map
