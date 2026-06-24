/** @type {import('next').NextConfig} */

const securityHeaders = [
  // OWASP A05 — Security Misconfiguration: strict CSP
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // inline needed for Next.js RSC
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
  // OWASP A05 — Clickjacking protection
  { key: 'X-Frame-Options', value: 'DENY' },
  // OWASP A02 — Force HTTPS
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Prevent MIME sniffing (OWASP)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer leakage (OWASP A02)
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Permissions policy — minimal surface
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // XSS protection for legacy browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },
]

const nextConfig = {
  // Next.js 15 — use App Router only
  output: 'standalone',

  // Security headers on all routes (OWASP A05)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // API routes: strict CORS (OWASP A01)
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-API-Key' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ]
  },

  // Block sensitive internal paths (OWASP A01)
  async redirects() {
    return [
      {
        source: '/api/internal/:path*',
        destination: '/404',
        permanent: false,
      },
    ]
  },

  // Next.js 15 server components packages
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs'],

  // Disable X-Powered-By (OWASP A05 — don't leak server info)
  poweredByHeader: false,

  // Strict TypeScript & ESLint
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  // Compress responses
  compress: true,

  // Logging (Next.js 15)
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  experimental: {
    // Next.js 15: React 19 + PPR
    ppr: false,
    // Turbopack in dev (via CLI flag --turbopack)
  },
}

module.exports = nextConfig
