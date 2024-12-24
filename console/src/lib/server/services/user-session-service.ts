import { createSecretKey, KeyObject } from 'node:crypto'
import { jwtVerify, SignJWT } from 'jose'
import { PrismaClient } from '@prisma/client'
import { prismaClient } from '@/lib/server/prisma-client'
import { maskNumber } from '../keymask'

export class UserSessionService {
  private prisma: PrismaClient = prismaClient
  private secretKey: KeyObject

  constructor() {
    if (process.env.JWT_SECRET == null)
      throw new Error('JWT_SECRET environment variable must be provided')

    this.secretKey = createSecretKey(process.env.JWT_SECRET, 'utf-8')
  }

  async createSession(userId: number) {
    return this.prisma.$transaction(async t => {
      const session = await t.userSession.create({
        data: {
          token: '',
          userId,
          revoked: false
        }
      })

      const token = await this.generateToken(session.id)

      await t.userSession.update({
        where: { id: session.id },
        data: { token }
      })

      return token
    })
  }

  async verifySessionToken(sessionToken: string) {
    try {
      await jwtVerify(sessionToken, this.secretKey)

      return true
    } catch (_e: unknown) {
      return false
    }
  }

  async getUserBySessionToken(sessionToken: string) {
    const session = await this.prisma.userSession.findFirst({
      where: { token: sessionToken },
      include: { user: true }
    })

    return session?.user
  }

  private async generateToken(sessionId: number) {
    return await new SignJWT({ sub: maskNumber(sessionId) })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(this.secretKey)
  }
}