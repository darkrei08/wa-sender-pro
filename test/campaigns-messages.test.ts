import { describe, it, expect } from 'bun:test'
import * as fs from 'fs'
import * as path from 'path'

describe('Campaign Messages API', () => {
  it('should have GET /api/campaigns/[id]/messages.get.ts endpoint', () => {
    const fileExists = fs.existsSync(path.join(import.meta.dir, '../server/api/campaigns/[id]/messages.get.ts'))
    expect(fileExists).toBe(true)
  })
})
