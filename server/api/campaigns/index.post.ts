/**
 * POST /api/campaigns — Create a new campaign
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { readValidatedBody } from '~/server/utils/validation'
import { CreateCampaignSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, CreateCampaignSchema)

  const campaign = await prisma.campaign.create({
    data: {
      name: data.name,
      templateId: data.templateId,
      contactIds: Array.isArray(data.contactIds)
        ? JSON.stringify(data.contactIds)
        : data.contactIds,
      delayMin: data.delayMin,
      delayMax: data.delayMax,
    },
    include: { template: { select: { name: true } } },
  })

  return { data: campaign }
})
