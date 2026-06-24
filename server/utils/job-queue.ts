/**
 * Job Queue for Bulk WhatsApp Message Sending
 *
 * SQLite-backed async queue with:
 * - Anti-ban jitter (randomized delays)
 * - Spintax message variation
 * - Pause/Resume support
 * - Campaign progress tracking
 */

import { prisma } from './prisma'
import { sendMessage, renderTemplate } from '~/lib/whatsapp-engine'
import { expandSpintax } from '~/lib/spintax'
import { securityLog } from '~/lib/security-logger'

interface QueueJob {
  campaignId: string
  running: boolean
}

const activeJobs = new Map<string, QueueJob>()

/**
 * Start processing a campaign — sends messages with jitter delays
 */
export async function startCampaign(campaignId: string): Promise<void> {
  // Prevent double-start
  if (activeJobs.has(campaignId)) return

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { template: true },
  })

  if (!campaign || !campaign.template) {
    throw new Error(`Campaign ${campaignId} not found`)
  }

  // Resolve contacts
  let contacts
  if (campaign.contactIds === 'ALL') {
    contacts = await prisma.contact.findMany({ where: { isActive: true } })
  } else {
    const ids: string[] = JSON.parse(campaign.contactIds)
    contacts = await prisma.contact.findMany({
      where: { id: { in: ids }, isActive: true },
    })
  }

  // Update campaign status
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status: 'RUNNING',
      totalCount: contacts.length,
      sentCount: 0,
      failedCount: 0,
      startedAt: new Date(),
    },
  })

  const job: QueueJob = { campaignId, running: true }
  activeJobs.set(campaignId, job)

  securityLog.campaignStarted(campaignId, contacts.length)

  // Check if spintax is enabled
  const spintaxEnabled = process.env.SPINTAX_ENABLED !== 'false'

  // Process contacts sequentially with jitter
  for (const contact of contacts) {
    // Check if paused
    if (!job.running) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'PAUSED' },
      })
      activeJobs.delete(campaignId)
      return
    }

    // Render template with contact fields
    let messageBody = renderTemplate(campaign.template.body, {
      Name: contact.name,
      name: contact.name,
      Phone: contact.fullPhone,
      phone: contact.fullPhone,
      Email: contact.email,
      email: contact.email,
      Company: contact.company,
      company: contact.company,
    })

    // Apply spintax if enabled
    if (spintaxEnabled) {
      messageBody = expandSpintax(messageBody)
    }

    // Send message
    const result = await sendMessage(contact.fullPhone, messageBody)

    // Log message result
    await prisma.message.create({
      data: {
        contactId: contact.id,
        campaignId: campaign.id,
        body: messageBody,
        status: result.success ? 'SENT' : 'FAILED',
        errorReason: result.error || null,
        wuzapiMsgId: result.messageId || null,
        sentAt: result.success ? new Date() : null,
      },
    })

    // Update campaign counters
    if (result.success) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { sentCount: { increment: 1 } },
      })
    } else {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { failedCount: { increment: 1 } },
      })
    }

    // Anti-ban jitter: random delay between messages
    const delayMin = campaign.delayMin * 1000
    const delayMax = campaign.delayMax * 1000
    const jitter = delayMin + Math.random() * (delayMax - delayMin)
    await new Promise(resolve => setTimeout(resolve, jitter))
  }

  // Campaign complete
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  })

  const finalCampaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  })

  securityLog.campaignCompleted(
    campaignId,
    finalCampaign?.sentCount ?? 0,
    finalCampaign?.failedCount ?? 0
  )

  activeJobs.delete(campaignId)
}

/**
 * Pause a running campaign
 */
export function pauseCampaign(campaignId: string): boolean {
  const job = activeJobs.get(campaignId)
  if (!job) return false
  job.running = false
  return true
}

/**
 * Get current progress for a campaign
 */
export async function getCampaignProgress(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: {
      id: true,
      status: true,
      totalCount: true,
      sentCount: true,
      failedCount: true,
      startedAt: true,
      completedAt: true,
    },
  })
  if (!campaign) return null

  const progress = campaign.totalCount > 0
    ? Math.round(((campaign.sentCount + campaign.failedCount) / campaign.totalCount) * 100)
    : 0

  return {
    ...campaign,
    progress,
    isActive: activeJobs.has(campaignId),
  }
}
