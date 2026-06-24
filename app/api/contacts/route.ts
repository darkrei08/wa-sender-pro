import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseCSV } from '@/lib/csv-parser'
import { parseBody, BulkImportSchema, CreateContactSchema, BulkDeleteSchema, PaginationSchema } from '@/lib/validation'
import { securityLog } from '@/lib/security-logger'

// GET /api/contacts — paginated, search-safe (OWASP A03: no raw string injection)
export async function GET(req: NextRequest) {
  const parsed = PaginationSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query params' }, { status: 400 })

  const { page, limit, search } = parsed.data

  // Prisma ORM prevents SQLi — no raw queries (OWASP A03)
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { fullPhone: { contains: search } },
          { email: { contains: search } },
          { company: { contains: search } },
        ],
        isActive: true,
      }
    : { isActive: true }

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      // OWASP A01: select only needed fields — don't expose internal IDs unnecessarily
      select: {
        id: true, name: true, prefix: true, phone: true,
        fullPhone: true, email: true, company: true,
        isActive: true, createdAt: true,
      },
    }),
    prisma.contact.count({ where }),
  ])

  return NextResponse.json({
    contacts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

// POST /api/contacts — create single or bulk CSV import
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ── Bulk CSV import ───────────────────────────────────────────────────────
  if (typeof body === 'object' && body !== null && 'csv' in body) {
    const validated = parseBody(BulkImportSchema, body)
    if (!validated.success) return validated.response

    const result = parseCSV(validated.data.csv)
    let imported = 0
    let skipped = 0

    for (const c of result.contacts) {
      try {
        await prisma.contact.upsert({
          where: { fullPhone: c.fullPhone },
          update: { name: c.name, email: c.email, company: c.company, isActive: true },
          create: {
            name: c.name, prefix: c.prefix, phone: c.phone, fullPhone: c.fullPhone,
            email: c.email, company: c.company,
            customFields: c.customFields ? JSON.stringify(c.customFields) : null,
          },
        })
        imported++
      } catch { skipped++ }
    }

    securityLog.campaignStarted('import', imported)
    return NextResponse.json({ imported, skipped, errors: result.errors })
  }

  // ── Single contact create ─────────────────────────────────────────────────
  const validated = parseBody(CreateContactSchema, body)
  if (!validated.success) {
    securityLog.validationError('/api/contacts', validated.response)
    return validated.response
  }

  const { name, prefix, phone, email, company, notes, customFields } = validated.data
  const fullPhone = (prefix + phone).replace(/\D/g, '')

  const contact = await prisma.contact.upsert({
    where: { fullPhone },
    update: { name, email, company, isActive: true },
    create: {
      name, prefix, phone, fullPhone, email, company, notes,
      customFields: customFields ? JSON.stringify(customFields) : null,
    },
  })

  return NextResponse.json({ contact }, { status: 201 })
}

// DELETE /api/contacts — bulk soft delete
export async function DELETE(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const validated = parseBody(BulkDeleteSchema, body)
  if (!validated.success) return validated.response

  const { ids } = validated.data
  const result = await prisma.contact.updateMany({
    where: { id: { in: ids } },
    data: { isActive: false },
  })

  return NextResponse.json({ deleted: result.count })
}

// Block unsafe methods (OWASP A01)
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
