# WA Sender Pro - Project Memory & Context Tracking

> Questo file è utilizzato dal sistema per mantenere il contesto tra diverse sessioni di sviluppo e agenti, integrandosi con `claude-mem` e `wiki-brain`.

## 📌 Stato Attuale (Giugno 2026)

- **Progetto:** Dashboard per invio massivo WhatsApp (WA Sender Pro).
- **Architettura:** Next.js 15 (App Router), React 19, Bun, Prisma, SQLite.
- **Backend WhatsApp:** Astrazione doppia in `lib/whatsapp-engine.ts` per supportare sia `WuzAPI` (primario) che `go-whatsapp-web-multidevice` (fallback).
- **UI/UX:** Stile moderno (ispirazione Apple/Google, Glassmorphism, Colori WA). Skeleton loaders gestiti tramite `phantom-ui`.
- **Sicurezza:** Completamente allineato agli standard OWASP Top 10 e NIST CSF 2.0. Zod per la validazione di ogni input, middleware Next.js per HSTS, CSP, X-Frame-Options, e rate limiting. `security-logger.ts` implementato.

## 📝 Decisioni Architetturali (ADR)

1. **Bun invece di Node.js/npm:** Scelto per performance e gestione pacchetti integrata, come da skill `bun`.
2. **phantom-ui:** Scelto per gestire gli stati di caricamento senza dover duplicare componenti (skeleton-aware), in un ecosistema SSR-friendly.
3. **Hyperframes:** Integrato a livello di pacchetto per futura renderizzazione di report visivi/video.
4. **Validazione Schema-First (Zod):** Nessun endpoint API si fida dell'input utente. Validazione server-side stretta su tutto (incluso E.164 per numeri di telefono e tag stripping per XSS).

## 🚀 Prossimi Passi (Next Actions)

- [ ] Generare UI tramite Google Stitch utilizzando il prompt di design preparato.
- [ ] Implementare le dashboard frontend (Dashboard principale, Gestione Contatti, Templates, Campagne).
- [ ] Sviluppare lo script di migrazione dati da vecchi CSV (gestendo il caso "0.0" per i numeri di telefono mal formattati).
- [ ] Completare l'integrazione di login/logout con l'engine WhatsApp tramite la UI.

## 🧠 Note per gli Agenti

- Rispettare sempre il workflow delineato in `auto-workflow`.
- Prima di eseguire il commit o creare una release, usare `auto-debug` e `auto-release`.
- Tutte le query al database *devono* passare tramite Prisma per evitare SQLi.
