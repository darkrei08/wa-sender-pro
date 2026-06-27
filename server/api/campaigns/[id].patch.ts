import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'

const updateCampaignSchema = z.object({
  name: z.string().optional(),
  templateId: z.string().optional(),
  delayMin: z.number().min(1).optional(),
  delayMax: z.number().min(1).optional(),
  scheduledAt: z.string().optional().nullable()
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'ID required' })

  const body = await readBody(event)
  const parsed = updateCampaignSchema.parse(body)

  // Verify ownership and status
  const existing = await prisma.campaign.findUnique({
    where: { id, teamId: user.teamId }
  })

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Campaign not found' })
  }
  if (existing.status !== 'DRAFT') {
    throw createError({ statusCode: 400, message: 'Only DRAFT campaigns can be modified' })
  }

  const updated = await prisma.campaign.update({
    where: { id, teamId: user.teamId },
    data: parsed
  })

  return { success: true, data: updated }
})
