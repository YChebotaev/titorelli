import { env } from "@/lib/server/env"
import { createTransport, Transporter } from "nodemailer"
import { htmlToText } from 'html-to-text'

export type FromEmails = 'noreply@titorelli.ru' | 'restore-password@titorelli.ru'

export class EmailClient {
  private transports: Record<FromEmails, Transporter>

  constructor() {
    this.transports = {
      'noreply@titorelli.ru': createTransport({
        host: 'mail.netangels.ru',
        secure: false,
        auth: { user: 'noreply@titorelli.ru', pass: env.SMTP_PASS_NOREPLY }
      }),
      'restore-password@titorelli.ru': createTransport({
        host: 'mail.netangels.ru',
        secure: false,
        auth: { user: 'restore-password@titorelli.ru', pass: env.SMTP_PASS_RESTORE_PASSWORD }
      })
    }
  }

  async sendHTML(from: FromEmails, to: string, subject: string, html: string) {
    const transport = this.transports[from]

    if (!transport)
      throw new Error(`Can't send email from address "${from}"`)

    const text = htmlToText(html)

    await transport.sendMail({
      from,
      to,
      subject,
      html,
      text
    })
  }
}
