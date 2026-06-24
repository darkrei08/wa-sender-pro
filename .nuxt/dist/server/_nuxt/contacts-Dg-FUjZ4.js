import { ref, computed, defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrRenderTeleport } from "vue/server-renderer";
import { Trash2, Upload, Search } from "lucide-vue-next";
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
const useContactsStore = defineStore("contacts", () => {
  const contacts = ref([]);
  const pagination = ref({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const search = ref("");
  const loading = ref(false);
  const selected = ref(/* @__PURE__ */ new Set());
  const hasSelection = computed(() => selected.value.size > 0);
  async function fetchContacts(page = 1) {
    loading.value = true;
    try {
      const res = await $fetch("/api/contacts", {
        query: { page, limit: pagination.value.limit, search: search.value || void 0 }
      });
      contacts.value = res.data;
      pagination.value = res.pagination;
    } finally {
      loading.value = false;
    }
  }
  async function createContact(data) {
    const res = await $fetch("/api/contacts", { method: "POST", body: data });
    await fetchContacts(pagination.value.page);
    return res.data;
  }
  async function importCSV(csv) {
    const res = await $fetch("/api/contacts/import", { method: "POST", body: { csv } });
    await fetchContacts(1);
    return res.data;
  }
  async function deleteContacts(ids) {
    await $fetch("/api/contacts/bulk-delete", { method: "POST", body: { ids } });
    selected.value.clear();
    await fetchContacts(pagination.value.page);
  }
  function toggleSelect(id) {
    if (selected.value.has(id)) selected.value.delete(id);
    else selected.value.add(id);
  }
  function selectAll() {
    contacts.value.forEach((c) => selected.value.add(c.id));
  }
  function clearSelection() {
    selected.value.clear();
  }
  return { contacts, pagination, search, loading, selected, hasSelection, fetchContacts, createContact, importCSV, deleteContacts, toggleSelect, selectAll, clearSelection };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contacts",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const store = useContactsStore();
    const showImport = ref(false);
    const csvText = ref("");
    const importResult = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 space-y-6 animate-fade-in" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-on-surface tracking-tight">${ssrInterpolate(unref(t)("nav.contacts"))}</h1><p class="text-on-surface-variant mt-1">${ssrInterpolate(unref(store).pagination.total)} contatti totali</p></div><div class="flex gap-3">`);
      if (unref(store).hasSelection) {
        _push(`<button class="px-4 py-2.5 bg-error/20 hover:bg-error/30 text-error text-sm font-semibold rounded-lg border border-error/30 transition-all">`);
        _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4 inline mr-1" }, null, _parent));
        _push(` Elimina (${ssrInterpolate(unref(store).selected.size)}) </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-on-surface text-sm font-semibold rounded-lg border border-white/10 transition-all">`);
      _push(ssrRenderComponent(unref(Upload), { class: "w-4 h-4 inline mr-1" }, null, _parent));
      _push(` Importa CSV </button></div></div><div class="relative max-w-md">`);
      _push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(store).search)} type="text" placeholder="Cerca contatti..." class="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-white/10 rounded-lg text-on-surface text-sm placeholder-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"></div><div class="bg-surface-container/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"><table class="w-full"><thead><tr class="border-b border-white/5"><th class="p-4 text-left"><input type="checkbox"${ssrIncludeBooleanAttr(unref(store).selected.size === unref(store).contacts.length && unref(store).contacts.length > 0) ? " checked" : ""} class="rounded border-white/20 bg-white/5"></th><th class="p-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nome</th><th class="p-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Telefono</th><th class="p-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email</th><th class="p-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Azienda</th><th class="p-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Stato</th></tr></thead><tbody>`);
      if (unref(store).loading) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<tr class="border-b border-white/5"><td colspan="6" class="p-4"><div class="h-4 bg-white/5 rounded animate-pulse"></div></td></tr>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(store).contacts, (contact) => {
          _push(`<tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="p-4"><input type="checkbox"${ssrIncludeBooleanAttr(unref(store).selected.has(contact.id)) ? " checked" : ""} class="rounded border-white/20 bg-white/5"></td><td class="p-4 text-sm font-medium text-on-surface">${ssrInterpolate(contact.name)}</td><td class="p-4 text-sm text-on-surface-variant font-mono">${ssrInterpolate(contact.prefix)}${ssrInterpolate(contact.phone)}</td><td class="p-4 text-sm text-on-surface-variant">${ssrInterpolate(contact.email || "—")}</td><td class="p-4 text-sm text-on-surface-variant">${ssrInterpolate(contact.company || "—")}</td><td class="p-4"><span class="${ssrRenderClass([contact.isActive ? "bg-primary/20 text-primary" : "bg-white/10 text-on-surface-variant", "px-2 py-1 text-xs font-bold rounded-full"])}">${ssrInterpolate(contact.isActive ? "Attivo" : "Inattivo")}</span></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table><div class="flex items-center justify-between p-4 border-t border-white/5"><p class="text-sm text-on-surface-variant"> Pagina ${ssrInterpolate(unref(store).pagination.page)} di ${ssrInterpolate(unref(store).pagination.totalPages)}</p><div class="flex gap-2"><button${ssrIncludeBooleanAttr(unref(store).pagination.page <= 1) ? " disabled" : ""} class="px-3 py-1.5 text-sm bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"> ← Prec </button><button${ssrIncludeBooleanAttr(unref(store).pagination.page >= unref(store).pagination.totalPages) ? " disabled" : ""} class="px-3 py-1.5 text-sm bg-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"> Succ → </button></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showImport.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div class="w-full max-w-lg bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-in"><h3 class="text-lg font-bold text-on-surface mb-4">Importa Contatti da CSV</h3><textarea rows="8" placeholder="Incolla il contenuto CSV qui..." class="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-on-surface text-sm font-mono placeholder-on-surface-variant/50 focus:border-primary outline-none">${ssrInterpolate(csvText.value)}</textarea>`);
          if (importResult.value) {
            _push2(`<div class="mt-3 p-3 rounded-lg bg-primary/10 text-sm text-on-surface"> ✅ ${ssrInterpolate(importResult.value.imported)} importati, ${ssrInterpolate(importResult.value.skipped)} saltati, ${ssrInterpolate(importResult.value.errors?.length || 0)} errori </div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex justify-end gap-3 mt-4"><button class="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">Annulla</button><button${ssrIncludeBooleanAttr(!csvText.value.trim()) ? " disabled" : ""} class="px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-fixed-dim transition-all disabled:opacity-30"> Importa </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contacts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=contacts-Dg-FUjZ4.js.map
