/**
 * GET /api/templates — List all templates
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return { data: templates }
})
