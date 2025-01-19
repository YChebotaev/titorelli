import { createSecretKey, KeyObject } from 'crypto'
import { jwtVerify, SignJWT } from 'jose'
import { PrismaClient } from '@prisma/client'
import { prismaClient } from '@/lib/server/prisma-client'
import { maskNumber } from '../keymask'
import { env } from '@/lib/server/env'

export class UserSessionService {
  private prisma: PrismaClient = prismaClient
  private secretKey: KeyObject

  constructor() {
    this.secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
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
    } catch (e: unknown) {
      new SuppressedError(e, true)

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
