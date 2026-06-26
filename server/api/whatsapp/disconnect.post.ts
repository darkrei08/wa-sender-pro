/**
 * POST /api/whatsapp/disconnect — Disconnect WhatsApp session
 */

import { defineEventHandler } from 'h3'
import { disconnectEngine, ENGINE } from '~/lib/whatsapp-engine'
import { securityLog } from '~/lib/security-logger'

export default defineEventHandler(async () => {
  const token = ENGINE === 'wuzapi'
    ? (process.env.WUZAPI_TOKEN || 'secret-token')
    : (process.env.GOWA_TOKEN || 'secret-token')

  await disconnectEngine(token)
  securityLog.whatsappDisconnected()

  return { success: true, message: 'WhatsApp disconnected' }
})
