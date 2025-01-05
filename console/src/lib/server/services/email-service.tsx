import { createSecretKey, type KeyObject } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { addHours, differenceInHours } from "date-fns";
import {
  Account,
  AccountInvite,
  PrismaClient,
  User,
  UserContact,
} from "@prisma/client";
import { prismaClient } from "@/lib/server/prisma-client";
import { render } from "@react-email/components";
import ResetPasswordEmail from "@/emails/reset-password/reset-password";
import { maskNumber, unmaskNumber } from "@/lib/server/keymask";
import AccountRemovalNotificationEmail from "@/emails/account-removal-notification";
import AccountRemovalConfirmation from "@/emails/account-removal-confirmation-email";
import { env } from "@/lib/env";
import { getEmailClient } from "./instances";
import AccountJoinInvite from "@/emails/account-join-email/account-join-email";

export class EmailService {
  private prisma: PrismaClient;
  private siteOrigin: string;
  private secretKey: KeyObject;
  private tokenResetPasswordValidityPeriodInHours = 24;
  private tokenDeleteAccountValidityPeriodInHours = 24;
  private tokenAccountJoinValidityPeriodInHours = 24;

  get emailClient() {
    return getEmailClient();
  }

  constructor() {
    this.prisma = prismaClient;
    this.siteOrigin = env.SITE_ORIGIN;
    this.secretKey = createSecretKey(env.JWT_SECRET, "utf-8");
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

      await this.emailClient.sendHTML(
        "restore-password@titorelli.ru",
        contact.email,
        "Восстановление пароля на платформе Titorelli",
        emailHtml,
      );
    }
  }

  async sendDeleteAccountConfirmationEmail(accountId: number) {
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

    if (!ownerMember.user) throw new Error("Owner model don't have user");

    for (const { email } of ownerMember.user.contacts) {
      if (email == null) continue;
      if (email === "") continue;

      const emailHtml = await render(
        <AccountRemovalConfirmation
          ownerName={ownerMember.user.username}
          accountName={ownerMember.account.name}
          confirmationLink={await this.getAccountDeletionConfirmationHref(
            accountId,
            ownerMember.user.id,
          )}
          cancellationLink={await this.getAccountDeletionCancellationHref(
            accountId,
            ownerMember.user.id,
          )}
        />,
      );

      await this.emailClient.sendHTML(
        "noreply@titorelli.ru",
        email,
        `Подтвердите удаление аккаунта "${ownerMember.account.name}" на Titorelli`,
        emailHtml,
      );
    }

    return true;
  }

  async sendInviteToEmail(
    email: string,
    account: Account,
    invite: AccountInvite,
  ) {
    if (!invite.email)
      throw new Error(
        `In invite with id = ${invite.id} email props doesn't set `,
      );

    const ownerMember = await this.prisma.accountMember.findFirst({
      where: {
        accountId: account.id,
        role: "owner",
      },
      include: {
        user: true,
      },
    });

    if (!ownerMember)
      throw new Error(`Owner can't be found in account id = ${account.id}`);

    const joinLink = await this.getAccountJoinHref(invite);

    const emailHtml = await render(
      <AccountJoinInvite
        inviteeEmail={invite.email}
        inviterName={ownerMember.user.username}
        projectName={account.name}
        invitedRole={invite.role}
        joinLink={joinLink}
      />,
    );

    await this.emailClient.sendHTML(
      "noreply@titorelli.ru",
      email,
      `Вас пригласили в аккаунт "${account.name}" на Titorelli`,
      emailHtml,
    );
  }

  private async getAccountJoinHref(invite: AccountInvite) {
    const [token] = await this.generateAccountJoinToken(invite.id);

    return `${this.siteOrigin}/from-email/account-join-confirmation?t=${token}`;
  }

  private async getAccountDeletionConfirmationHref(
    accountId: number,
    userId: number,
  ) {
    const [token] = await this.generateDeleteAccountToken(accountId, userId);

    return `${this.siteOrigin}/from-email/account-delete-confirmation?t=${token}`;
  }

  private async getAccountDeletionCancellationHref(
    accountId: number,
    userId: number,
  ) {
    const [token] = await this.generateKeepAccountToken(accountId, userId);

    return `${this.siteOrigin}/from-email/account-delete-cancellation?t=${token}`;
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

    if (!ownerMember.user) throw new Error("Owner member not have user");

    for (const member of members) {
      if (!member.user) continue;

      const { user, account } = member;

      for (const { email } of user?.contacts ?? []) {
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

        await this.emailClient.sendHTML(
          "noreply@titorelli.ru",
          email,
          `Удаление аккаунта "${account.name}" на Titorelli`,
          emailHtml,
        );
      }
    }
  }

  /**
   * @todo
   * Обработать ситуацию, когда токен на восстановление
   * пароля неверный или протух
   */
  async validateRestorePasswordTokenFromEmail(token: string) {
    const tokenValid = await this.verifyToken(token);

    if (!tokenValid) return false;

    const resetPasswordRequest =
      await this.prisma.userResetPasswordRequest.findFirst({
        where: {
          token,
        },
      });

    if (!resetPasswordRequest) return false;

    const { expiredAt } = resetPasswordRequest;

    /**
     * @todo Fix `expired` calculation. Now it's just wrong
     */
    const expired =
      differenceInHours(new Date(), expiredAt) >
      this.tokenResetPasswordValidityPeriodInHours;

    if (expired) {
      return false;
    }

    return true;
  }

  async validateAccountJoinTokenFromEmail(token: string) {
    const tokenValid = await this.verifyToken(token);

    if (!tokenValid) return false;

    const payload = await this.parseAccountJoinTokenFromEmail(token);

    if (!payload) return false;

    const inviteId = unmaskNumber(payload.inviteId);

    const invite = await this.prisma.accountInvite.findFirst({
      where: {
        id: inviteId,
      },
    });

    if (!invite) return false;

    const expired = invite.expiredAt.getTime() - new Date().getTime() < 0;

    if (expired) {
      return false;
    }

    return true;
  }

  async parseRestorePasswordTokenFromEmail(token: string) {
    if (!(await this.validateRestorePasswordTokenFromEmail(token))) return null;

    const { payload } = await jwtVerify(token, this.secretKey);

    return payload;
  }

  async parseAccountJoinTokenFromEmail(token: string) {
    const { payload } = await jwtVerify(token, this.secretKey);

    return payload as typeof payload & { inviteId: string };
  }

  private async verifyToken(token: string) {
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
    const expiredAt = addHours(
      new Date(),
      this.tokenResetPasswordValidityPeriodInHours,
    );
    const token = await new SignJWT({
      sub: maskNumber(userId),
      exp: expiredAt.getTime() / 1000, // Date in future in seconds
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  private async generateDeleteAccountToken(accountId: number, userId: number) {
    const expiredAt = addHours(
      new Date(),
      this.tokenDeleteAccountValidityPeriodInHours,
    );
    const token = await new SignJWT({
      sub: maskNumber(userId),
      accountId: maskNumber(accountId),
      exp: expiredAt.getTime() / 1000, // Date in future in seconds
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  private async generateKeepAccountToken(accountId: number, userId: number) {
    const expiredAt = addHours(
      new Date(),
      this.tokenDeleteAccountValidityPeriodInHours,
    );
    const token = await new SignJWT({
      sub: maskNumber(userId),
      accountId: maskNumber(accountId),
      exp: expiredAt.getTime() / 1000, // Date in future in seconds
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  private async generateAccountJoinToken(inviteId: number) {
    const expiredAt = addHours(
      new Date(),
      this.tokenAccountJoinValidityPeriodInHours,
    );
    const token = await new SignJWT({
      inviteId: maskNumber(inviteId),
      exp: expiredAt.getTime() / 1000,
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  /**
   * @todo Maybe get rid of concept of separate request
   */
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
