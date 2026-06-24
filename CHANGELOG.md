# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-24

### Added
- **Architettura Core**: Configurazione iniziale del progetto in Next.js 15 (App Router) e React 19, in esecuzione su **Bun**.
- **Design System e UI**: Creazione del design system `Pro Connect` tramite Google Stitch, in stile Apple/Google con Dark Mode nativa e glassmorphism.
- **Skeleton Loaders**: Integrazione di `phantom-ui` per gestire elegantemente il caricamento asincrono.
- **Backend WhatsApp**: Strato di astrazione `whatsapp-engine.ts` per supportare `WuzAPI` e `go-whatsapp-web-multidevice`.
- **Database ORM**: Modelli Prisma con backend SQLite per Contatti, Campagne, Template e Messaggi.
- **Sicurezza (Secure by Design)**:
  - Protezione XSS e validazione rigorosa degli input tramite **Zod** (OWASP A03).
  - Rate Limiting e controllo degli abusi (OWASP A04).
  - Middleware di sicurezza Next.js con CSP, HSTS, X-Frame-Options (OWASP A05).
  - Logger di sicurezza strutturato basato su NIST CSF 2.0 (OWASP A09).
- **Knowledge Base**: Sistema di memoria e contestualizzazione avanzata con `wiki-brain`, `MEMORY.md`, e predisposizione per `Graphify`.


---

## [Unreleased]

## [0.1.0] - 2026-06-24

### Added
- Initial project scaffold with Next.js 14 (App Router + TypeScript)
- Docker Compose orchestration: Next.js + WuzAPI + SQLite volume
- Prisma ORM schema: contacts, campaigns, messages, templates
- Contact management: CRUD, CSV/Excel import, validation
- Message templates with dynamic variables (`{{Name}}`, `{{email}}`, etc.)
- Campaign Wizard: step-by-step bulk send with configurable rate limiting
- Real-time QR Code scan modal for WhatsApp connection
- Dashboard analytics: sent/failed stats, campaign history
- Migration script from legacy `wa sender v5` CSV format
- GitHub Actions CI/CD pipeline
- `.env.example` with all required environment variables

### Architecture
- Migrated from Selenium + Python monolith → WuzAPI (Go/whatsmeow) REST API
- No browser dependency: native WhatsApp Web protocol via whatsmeow
- Persistent session storage via Docker volumes

[0.1.0]: https://github.com/darkrei08/wa-sender-pro/releases/tag/v0.1.0
