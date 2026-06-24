import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { signJWT } from '../../utils/jwt'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password required' })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberships: true }
  })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Prendi il primo team (in futuro potremmo gestire lo switch dei team)
  const primaryMembership = user.memberships[0]
  const teamId = primaryMembership?.teamId
  const role = primaryMembership?.role || 'AGENT'

  if (!teamId && !user.isSuperAdmin) {
    throw createError({ statusCode: 403, message: 'User does not belong to any team' })
  }

  const token = await signJWT({ 
    userId: user.id, 
    teamId, 
    role,
    isSuperAdmin: user.isSuperAdmin
  })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return { 
    success: true, 
    user: { id: user.id, email: user.email, name: user.name, teamId, role } 
  }
})
