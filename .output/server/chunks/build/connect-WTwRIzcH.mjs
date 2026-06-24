import { defineComponent, ref, resolveComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { a as useI18n } from './server.mjs';
import { RefreshCw } from 'lucide-vue-next';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
  __name: "connect",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const loadingQr = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_phantom_skeleton = resolveComponent("phantom-skeleton");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 h-full flex flex-col items-center justify-center relative" }, _attrs))} data-v-169a560c><div class="max-w-4xl w-full bg-surface-container-low/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden" data-v-169a560c><div class="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" data-v-169a560c></div><div class="flex flex-col md:flex-row gap-12 items-center" data-v-169a560c><div class="flex-1 space-y-6" data-v-169a560c><div data-v-169a560c><h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight" data-v-169a560c>${ssrInterpolate(unref(t)("connect.title"))}</h2><p class="text-on-surface-variant" data-v-169a560c>${ssrInterpolate(unref(t)("connect.waiting"))}</p></div><div class="space-y-4" data-v-169a560c><div class="flex gap-4 items-start" data-v-169a560c><div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0" data-v-169a560c>1</div><p class="text-on-surface text-lg pt-1" data-v-169a560c>${ssrInterpolate(unref(t)("connect.instructions.step_1"))}</p></div><div class="flex gap-4 items-start" data-v-169a560c><div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0" data-v-169a560c>2</div><p class="text-on-surface text-lg pt-1" data-v-169a560c>${ssrInterpolate(unref(t)("connect.instructions.step_2"))}</p></div><div class="flex gap-4 items-start" data-v-169a560c><div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0" data-v-169a560c>3</div><p class="text-on-surface text-lg pt-1" data-v-169a560c>${ssrInterpolate(unref(t)("connect.instructions.step_3"))}</p></div><div class="flex gap-4 items-start" data-v-169a560c><div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0" data-v-169a560c>4</div><p class="text-on-surface text-lg pt-1" data-v-169a560c>${ssrInterpolate(unref(t)("connect.instructions.step_4"))}</p></div></div></div><div class="flex-1 flex flex-col items-center justify-center" data-v-169a560c><div class="relative w-72 h-72 bg-white rounded-xl p-4 shadow-xl mb-6" data-v-169a560c>`);
      if (loadingQr.value) {
        _push(`<div class="w-full h-full relative" data-v-169a560c>`);
        _push(ssrRenderComponent(_component_phantom_skeleton, {
          class: "w-full h-full rounded-lg",
          "base-color": "#f1f5f9",
          "highlight-color": "#e2e8f0"
        }, null, _parent));
        _push(`<div class="absolute inset-0 border-4 border-primary/50 rounded-lg animate-pulse" data-v-169a560c></div><div class="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_8px_2px_rgba(37,211,102,0.8)] animate-[scan_2s_ease-in-out_infinite]" data-v-169a560c></div></div>`);
      } else {
        _push(`<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg" data-v-169a560c> [QR CODE IMAGE HERE] </div>`);
      }
      _push(`</div><button class="px-6 py-3 bg-primary hover:bg-primary-fixed-dim text-surface font-semibold rounded-lg shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all flex items-center gap-2" data-v-169a560c>`);
      _push(ssrRenderComponent(unref(RefreshCw), {
        class: ["w-5 h-5", { "animate-spin": loadingQr.value }]
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("connect.refresh"))}</button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/connect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const connect = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-169a560c"]]);

export { connect as default };
//# sourceMappingURL=connect-WTwRIzcH.mjs.map
