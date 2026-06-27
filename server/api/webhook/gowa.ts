import { prisma } from '../../utils/prisma'
import { broadcastToTeam } from '../../routes/ws'
import crypto from 'crypto'
import { handleOptOutKeywords } from '../../../lib/whatsapp-policy'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const query = getQuery(event)

  // 1. Webhook Verification (GET)
  if (method === 'GET') {
    const mode = query['hub.mode']
    const token = query['hub.verify_token']
    const challenge = query['hub.challenge']

    // You should configure this token in your env variables
    const verifyToken = process.env.GOWA_VERIFY_TOKEN || 'waforge_verify_token'

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK_VERIFIED')
      return challenge
    } else {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }

  // 2. Incoming Messages (POST)
  if (method === 'POST') {
    // HMAC Verification
    const appSecret = process.env.GOWA_APP_SECRET
    if (appSecret) {
      const signature = getHeader(event, 'x-hub-signature-256')
      const rawBody = await readRawBody(event)
      if (!signature || !rawBody) {
        throw createError({ statusCode: 400, statusMessage: 'Missing signature or body' })
      }
      
      const expectedSignature = `sha256=${crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')}`
      if (signature !== expectedSignature) {
        throw createError({ statusCode: 403, statusMessage: 'Invalid signature' })
      }
    }

    const body = await readBody(event)
    
    // GOWA Webhook payload is typically: { object: 'whatsapp_business_account', entry: [ { changes: [ { value: { messages: [], statuses: [], metadata: { phone_number_id } } } ] } ] }
    if (body.object !== 'whatsapp_business_account') {
      return { status: 'ignored' }
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value
        if (!value) continue

        const phoneNumberId = value.metadata?.phone_number_id
        
        // Find the team associated with this phone number ID
        const session = await prisma.whatsAppSession.findFirst({
          where: { phone: phoneNumberId }
        })
        
        if (!session) {
          console.warn('Received webhook for unknown phone_number_id:', phoneNumberId)
          continue
        }
        
        const teamId = session.teamId

        // Handle Statuses (Acks, Read Receipts, etc)
        if (value.statuses) {
          for (const status of value.statuses) {
            const wamid = status.id
            const statusType = status.status // sent, delivered, read, failed

            const updatedMsg = await prisma.chatMessage.updateMany({
              where: { wamid },
              data: { status: statusType.toUpperCase() }
            })
            
            // If updated, fetch the message to broadcast
            if (updatedMsg.count > 0) {
              const msg = await prisma.chatMessage.findFirst({ where: { wamid } })
              if (msg) {
                broadcastToTeam(teamId, 'message_ack', msg)
              }
            }
          }
        }

        // Handle Incoming Messages
        if (value.messages) {
          for (const msg of value.messages) {
            const from = msg.from // sender phone
            const wamid = msg.id
            const type = msg.type
            const pushName = value.contacts?.[0]?.profile?.name || from
            
            // Find or create contact
            let contact = await prisma.contact.findFirst({
              where: { teamId, fullPhone: from }
            })

            if (!contact) {
              contact = await prisma.contact.create({
                data: {
                  teamId,
                  fullPhone: from,
                  phone: from,
                  name: pushName,
                  isActive: true
                }
              })
            }

            // Extract content and metadata
            let content = '[Unsupported]'
            let metadata: any = null

            if (type === 'text') {
              content = msg.text.body
              // Policy check for STOP/START
              await handleOptOutKeywords(from, content, teamId)
            } else if (type === 'image') {
              content = '[Image]'
              metadata = { mediaId: msg.image.id, mimeType: msg.image.mime_type }
            } else if (type === 'reaction') {
              content = `[Reaction: ${msg.reaction.emoji}]`
              metadata = { emoji: msg.reaction.emoji, targetMessageId: msg.reaction.message_id }
            }
            
            // Find or create Conversation
            let conversation = await prisma.whatsAppConversation.findUnique({
              where: { teamId_contactId: { teamId, contactId: contact.id } }
            })
            if (!conversation) {
              conversation = await prisma.whatsAppConversation.create({
                data: { teamId, contactId: contact.id }
              })
            }

            // Save the incoming message
            const chatMsg = await prisma.chatMessage.create({
              data: {
                teamId,
                contactId: contact.id,
                conversationId: conversation.id,
                direction: 'INBOUND',
                type,
                content,
                wamid,
                status: 'DELIVERED',
                metadata
              },
              include: { contact: true }
            })
            
            // Update conversation stats
            await prisma.whatsAppConversation.update({
              where: { id: conversation.id },
              data: {
                unreadCount: { increment: 1 },
                lastMessageAt: new Date()
              }
            })

            // Broadcast to Team
            broadcastToTeam(teamId, 'new_message', chatMsg)
          }
        }
      }
    }

    return { status: 'success' }
  }
})
