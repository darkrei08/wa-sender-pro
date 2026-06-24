# WA Sender Pro

Dashboard premium per l'invio massivo e personalizzato di messaggi WhatsApp, progettata con un'architettura moderna, sicura e scalabile.

## 🚀 Tecnologie e Framework

Il progetto è costruito sfruttando le ultime tecnologie per garantire performance, sicurezza e una Developer Experience (DX) eccellente:

- **[Next.js 15](https://github.com/vercel/next.js)**: Framework React full-stack (App Router, Server Components).
- **[React 19](https://github.com/facebook/react)**: Ultima versione della libreria UI.
- **[Bun](https://github.com/oven-sh/bun)**: Runtime JavaScript ultra-veloce e gestore di pacchetti, utilizzato in sostituzione di Node.js e npm.
- **[phantom-ui](https://github.com/Aejkatappaja/phantom-ui)**: Web Component per skeleton loader structure-aware, per un'esperienza di caricamento fluida e indipendente dal framework.
- **[Hyperframes](https://github.com/heygen-com/hyperframes)**: Rendering UI e generazione video (previsto per l'esportazione di report visivi delle campagne).
- **Prisma + SQLite**: ORM typesafe con database leggero e portabile.
- **WuzAPI / go-whatsapp-web-multidevice (gowa)**: Motori backend WhatsApp in Go, basati su `whatsmeow`, per interfacciarsi con l'API Multi-Device di WhatsApp.

## 🔒 Sicurezza Integrata (Secure by Design)

Il progetto implementa rigorosamente le linee guida **OWASP Top 10** e **NIST CSF 2.0**:

- **A01: Broken Access Control**: Middleware per la protezione delle rotte, API key validation su `/api/*`.
- **A02: Cryptographic Failures**: Secret non esposti, policy strict HTTPS (HSTS).
- **A03: Injection**: Utilizzo di Prisma per prevenire SQLi, e validazione schema-first rigorosa tramite **Zod** su tutti gli input (inclusa sanitizzazione XSS stripping tags e validazione E.164 per i numeri di telefono). Prevenzione Server-Side Template Injection (SSTI).
- **A04: Insecure Design**: Rate limiting implementato via middleware per mitigare abusi e DoS.
- **A05: Security Misconfiguration**: Intestazioni HTTP di sicurezza complete (CSP, X-Frame-Options, no-sniff, etc.), disabilitazione `X-Powered-By`.
- **A09: Security Logging**: Logger strutturato per eventi di sicurezza (NIST CSF 2.0), con tracciamento di fallimenti auth, iniezioni bloccate, e limiti di rate.

## 📁 Struttura del Progetto

- `/app`: Pagine e API routes (Next.js App Router).
- `/lib`: Utility core, client DB (`db.ts`), validazione (`validation.ts`), logger di sicurezza (`security-logger.ts`), e astrazione WhatsApp (`whatsapp-engine.ts`).
- `/prisma`: Schema del database SQLite e migrazioni.

## 🛠️ Avvio Rapido

1. Installa [Bun](https://bun.sh).
2. Clona il repository.
3. Installa le dipendenze: `bun install`.
4. Configura l'ambiente: copia `.env.example` in `.env` e compila i valori (es. `APP_SECRET`).
5. Inizializza il database: `bun run db:push`.
6. Avvia l'ambiente di sviluppo (con WuzAPI via Docker):
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   bun run dev
   ```

## 🧠 Knowledge Base & Workflow

Questo progetto utilizza **Graphify** per mantenere un grafo di conoscenza semantica del codice, integrandosi con **wiki-brain** e le skill di memoria di Claude per un miglioramento continuo del contesto nelle sessioni di sviluppo. Segue il workflow `auto-workflow` e `spec-kit` per garantire qualità e stabilità.
