import { _ as __nuxt_component_0 } from './nuxt-link-DBTyGJgm.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { LayoutDashboard, QrCode, Users, Megaphone, Sun, Moon, Settings, Activity } from 'lucide-vue-next';
import { a as useI18n, c as useLocalePath, d as useSwitchLocalePath, b as useState } from './server.mjs';
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

const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const switchLocalePath = useSwitchLocalePath();
    const colorMode = useColorMode();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-surface dark:bg-[#12161f] text-on-surface transition-colors duration-300 flex" }, _attrs))}><aside class="w-[280px] bg-surface-container/50 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between"><div class="p-6"><h1 class="text-xl font-bold text-primary mb-8 tracking-tighter">WA Sender Pro</h1><nav class="space-y-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors",
        "exact-active-class": "bg-primary/10 text-primary border-l-2 border-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LayoutDashboard), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(`<span class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(t)("nav.home"))}</span>`);
          } else {
            return [
              createVNode(unref(LayoutDashboard), { class: "w-5 h-5" }),
              createVNode("span", { class: "font-medium text-sm" }, toDisplayString(unref(t)("nav.home")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/connect"),
        class: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors",
        "active-class": "bg-primary/10 text-primary border-l-2 border-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(QrCode), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(`<span class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(t)("connect.title"))}</span>`);
          } else {
            return [
              createVNode(unref(QrCode), { class: "w-5 h-5" }),
              createVNode("span", { class: "font-medium text-sm" }, toDisplayString(unref(t)("connect.title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/contacts"),
        class: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors",
        "active-class": "bg-primary/10 text-primary border-l-2 border-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Users), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(`<span class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(t)("nav.contacts"))}</span>`);
          } else {
            return [
              createVNode(unref(Users), { class: "w-5 h-5" }),
              createVNode("span", { class: "font-medium text-sm" }, toDisplayString(unref(t)("nav.contacts")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/campaigns"),
        class: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors",
        "active-class": "bg-primary/10 text-primary border-l-2 border-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Megaphone), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(`<span class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(t)("nav.campaigns"))}</span>`);
          } else {
            return [
              createVNode(unref(Megaphone), { class: "w-5 h-5" }),
              createVNode("span", { class: "font-medium text-sm" }, toDisplayString(unref(t)("nav.campaigns")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div><div class="p-6 border-t border-white/5 space-y-4"><div class="flex items-center justify-between"><button class="p-2 rounded-full hover:bg-white/5 transition-colors">`);
      if (unref(colorMode).value === "dark") {
        _push(ssrRenderComponent(unref(Sun), { class: "w-5 h-5 text-gray-400" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { class: "w-5 h-5 text-gray-400" }, null, _parent));
      }
      _push(`</button><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(switchLocalePath)("en"),
        class: ["text-xs font-bold px-2 py-1 rounded", unref(locale) === "en" ? "bg-primary text-surface" : "text-gray-400 hover:text-white"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`EN`);
          } else {
            return [
              createTextVNode("EN")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(switchLocalePath)("it"),
        class: ["text-xs font-bold px-2 py-1 rounded", unref(locale) === "it" ? "bg-primary text-surface" : "text-gray-400 hover:text-white"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`IT`);
          } else {
            return [
              createTextVNode("IT")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><nav class="space-y-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/settings"),
        class: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors",
        "active-class": "bg-primary/10 text-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Settings), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(`<span class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(t)("nav.settings"))}</span>`);
          } else {
            return [
              createVNode(unref(Settings), { class: "w-5 h-5" }),
              createVNode("span", { class: "font-medium text-sm" }, toDisplayString(unref(t)("nav.settings")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/api-status"),
        class: "flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors",
        "active-class": "bg-primary/10 text-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Activity), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(`<span class="font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(t)("nav.api_status"))}</span>`);
          } else {
            return [
              createVNode(unref(Activity), { class: "w-5 h-5" }),
              createVNode("span", { class: "font-medium text-sm" }, toDisplayString(unref(t)("nav.api_status")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></aside><main class="flex-1 overflow-auto relative">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BRAJ10Kz.mjs.map
