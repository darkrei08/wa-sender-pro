/**
 * GET /api/stats/dashboard — Dashboard KPI aggregates
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const [
    totalContacts,
    activeContacts,
    totalCampaigns,
    activeCampaigns,
    totalMessages,
    sentMessages,
    failedMessages,
    recentCampaigns,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { isActive: true } }),
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: 'RUNNING' } }),
    prisma.message.count(),
    prisma.message.count({ where: { status: 'SENT' } }),
    prisma.message.count({ where: { status: 'FAILED' } }),
    prisma.campaign.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { template: { select: { name: true } } },
    }),
  ])

  const successRate = totalMessages > 0
    ? Math.round((sentMessages / totalMessages) * 100)
    : 0

  return {
    data: {
      totalContacts,
      activeContacts,
      totalCampaigns,
      activeCampaigns,
      totalMessages,
      sentMessages,
      failedMessages,
      successRate,
      recentCampaigns,
    },
  }
})
