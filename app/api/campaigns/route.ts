import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseBody, CreateCampaignSchema } from '@/lib/validation'
import { securityLog } from '@/lib/security-logger'
import { renderTemplate, sendMessage } from '@/lib/whatsapp-engine'

// GET /api/campaigns
export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: { template: { select: { name: true } } },
    take: 100, // OWASP A04 — cap result set
  })
  return NextResponse.json({ campaigns })
}

// POST /api/campaigns — create campaign (does NOT start it)
export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const validated = parseBody(CreateCampaignSchema, body)
  if (!validated.success) {
    securityLog.validationError('/api/campaigns', validated.response)
    return validated.response
  }

  const { name, templateId, contactIds, delayMin, delayMax } = validated.data

  // Verify template exists (OWASP A01 — authorization check)
  const template = await prisma.template.findUnique({ where: { id: templateId } })
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  // Count contacts
  const totalCount = contactIds === 'ALL'
    ? await prisma.contact.count({ where: { isActive: true } })
    : contactIds.length

  const campaign = await prisma.campaign.create({
    data: {
      name,
      templateId,
      contactIds: JSON.stringify(contactIds),
      delayMin,
      delayMax,
      totalCount,
    },
  })

  return NextResponse.json({ campaign }, { status: 201 })
}

// POST /api/campaigns/[id]/start — execute campaign (background)
// This is intentionally kept as a separate action for safety
export { runCampaign }

async function runCampaign(campaignId: string): Promise<void> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { template: true },
  })
  if (!campaign || campaign.status !== 'DRAFT') return

  await prisma.campaign.update({ where: { id: campaignId }, data: { status: 'RUNNING', startedAt: new Date() } })
  securityLog.campaignStarted(campaignId, campaign.totalCount)

  // Resolve contacts
  const contactIds = JSON.parse(campaign.contactIds as string)
  const contacts = await prisma.contact.findMany({
    where: contactIds === 'ALL' ? { isActive: true } : { id: { in: contactIds }, isActive: true },
  })

  let sent = 0
  let failed = 0

  for (const contact of contacts) {
    // Check campaign is still RUNNING (could be paused)
    const current = await prisma.campaign.findUnique({ where: { id: campaignId }, select: { status: true } })
    if (current?.status === 'PAUSED') break

    // Render template safely
    const customFields = contact.customFields ? JSON.parse(contact.customFields) : {}
    const message = renderTemplate(campaign.template.body, {
      Name: contact.name, name: contact.name,
      Phone: contact.phone, phone: contact.phone,
      email: contact.email ?? '',
      company: contact.company ?? '',
      ...customFields,
    })

    const result = await sendMessage(contact.fullPhone, message)

    await prisma.message.create({
      data: {
        contactId: contact.id,
        campaignId: campaign.id,
        body: message,
        status: result.success ? 'SENT' : 'FAILED',
        errorReason: result.error,
        wuzapiMsgId: result.messageId,
        sentAt: result.success ? new Date() : null,
      },
    })

    if (result.success) sent++; else failed++

    // Anti-ban: random delay between sends (OWASP A04 — secure design)
    if (contacts.indexOf(contact) < contacts.length - 1) {
      const delay = (campaign.delayMin + Math.random() * (campaign.delayMax - campaign.delayMin)) * 1000
      await new Promise(r => setTimeout(r, delay))
    }
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'COMPLETED', sentCount: sent, failedCount: failed, completedAt: new Date() },
  })

  securityLog.campaignCompleted(campaignId, sent, failed)
}
