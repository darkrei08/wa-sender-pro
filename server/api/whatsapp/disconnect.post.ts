/**
 * POST /api/whatsapp/disconnect — Disconnect WhatsApp session
 */

import { defineEventHandler } from 'h3'
import { disconnectEngine } from '~/lib/whatsapp-engine'
import { securityLog } from '~/lib/security-logger'

export default defineEventHandler(async () => {
  await disconnectEngine()
  securityLog.whatsappDisconnected()

  return { success: true, message: 'WhatsApp disconnected' }
})
