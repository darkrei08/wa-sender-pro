# WA Sender Pro - Project Memory & Context Tracking

> Questo file è utilizzato dal sistema per mantenere il contesto tra diverse sessioni di sviluppo e agenti, integrandosi con `claude-mem`, `wiki-brain`, e tool di compressione (`sqz`).

## 📌 Stato Attuale (Giugno 2026)

- **Progetto:** Dashboard per invio massivo WhatsApp (WA Sender Pro).
- **Architettura (MIGRAZIONE IN CORSO):** Passaggio da Next.js a **Nuxt.js (Vue 3, Nitro)**.
- **Moduli Attivi:** `@nuxtjs/tailwindcss`, `@nuxtjs/color-mode` (Dark/Light), `@nuxtjs/i18n` (Multi-lingua IT/EN), `pinia` (State Management).
- **Backend WhatsApp:** Astrazione doppia in `lib/whatsapp-engine.ts` per supportare sia `WuzAPI` che `go-whatsapp-web-multidevice`.
- **UI/UX:** Stile moderno (Premium Apple/Google, Glassmorphism). Schermate generate con Google Stitch (Dashboard, Connect QR, Impostazioni, API Status). Skeleton loaders via `phantom-ui`.
- **Debug:** Implementato `DebugWidget.vue` fluttuante, visibile solo in ambiente dev.

## 📝 Decisioni Architetturali (ADR)

1. **Framework (Vue/Nuxt):** Scelto per reattività migliore e preferenza utente, mantenendo l'engine backend intatto.
2. **i18n & Theme:** Configurato a livello di root tramite moduli Nuxt per evitare re-render lenti.
3. **Database:** PostgreSQL con Prisma, logica migrata verso le API routes di Nitro (`server/api`). Include supporto Multi-Tenancy (Team).
4. **Validazione:** Zod per la sanificazione degli input (OWASP-compliant).

## 🚀 Prossimi Passi (Next Actions)

- [ ] Sviluppare interamente i componenti UI Vue basandosi sui mockup generati in Stitch.
- [ ] Completare il porting delle API da Next.js a Nuxt Nitro.
- [ ] Script di migrazione CSV per vecchi database (gestione float "0.0").

## 🧠 Workflow & Memory Compression

- Eseguito `ai-squeeze` per mantenere la history dei token ottimizzata.
- Rispettare sempre il workflow delineato in `auto-workflow`.
- Tutte le query al database *devono* passare tramite Prisma per evitare SQLi.
