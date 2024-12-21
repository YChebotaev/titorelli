import { createHash, randomBytes } from 'node:crypto'
import { prismaClient } from '@/lib/server/prisma-client'
import { PrismaClient } from '@prisma/client'

export class UserService {
  private passwordPepper: string
  private prisma: PrismaClient

  constructor() {
    if (process.env.PASSWORD_PEPPER == null)
      throw new Error('PASSWORD_PEPPER environment variable must be provided')

    this.prisma = prismaClient
    this.passwordPepper = process.env.PASSWORD_PEPPER
  }

  async createUserWithEmail(username: string, rawPassword: string, email: string) {
    const passwordSalt = this.generateSalt()

    await this.prisma.$transaction(async t => {
      const user = await t.user.create({
        data: {
          username,
          passwordHash: this.hashPassword(rawPassword, passwordSalt),
          passwordSalt
        }
      })

      await t.userContact.create({
        data: {
          userId: user.id,
          type: 'email',
          email
        }
      })
    })
  }

  async tryLogin(email: string, rawPassword: string) {
    const contact = await this.prisma.userContact.findFirst({
      where: {
        type: 'email',
        email
      },
      include: {
        user: true
      }
    })

    if (!contact)
      throw new Error('Such user not found')

    const rawPasswordHash = this.hashPassword(rawPassword, contact.user.passwordSalt)

    return rawPasswordHash === contact.user.passwordHash
  }

  private hashPassword(rawPassword: string, salt: string) {
    const hasher = createHash('sha-256')
      .update(rawPassword)
      .update(this.passwordPepper)
      .update(salt)

    return hasher.digest('hex')
  }

  private generateSalt() {
    return randomBytes(24).toString('hex')
  }
}
