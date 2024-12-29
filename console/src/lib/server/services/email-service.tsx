import { createTransport, Transporter } from "nodemailer";
import { PrismaClient, UserContact } from "@prisma/client";
import { prismaClient } from "@/lib/server/prisma-client";
import { render } from "@react-email/components";
import ResetPasswordEmail from "@/emails/reset-password/reset-password";

export class EmailService {
  private nodemailer: Transporter;
  private prisma: PrismaClient;
  private smtpHost = "mail.netangels.ru";
  private smptUser = "restore-password@titorelli.ru";
  private smtpPass: string;

  constructor() {
    if (!process.env.SMTP_PASS_RESTORE_PASSWORD)
      throw new Error(
        "SMTP_PASS_RESTORE_PASSWORD environment variable must be provided",
      );

    this.prisma = prismaClient;
    this.smtpPass = process.env.SMTP_PASS_RESTORE_PASSWORD;
    this.nodemailer = createTransport({
      host: this.smtpHost,
      secure: false,
      auth: {
        user: this.smptUser,
        pass: this.smtpPass,
      },
    });
  }

  async sendRestorePasswordEmail(userId: number, email: string | "*") {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error(`Can't find user with id = ${userId}`);

    const emailContacts: UserContact[] = [];

    if (email === "*") {
      const manyEmailContacts = await this.prisma.userContact.findMany({
        where: {
          userId: user.id,
          type: "email",
          emailConfirmed: true,
        },
      });

      emailContacts.push(...manyEmailContacts);
    } else {
      const emailContact = await this.prisma.userContact.findFirst({
        where: {
          userId: user.id,
          type: "email",
          email,
        },
      });

      if (emailContact) {
        emailContacts.push(emailContact);
      }
    }

    for (const contact of emailContacts) {
      if (!contact) continue;
      if (contact.email == null) continue;
      if (contact.email === "") continue;

      const emailHtml = await render(
        <ResetPasswordEmail userFirstName={user.username} />,
      );

      await this.nodemailer.sendMail({
        from: "restore-password@titorelli.ru",
        to: contact.email,
        subject: "Восстановление пароля на платформе Titorelli",
        html: emailHtml,
      });
    }
  }
}
