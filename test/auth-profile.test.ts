import { describe, it, expect } from 'bun:test'
import * as fs from 'fs'
import * as path from 'path'

describe('Profile API', () => {
  it('should have PUT /api/auth/profile endpoint', () => {
    const fileExists = fs.existsSync(path.join(import.meta.dir, '../server/api/auth/profile.put.ts'))
    expect(fileExists).toBe(true)
  })
})
