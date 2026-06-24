/**
 * SECURITY MIDDLEWARE — OWASP A01 + A07 + NIST CSF 2.0
 *
 * Protects all /dashboard/* and /api/* routes:
 * - API key validation on /api/* (OWASP A07 — Auth Failures)
 * - Rate limiting via headers (OWASP A04 — Insecure Design)
 * - Request ID injection for audit trail (NIST CSF ID.AM)
 * - Suspicious pattern detection (OWASP A03 — Injection)
 */

import { NextRequest, NextResponse } from 'next/server'

// ── Constants ─────────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000   // 1 minute
const RATE_LIMIT_MAX       = 120      // requests per window
const API_SECRET_HEADER    = 'x-api-key'

// In-memory store (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

// OWASP A03 — detect injection patterns in URL/query
const INJECTION_PATTERNS = [
  /(<script|javascript:|on\w+=)/i,           // XSS
  /(union\s+select|drop\s+table|insert\s+into)/i, // SQLi
  /(\.\.|\/etc\/passwd|\/proc\/)/i,          // Path traversal
  /(exec\(|eval\(|system\()/i,               // Command injection
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt }
}

function detectInjection(req: NextRequest): boolean {
  const url = decodeURIComponent(req.url)
  return INJECTION_PATTERNS.some(pattern => pattern.test(url))
}

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = getClientIP(req)
  const requestId = generateRequestId()
  const method = req.method

  // ── 1. OWASP A03 — Injection Detection ─────────────────────────────────────
  if (detectInjection(req)) {
    console.warn(`[SECURITY] Injection attempt blocked | ip=${ip} url=${req.url} rid=${requestId}`)
    return NextResponse.json(
      { error: 'Bad Request', requestId },
      { status: 400, headers: { 'X-Request-Id': requestId } }
    )
  }

  // ── 2. Rate Limiting (all routes) ──────────────────────────────────────────
  const rate = checkRateLimit(ip)
  if (!rate.allowed) {
    console.warn(`[SECURITY] Rate limit exceeded | ip=${ip} rid=${requestId}`)
    return NextResponse.json(
      { error: 'Too Many Requests', requestId },
      {
        status: 429,
        headers: {
          'X-Request-Id': requestId,
          'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rate.resetAt / 1000)),
        },
      }
    )
  }

  // ── 3. API Route Authentication (OWASP A07) ─────────────────────────────────
  if (pathname.startsWith('/api/')) {
    // Skip OPTIONS preflight
    if (method === 'OPTIONS') {
      return NextResponse.next()
    }

    const apiKey = req.headers.get(API_SECRET_HEADER)
    const expectedKey = process.env.APP_SECRET

    if (!expectedKey) {
      console.error('[SECURITY] APP_SECRET not set — refusing all API requests')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    if (!apiKey || apiKey !== expectedKey) {
      console.warn(`[SECURITY] Unauthorized API access | ip=${ip} path=${pathname} rid=${requestId}`)
      return NextResponse.json(
        { error: 'Unauthorized', requestId },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'ApiKey realm="WA Sender Pro"',
            'X-Request-Id': requestId,
          },
        }
      )
    }
  }

  // ── 4. Propagate security headers + audit ID ────────────────────────────────
  const response = NextResponse.next()
  response.headers.set('X-Request-Id', requestId)
  response.headers.set('X-RateLimit-Remaining', String(rate.remaining))

  // OWASP A05 — Remove server fingerprinting headers
  response.headers.delete('X-Powered-By')
  response.headers.delete('Server')

  return response
}

export const config = {
  matcher: [
    // Protect API and dashboard routes
    '/api/(.*)',
    '/dashboard/(.*)',
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
