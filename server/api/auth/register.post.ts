import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { signJWT } from '../../utils/jwt'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, name, teamName } = body

  if (!email || !password || !name) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

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
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return { 
    success: true, 
    user: { id: user.id, email: user.email, name: user.name, teamId: team.id } 
  }
})
