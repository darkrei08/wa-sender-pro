import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { signJWT } from '../../utils/jwt'
import { setCookie, readBody, createError, defineEventHandler, getRequestIP } from 'h3'
import { z } from 'zod'
import { securityLog } from '~/lib/security-logger'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  teamName: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    securityLog.validationError(event.path, parsed.error)
    throw createError({ statusCode: 400, message: 'Formato dati non valido' })
  }
  
  const { email, password, name, teamName } = parsed.data

  // Controlla se esiste già l'utente
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw createError({ statusCode: 400, message: 'User already exists' })
  }

  // Controlla se è il primo utente nel sistema (diventa superadmin)
  const usersCount = await prisma.user.count()
  const isSuperAdmin = usersCount === 0

  // Crea il Team (Agenzia/Workspace)
  const team = await prisma.team.create({
    data: { name: teamName || `Team di ${name}` }
  })

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Crea Utente con ruolo OWNER nel Team
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      isSuperAdmin,
      memberships: {
        create: {
          teamId: team.id,
          role: 'OWNER'
        }
      }
    }
  })

  // Genera JWT
  const token = await signJWT({ 
    userId: user.id, 
    teamId: team.id, 
    role: 'OWNER',
    isSuperAdmin 
  })

  // Setta il cookie HttpOnly
  const isSecure = process.env.NUXT_PUBLIC_APP_URL?.startsWith('https') || false
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  securityLog.authSuccess(ip)

  return { 
    success: true, 
    user: { id: user.id, email: user.email, name: user.name, teamId: team.id } 
  }
})
