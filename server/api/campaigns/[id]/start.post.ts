/**
 * POST /api/campaigns/:id/start — Start or resume a campaign
 */

import { defineEventHandler, getRouterParam, createError } from 'h3'
import { startCampaign } from '~/server/utils/job-queue'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing campaign ID' })

  // Start in background (non-blocking)
  startCampaign(id).catch(err => {
    console.error(`[Campaign ${id}] Error:`, err)
  })

  return { success: true, message: 'Campaign started' }
})
