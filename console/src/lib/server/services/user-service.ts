import { createHash, randomBytes } from 'crypto'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { prismaClient } from '@/lib/server/prisma-client'
import { PrismaClient } from '@prisma/client'
import { EmailValidationService } from '@/lib/server/services/email-validation-service'

export class UserService {
  private passwordPepper: string
  private prisma: PrismaClient
  private emailValidationService: EmailValidationService

  constructor() {
    if (process.env.PASSWORD_PEPPER == null)
      throw new Error('PASSWORD_PEPPER environment variable must be provided')

    this.prisma = prismaClient
    this.passwordPepper = process.env.PASSWORD_PEPPER
    this.emailValidationService = new EmailValidationService()
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
            userId: user.id,
            email,
            emailConfirmed: false,
            emailCorporate: emailCorporate === 'unknown' ? null : emailCorporate,
            emailDisposable: emailDisposable === 'unknown' ? null : emailDisposable
          },
          {
            type: 'phone',
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

  private async getUserByIdentnty(identity: string) {
    let user = await this.getUserByUsername(identity)

    if (user == null) {
      user = await this.getUserByEmail(identity)
    }

    if (user == null) {
      user = await this.getUserByUsername(identity)
    }

    return user
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username
      }
    })

    return user ?? null
  }

  async getUserByEmail(email: string) {
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
    const parsedPhone = parsePhoneNumberFromString(phone, 'RU')
    return parsedPhone?.formatInternational()
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
