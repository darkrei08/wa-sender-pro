import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/contacts/[id]
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const contact = await prisma.contact.findUnique({ where: { id: params.id } })
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ contact })
}

// PATCH /api/contacts/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const contact = await prisma.contact.update({
    where: { id: params.id },
    data: {
      name: body.name,
      prefix: body.prefix,
      phone: body.phone,
      fullPhone: body.fullPhone,
      email: body.email,
      company: body.company,
      notes: body.notes,
    },
  })
  return NextResponse.json({ contact })
}

// DELETE /api/contacts/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.contact.update({ where: { id: params.id }, data: { isActive: false } })
  return NextResponse.json({ ok: true })
}
