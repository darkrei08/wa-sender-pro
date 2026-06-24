import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // L'utente è stato iniettato dal middleware auth
  const authUser = event.context.user

  if (!authUser) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      email: true,
      name: true,
      isSuperAdmin: true,
      createdAt: true,
      memberships: {
        include: {
          team: true
        }
      }
    }
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return { success: true, user }
})
