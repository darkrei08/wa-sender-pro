import { prisma } from '../utils/prisma'
import { GowaClient } from '../../lib/gowa-client'

export default defineTask({
  meta: {
    name: 'whatsapp-scheduled',
    description: 'Polls and sends scheduled WhatsApp messages',
  },
  async run() {
    console.log('Running whatsapp-scheduled task...')

    const pendingMessages = await prisma.whatsAppScheduledMessage.findMany({
      where: {
        status: 'PENDING',
        scheduledFor: { lte: new Date() }
      },
      include: { contact: true }
    })

    if (pendingMessages.length === 0) {
      return { result: 'No pending messages' }
    }

    for (const msg of pendingMessages) {
      try {
        const client = await GowaClient.forTeam(msg.teamId)
        if (!client) {
          throw new Error('GOWA client not configured for team')
        }

        let result
        if (msg.type === 'text') {
          result = await client.sendText(msg.contact.fullPhone, msg.content)
        } else {
          // Handle media
          const metadata = msg.metadata as any
          result = await client.sendMedia(msg.contact.fullPhone, msg.type as any, { id: metadata?.mediaId }, msg.content)
        }

        // Save to ChatMessage history
        await prisma.chatMessage.create({
          data: {
            teamId: msg.teamId,
            contactId: msg.contactId,
            direction: 'OUTBOUND',
            type: msg.type,
            content: msg.content,
            wamid: result.messages?.[0]?.id,
            status: 'SENT'
          }
        })

        // Mark as sent
        await prisma.whatsAppScheduledMessage.update({
          where: { id: msg.id },
          data: { status: 'SENT' }
        })

      } catch (err: any) {
        console.error(`Failed to send scheduled message ${msg.id}:`, err)
        await prisma.whatsAppScheduledMessage.update({
          where: { id: msg.id },
          data: { status: 'FAILED', errorReason: err.message }
        })
      }
    }

    return { result: `Processed ${pendingMessages.length} messages` }
  }
})
