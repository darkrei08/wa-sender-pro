/**
 * GET /api/whatsapp/qr — Get QR code for WhatsApp login
 * Supports dual engine (WuzAPI / gowa)
 */

import { defineEventHandler } from 'h3'
import { getQRCode } from '~/lib/whatsapp-engine'

export default defineEventHandler(async () => {
  const qrCode = await getQRCode()

  return {
    data: {
      qrCode,
      available: !!qrCode,
    },
  }
})
