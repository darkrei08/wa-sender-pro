/**
 * DELETE /api/templates/:id — Delete a template
 */

import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing template ID' })

  await prisma.template.delete({ where: { id } })

  return { success: true }
})
