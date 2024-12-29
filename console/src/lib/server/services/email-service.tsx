import { createSecretKey, type KeyObject } from "crypto";
import { jwtDecrypt, jwtVerify, SignJWT } from "jose";
import { createTransport, Transporter } from "nodemailer";
import { addHours, differenceInHours } from "date-fns";
import { PrismaClient, User, UserContact } from "@prisma/client";
import { prismaClient } from "@/lib/server/prisma-client";
import { render } from "@react-email/components";
import ResetPasswordEmail from "@/emails/reset-password/reset-password";
import { maskNumber } from "@/lib/server/keymask";

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
