# WaForge - Project Brain & State (Compressed)

> File di contesto persistente. Compresso e ottimizzato tramite best practices (cavemanv, sqz, lean-ctx).

## 📌 Identità & Architettura
- **Nome:** WaForge (ex WA Sender Pro).
- **Modello:** SaaS Multi-Tenant (B2B). I team/agenzie sono isolati tramite `teamId`.
- **Stack:** Nuxt 4 (Vue 3, Nitro) + PostgreSQL + Prisma v5.22.0.
- **UI/UX:** Design premium (Glassmorphism, TailwindCSS, Color Mode).
- **Core Engine:** Astrazione multi-provider WuzAPI / go-whatsapp-web-multidevice (in `lib/whatsapp-engine.ts`).

## 🧠 Stato dello Sviluppo & Risoluzioni (Giugno 2026)
- **Database Migrato:** Passaggio completato da SQLite a PostgreSQL.
- **Fix Prisma/Nitro:** Risolto conflitto fatale tra Prisma v7.8.0 e il bundler Nitro Edge. Prisma e `@prisma/client` sono stati stabilizzati alla **v5.22.0**, con `url` reimpostato nello `schema.prisma`. Questo assicura connessioni dirette (senza necessità di adapter o accelerateUrl) e previene crash runtime in HMR.
- **Autenticazione (API):** L'endpoint `/api/auth/register` è testato e funzionante. Crea correttamente l'utente, cifra la password (bcrypt), crea il `Team` associato, genera un `TeamMembership` (ruolo OWNER) e restituisce un cookie JWT contenente `userId` e `teamId`.

## 🚀 Prossimi Step Immediati (Next Actions)
1. **Frontend Auth:** Creare le pagine UI moderne per `/login` e `/register` (ispirate ai mockup premium).
2. **Auth Guard:** Implementare il middleware globale Nuxt (`middleware/auth.global.ts`) per proteggere il workspace (Dashboard, Rubrica, Campagne).
3. **Store Management:** Integrare Pinia (`stores/auth.ts`) per gestire l'idratazione dello stato utente/team al refresh della pagina tramite `/api/auth/me`.
4. **Isolamento API Backend:** Modificare tutti i controller CRUD (Contatti, Campagne, Connessione WA) per filtrare rigorosamente le query usando il `teamId` estratto dal JWT.

## ⚠️ Regole Invariabili (Constraints)
- **Niente Edge Client:** Evitare aggiornamenti di Prisma che impongano l'architettura edge senza driver adapter.
- **Data Leakage:** Nessuna query backend deve omettere la clausola `where: { teamId: user.teamId }`.
- **Workflow:** Pianificare (Plan), Eseguire, Verificare prima di confermare.
