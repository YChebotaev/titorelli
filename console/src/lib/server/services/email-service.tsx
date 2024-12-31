import { createSecretKey, type KeyObject } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { createTransport, Transporter } from "nodemailer";
import { addHours, differenceInHours } from "date-fns";
import { PrismaClient, User, UserContact } from "@prisma/client";
import { prismaClient } from "@/lib/server/prisma-client";
import { render } from "@react-email/components";
import ResetPasswordEmail from "@/emails/reset-password/reset-password";
import { maskNumber } from "@/lib/server/keymask";
import { AccountRemovalNotificationEmail } from "@/emails/account-removal-notification";
import AccountRemovalConfirmation from "@/emails/account-removal-confirmation-email/account-removal-confirmation-email";

export class EmailService {
  private nodemailer: Transporter;
  private prisma: PrismaClient;
  private smtpHost = "mail.netangels.ru";
  private smptUser = "restore-password@titorelli.ru";
  private smtpPass: string;
  private siteOrigin: string;
  private secretKey: KeyObject;
  private tokenValidityPeriodInHours = 24;

  constructor() {
    if (!process.env.SMTP_PASS_RESTORE_PASSWORD)
      throw new Error(
        "SMTP_PASS_RESTORE_PASSWORD environment variable must be provided",
      );

    if (!process.env.SITE_ORIGIN)
      throw new Error("SITE_ORIGIN environment variable must be provided");

    if (!process.env.JWT_SECRET)
      throw new Error("JWT_SECRET environment variable must be provided");

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
    this.siteOrigin = process.env.SITE_ORIGIN;
    this.secretKey = createSecretKey(process.env.JWT_SECRET, "utf-8");
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

      const resetHref = await this.getResetPasswordHref(user);
      const emailHtml = await render(
        <ResetPasswordEmail username={user.username} resetHref={resetHref} />,
      );

      await this.nodemailer.sendMail({
        from: "restore-password@titorelli.ru",
        to: contact.email,
        subject: "Восстановление пароля на платформе Titorelli",
        html: emailHtml,
      });
    }
  }

  async sendWipeAccountConfirmationEmail(accountId: number) {
    const ownerMember = await this.prisma.accountMember.findFirst({
      where: {
        accountId,
        role: "owner",
      },
      include: {
        user: {
          include: {
            contacts: {
              where: { type: "email", emailConfirmed: true },
            },
          },
        },
        account: true,
      },
    });

    if (!ownerMember)
      throw new Error(
        `Account owner not found in account id = ${accountId} members list`,
      );

    for (const { email } of ownerMember.user.contacts) {
      if (email == null) continue;
      if (email === "") continue;

      const emailHtml = await render(
        <AccountRemovalConfirmation
          ownerName={ownerMember.user.username}
          accountName={ownerMember.account.name}
          confirmationLink={await this.getAccountRemovalConfirmationHref(
            accountId,
          )}
          cancellationLink={await this.getAccountRemovalCancellationHref(
            accountId,
          )}
        />,
      );

      await this.nodemailer.sendMail({
        from: "noreply@titorelli.ru",
        to: email,
        subject: `Подтвердите удаление аккаунта "${ownerMember.account.name}" на Titorelli`,
        html: emailHtml,
      });
    }

    return null;
  }

  private async getAccountRemovalConfirmationHref(accountId: number) {
    return "";
  }

  private async getAccountRemovalCancellationHref(accountId: number) {
    return "";
  }

  async sendWipeAccountNotificationEmail(accountId: number) {
    const members = await this.prisma.accountMember.findMany({
      where: { accountId },
      include: {
        user: {
          include: {
            contacts: {
              where: {
                type: "email",
                emailConfirmed: true,
              },
            },
          },
        },
        account: true,
      },
    });

    const ownerMember = members.find(({ role }) => role === "owner");

    if (!ownerMember)
      throw new Error(
        `Account owner not found in account id = ${accountId} members list`,
      );

    for (const {
      user,
      user: { contacts },
      account,
    } of members) {
      for (const { email } of contacts) {
        if (email == null) continue;
        if (email === "") continue;

        const emailHtml = await render(
          <AccountRemovalNotificationEmail
            memberName={user.username}
            accountName={account.name}
            ownerName={ownerMember.user.username}
            supportLink={`${this.siteOrigin}/support`}
          />,
        );

        await this.nodemailer.sendMail({
          from: "noreply@titorelli.ru",
          to: email,
          subject: `Удаление аккаунта "${account.name}" на Titorelli`,
          html: emailHtml,
        });
      }
    }
  }

  async validateRestorePasswordTokenFromEmail(token: string) {
    const tokenValid = await this.verifyRestoreToken(token);

    if (!tokenValid) return false;

    const resetPasswordRequest =
      await this.prisma.userResetPasswordRequest.findFirst({
        where: {
          token,
        },
      });

    if (!resetPasswordRequest) return false;

    const { expiredAt } = resetPasswordRequest;

    const expired =
      differenceInHours(new Date(), expiredAt) >
      this.tokenValidityPeriodInHours;

    if (expired) {
      return false;
    }

    return true;
  }

  async parseRestorePasswordTokenFromEmail(token: string) {
    if (!(await this.validateRestorePasswordTokenFromEmail(token))) return null;

    console.log("token =", token);

    const { payload } = await jwtVerify(token, this.secretKey);

    return payload;
  }

  private async verifyRestoreToken(token: string) {
    try {
      await jwtVerify(token, this.secretKey);

      return true;
    } catch (e: unknown) {
      console.error(e);

      return false;
    }
  }

  private async getResetPasswordHref(user: User) {
    const [token, expiredAt] = await this.generateResetPasswordToken(user.id);

    await this.createResetPasswordRequest(user.id, token, expiredAt);

    const url = new URL(
      `/authorization/restore/reset/${token}`,
      this.siteOrigin,
    );

    return url.toString();
  }

  private async generateResetPasswordToken(
    userId: number,
  ): Promise<[string, Date]> {
    const expiredAt = addHours(new Date(), this.tokenValidityPeriodInHours);
    const token = await new SignJWT({
      sub: maskNumber(userId),
      exp: expiredAt.getTime() / 1000, // Date in future in seconds
    })
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  private async createResetPasswordRequest(
    userId: number,
    token: string,
    expiredAt: Date,
  ) {
    await this.prisma.userResetPasswordRequest.create({
      data: {
        token,
        expiredAt,
        userId: userId,
      },
    });
  }
}
