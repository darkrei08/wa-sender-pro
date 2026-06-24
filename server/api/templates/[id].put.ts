/**
 * PUT /api/templates/:id — Update a template
 */

import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { readValidatedBody } from '~/server/utils/validation'
import { UpdateTemplateSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing template ID' })

  const data = await readValidatedBody(event, UpdateTemplateSchema)

  const template = await prisma.template.update({
    where: { id },
    data,
  })

  return { data: template }
})
