import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const t = await prisma.template.update({ where: { id: params.id }, data: body })
  return NextResponse.json({ template: t })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.template.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
