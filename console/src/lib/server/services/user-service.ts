import { createHash, randomBytes } from 'crypto'
import { prismaClient } from '@/lib/server/prisma-client'
import { PrismaClient } from '@prisma/client'
import { unmaskNumber } from '@/lib/server/keymask'
import { env } from '@/lib/env'
import { formatPhoneNumber } from '../format-phone-number'
import { getEmailService, getEmailValidationService, getTokenService } from './instances'

export type IdentityTypes = 'email' | 'phone' | 'username'

export class UserService {
  private passwordPepper: string
  private prisma: PrismaClient

  get emailValidationService() {
    return getEmailValidationService()
  }

  get emailService() {
    return getEmailService()
  }

  get tokenService() {
    return getTokenService()
  }

  constructor() {
    this.prisma = prismaClient
    this.passwordPepper = env.PASSWORD_PEPPER
  }

  async getUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId }
    })
  }

  async markEmailConfirmedByToken(token: string) {
    const { contactId: maskedContactId } = await this.tokenService.parseEmailVerificationToken(token)
    const contactId = unmaskNumber(maskedContactId)

    await this.prisma.userContact.update({
      where: { id: contactId },
      data: { emailConfirmed: true }
    })
  }

  /**
   * @deprecated Used only in seed
   */
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

  async createUserWithSignupData(
    username: string,
    email: string,
    phone: string,
    rawPassword: string,
    acceptTerms: boolean,
    acceptPdp: boolean,
    acceptSubscription: boolean
  ) {
    const formattedPhone = this.formatPhoneNumber(phone)
    const emailCorporate = await this.emailValidationService.corporate(email)
    const emailDisposable = await this.emailValidationService.disposable(email)
    const passwordSalt = this.generateSalt()

    return this.prisma.$transaction(async t => {
      const user = await t.user.create({
        data: {
          username,
          passwordHash: this.hashPassword(rawPassword, passwordSalt),
          passwordSalt
        }
      })

      await t.userContact.createMany({
        data: [
          {
            type: 'email',
            primary: true,
            userId: user.id,
            email,
            emailConfirmed: false,
            emailCorporate: emailCorporate === 'unknown' ? null : emailCorporate,
            emailDisposable: emailDisposable === 'unknown' ? null : emailDisposable
          },
          {
            type: 'phone',
            primary: true,
            userId: user.id,
            phone: formattedPhone,
          }
        ]
      })

      await t.userConsent.createMany({
        data: [
          {
            type: 'terms',
            userId: user.id,
            terms: acceptTerms
          },
          {
            type: 'pdp',
            userId: user.id,
            pdp: acceptPdp
          },
          {
            type: 'subsc',
            userId: user.id,
            sub: acceptSubscription
          },
        ]
      })

      return user.id
    })
  }

  /**
   * @todo Логин должен осуществляться только по подтвежденным креденшелам
   */
  async tryLogin(identity: string, rawPassword: string): Promise<[boolean, number | null]> {
    const user = await this.getUserByIdentnty(identity)

    if (user) {
      const rawPasswordHash = this.hashPassword(rawPassword, user.passwordSalt)

      return [
        rawPasswordHash === user.passwordHash,
        user.id
      ]
    }

    return [false, null]
  }

  async tryRestore(identity: string): Promise<[boolean, number | null]> {
    const user = await this.getUserByIdentnty(identity)

    if (user) {
      return [true, user.id]
    }

    return [false, null]
  }

  async tryReset(token: string, rawPassword: string) {
    const userId = await this.getUserIdFromResetPasswordToken(token)

    if (!userId)
      return false

    const passwordSalt = this.generateSalt()

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: this.hashPassword(rawPassword, passwordSalt),
        passwordSalt
      }
    })

    return true
  }

  private async getUserIdFromResetPasswordToken(token: string) {
    const parsedToken = await this.emailService.parseRestorePasswordTokenFromEmail(token)

    if (!parsedToken || !parsedToken.sub)
      return null

    return unmaskNumber(parsedToken.sub)
  }

  getIdentityType(identity: string): IdentityTypes | null {
    if (this.emailValidationService.isEmail(identity))
      return 'email'

    if (this.formatPhoneNumber(identity)) {
      return 'phone'
    }

    if (this.validateUsername(identity))
      return 'username'

    return null
  }

  async getUserByIdentnty(identity: string) {
    const identityType = this.getIdentityType(identity)

    switch (identityType) {
      case 'email': return this.getUserByEmail(identity)
      case 'phone': return this.getUserByPhone(identity)
      case 'username': return this.getUserByUsername(identity)
      default:
        return null
    }
  }

  /**
   * @todo Apply username validation
   */
  async getUserByUsername(username: string) {
    if (!this.validateUsername(username))
      return null

    const user = await this.prisma.user.findFirst({
      where: {
        username
      }
    })

    return user ?? null
  }

  async getUserByEmail(email: string) {
    if (!this.emailValidationService.isEmail(email))
      return null

    const contact = await this.prisma.userContact.findFirst({
      where: {
        type: 'email',
        email
      },
      include: {
        user: true
      }
    })

    return contact?.user ?? null
  }

  async getUserByPhone(rawPhone: string) {
    const phone = this.formatPhoneNumber(rawPhone)

    if (!phone)
      return null

    const contact = await this.prisma.userContact.findFirst({
      where: {
        type: 'phone',
        phone
      },
      include: {
        user: true
      }
    })

    return contact?.user ?? null
  }

  validateUsername(username: string) {
    if (!/^[a-z]/.test(username))
      return false

    if (!/[a-z]$/.test(username))
      return false

    if (!/[a-z0-9\-\_]+/.test(username))
      return false

    if (/[\-\_]{2,}/.test(username))
      return false

    if (username.length < 3)
      return false

    return true
  }

  async usernameTaken(username: string) {
    const usersCount = await this.prisma.user.count({
      where: {
        username
      }
    })

    return usersCount > 0
  }

  async emailTaken(email: string) {
    const emailsCount = await this.prisma.userContact.count({
      where: {
        type: 'email',
        email
      }
    })

    return emailsCount > 0
  }

  async phoneTaken(phone: string) {
    const formattedPhone = this.formatPhoneNumber(phone)

    const phonesCount = await this.prisma.userContact.count({
      where: {
        type: 'phone',
        phone: formattedPhone
      }
    })

    return phonesCount > 0
  }

  async addEmailContact(userId: number, email: string) {
    const emailCorporate = await this.emailValidationService.corporate(email)
    const emailDisposable = await this.emailValidationService.disposable(email)

    await this.prisma.userContact.create({
      data: {
        userId,
        type: 'email',
        emailConfirmed: false,
        emailDisposable: emailDisposable === 'unknown' ? null : emailDisposable,
        emailCorporate: emailCorporate === 'unknown' ? null : emailCorporate,
      }
    })
  }

  async addPhoneContact(userId: number, phone: string) {
    const formattedPhone = this.formatPhoneNumber(phone)

    await this.prisma.userContact.create({
      data: {
        userId,
        type: 'phone',
        phone: formattedPhone
      }
    })
  }

  async addTelegramContact(userId: number, tgUsername: string) {
    await this.prisma.userContact.create({
      data: {
        userId,
        type: 'tg-username',
        tgUsername
      }
    })
  }

  private formatPhoneNumber(phone: string) {
    return formatPhoneNumber(phone)
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
