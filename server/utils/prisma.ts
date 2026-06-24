/**
 * Prisma Client Singleton for Nitro Runtime
 * Avoids exhausting database connections during HMR in development.
 */

import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || 'file:./data/wa-sender-pro.db',
    log: ['error']
  })
} else {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL || 'file:./data/wa-sender-pro.db',
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = globalThis.__prisma
}

export { prisma }
