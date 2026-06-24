import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/templates
export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json({ templates })
}

// POST /api/templates
export async function POST(req: NextRequest) {
  const { name, body, description } = await req.json()
  if (!name || !body) return NextResponse.json({ error: 'name e body obbligatori' }, { status: 400 })
  const template = await prisma.template.create({ data: { name, body, description } })
  return NextResponse.json({ template })
}
