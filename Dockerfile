# ─── Build Stage ──────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bunx prisma generate
RUN bun run build

# ─── Production Stage ─────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nuxtjs && \
    adduser --system --uid 1001 nuxtjs

# Copy Nitro server output
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R nuxtjs:nuxtjs /app/data /app/.output

USER nuxtjs

EXPOSE 3000

LABEL org.opencontainers.image.source="https://github.com/darkrei08/wa-sender-pro"
LABEL org.opencontainers.image.description="WA Sender Pro — Dashboard WhatsApp Mass Messaging"
LABEL org.opencontainers.image.licenses="AGPL-3.0"

# Run migrations then start Nitro server
CMD ["sh", "-c", "npx prisma migrate deploy 2>/dev/null; node .output/server/index.mjs"]
