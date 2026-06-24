/**
 * POST /api/contacts/bulk-delete — Delete multiple contacts
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { readValidatedBody } from '~/server/utils/validation'
import { BulkDeleteSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  const { ids } = await readValidatedBody(event, BulkDeleteSchema)

  const result = await prisma.contact.deleteMany({
    where: { id: { in: ids } },
  })

  return { data: { deleted: result.count } }
})
