/**
 * PUT /api/contacts/:id — Update a contact
 */

import { defineEventHandler, getRouterParam, createError } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { readValidatedBody } from '~/server/utils/validation'
import { UpdateContactSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing contact ID' })

  const data = await readValidatedBody(event, UpdateContactSchema)

  // Recompute fullPhone if prefix or phone changed
  const updateData: Record<string, unknown> = { ...data }
  if (data.prefix || data.phone) {
    const existing = await prisma.contact.findUnique({ where: { id } })
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Contact not found' })

    const prefix = data.prefix || existing.prefix
    const phone = data.phone || existing.phone
    updateData.fullPhone = (prefix + phone).replace(/\D/g, '')
  }

  if (data.customFields) {
    updateData.customFields = JSON.stringify(data.customFields)
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: updateData,
  })

  return { data: contact }
})
