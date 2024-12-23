import { createTransport, Transporter } from 'nodemailer'
import { PrismaClient } from '@prisma/client'
import { prismaClient } from '@/lib/server/prisma-client'

export class EmailService {
  private nodemailer: Transporter
  private prisma: PrismaClient
  private smtpHost = 'mail.netangels.ru'
  private smptUser = 'restore-password@titorelli.ru'
  private smtpPass: string

  constructor() {
    if (!process.env.SMTP_PASS_RESTORE_PASSWORD)
      throw new Error('SMTP_PASS_RESTORE_PASSWORD environment variable must be provided')

    this.prisma = prismaClient
    this.smtpPass = process.env.SMTP_PASS_RESTORE_PASSWORD
    this.nodemailer = createTransport({
      host: this.smtpHost,
      secure: false,
      auth: {
        user: this.smptUser,
        pass: this.smtpPass
      }
    })
  }

  async sendRestorePasswordEmail(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    if (!user)
      throw new Error(`Can't find user with id = ${userId}`)

    const emailContact = await this.prisma.userContact.findFirst({
      where: {
        userId: user.id,
        type: 'email'
      }
    })

    if (!emailContact || emailContact.email == null || emailContact.email === '')
      throw new Error(`User with id = ${user.id} don't have email contact`)

    await this.nodemailer.sendMail({
      from: 'restore-password@titorelli.ru',
      to: emailContact.email,
      subject: 'Titorell — восстановление пароля на платформе',
      text: 'Ваш новый пароль: 1234'
    })
  }
}
