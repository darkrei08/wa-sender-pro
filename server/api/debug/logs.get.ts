import { defineEventHandler } from 'h3'
import { systemLogs } from '~/server/plugins/logger'

export default defineEventHandler(() => {
  return {
    logs: systemLogs
  }
})
