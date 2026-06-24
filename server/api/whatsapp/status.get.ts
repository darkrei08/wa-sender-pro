/**
 * GET /api/whatsapp/status — Get WhatsApp engine connection status
 * Supports dual engine (WuzAPI / gowa)
 */

import { defineEventHandler } from 'h3'
import { getEngineStatus, ENGINE } from '~/lib/whatsapp-engine'

export default defineEventHandler(async () => {
  const status = await getEngineStatus()

  return {
    data: {
      ...status,
      activeEngine: ENGINE,
      supportedEngines: ['wuzapi', 'gowa'],
    },
  }
})
