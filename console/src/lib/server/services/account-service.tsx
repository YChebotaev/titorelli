import Generator from "do-usernames";
import toKebab from "kebab-case";
import { PrismaClient } from "@prisma/client";
import { ProfileAccountRoles } from "@/types/my-profile";
import { mapFilter, mapFilterAsync } from "@/lib/utils";
import { getInviteService, getUserService } from "./instances";
import { prismaClient } from "../prisma-client";
import { addHours } from "date-fns";
import { first, forEach, groupBy } from "lodash";

export class AccountService {
  /**
   * `usernameGenerator` генерирует имена по Digital Ocean-овски,
   * т.е. на морскую тематику.
   * А надо генерировать на какую-то другую тематику, но с
   * таким же принципом
   */
  private usernameGenerator = new Generator();
  private prisma: PrismaClient = prismaClient;
  private inviteValidityPeriodInHours = 72;

  get userService() {
    return getUserService();
  }

  get inviteService() {
    return getInviteService();
  }

  async getAccount(accountId: number) {
    return this.prisma.account.findFirst({
      where: { id: accountId },
    });
  }

  /**
   * @todo
   * Нужно понять, что происходит и что делать,
   * когда не удалось сгенерировать имя с `attemptLeft`
   * попыток. Вероятно, это означает, что все имена уже заняты
   * Но, поскольку аккаунт идентифицируется только с помощью имени,
   * это важно, чтобы все они были уникальными
   * Задача на подумать
   */
  async createDefaultAccountForUser(userId: number) {
    let name: string;
    let attemptLeft = 10;

    do {
      attemptLeft -= 1;

      name = this.generateAccountName();

      if (!attemptLeft) throw new Error("Account name generation hangs");
    } while (await this.accountNameTaken(name));

    return this.createAccountWithSingleOwner(userId, name);
  }

  /**
   * @todo
   * Обработать сценарий, когда название аккаунта занято
   */
  async createAccountWithNameForUser(userId: number, name: string) {
    if (await this.accountNameTaken(name)) {
      throw new Error(`Account name = "${name}" taken`);
    }

    return this.createAccountWithSingleOwner(userId, name);
  }

  async createAccountAndInviteMembers(
    ownerUserId: number,
    accountName: string,
    members: { identity: string; role: string }[],
  ) {
    if (await this.accountNameTaken(accountName)) {
      throw new Error(`Account name = "${name}" taken`);
    }

    const createdInvites = await this.prisma.$transaction(async (t) => {
      const account = await t.account.create({
        data: {
          name: accountName,
        },
      });

      await t.accountMember.create({
        data: {
          role: "owner",
          accountId: account.id,
          userId: ownerUserId,
        },
      });

      const inviteInputs = await mapFilterAsync(
        members,
        async ({ identity, role }) => {
          const identityType = this.userService.getIdentityType(identity);

          if (!identityType) return null;

          const user = await this.userService.getUserByIdentnty(identity);

          if (user?.id === ownerUserId) return null;

          return {
            role,
            userId: user?.id ?? undefined,
            identityType,
            email: identityType === "email" ? identity : undefined,
            phone: identityType === "phone" ? identity : undefined,
            username: identityType === "username" ? identity : undefined,
            accountId: account.id,
            expiredAt: addHours(new Date(), this.inviteValidityPeriodInHours),
          };
        },
      );

      const uniqueByUserIdInviteInputs: typeof inviteInputs = [];

      forEach(groupBy(inviteInputs, "userId"), (invites, userIdStr) => {
        if (userIdStr === "undefined") {
          uniqueByUserIdInviteInputs.push(...invites);
        } else {
          uniqueByUserIdInviteInputs.push(first(invites)!);
        }
      });

      const createdInvites = await t.accountInvite.createManyAndReturn({
        data: uniqueByUserIdInviteInputs,
      });

      return createdInvites;
    });

    await this.inviteService.sendInvites(createdInvites);
  }

  /**
   * @todo Излишний запрос, подумать как избавиться
   */
  async getUserRoleInAccount(userId: number, accountId: number) {
    const membership = await this.prisma.accountMember.findFirst({
      where: {
        userId,
        accountId,
      },
    });

    return ((membership?.role ?? null) as ProfileAccountRoles) || null;
  }

  /**
   * @todo
   * Rewrite to query `accountMember`
   */
  async getAccountsUserMemberOf(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        accountMembership: {
          include: {
            account: {
              include: {
                members: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const accounts = user?.accountMembership.map(({ account }) => account);

    return accounts ?? [];
  }

  async getAccountUserMemberOf(userId: number, accountId: number) {
    const accountMember = await this.prisma.accountMember.findFirst({
      where: { userId, accountId },
      include: {
        account: true,
      },
    });

    return accountMember?.account ?? null;
  }

  async countAccountsUserMemberOf(userId: number) {
    return this.prisma.accountMember.count({
      where: { userId },
    });
  }

  async getAccountMembers(accountId: number) {
    const memberships = await this.prisma.accountMember.findMany({
      where: {
        accountId,
        role: { not: "invited" },
      },
      include: {
        user: true,
      },
    });

    return mapFilter(memberships, ({ user }) => user);
  }

  async countAccountMembers(accountId: number) {
    return this.prisma.accountMember.count({
      where: { accountId },
    });
  }

  /**
   * @todo Добавить удаление других объектов
   */
  async wipeAndRemoveAccount(accountId: number) {
    await this.prisma.$transaction(async (t) => {
      await t.accountMember.deleteMany({
        where: {
          accountId,
        },
      });

      await t.account.delete({
        where: {
          id: accountId,
        },
      });
    });

    return true;
  }

  async transferOwnership(accountId: number, newOwnerId: number) {
    return this.prisma.$transaction(async (t) => {
      const newOwnerMember = await t.accountMember.findFirst({
        where: { accountId, userId: newOwnerId },
      });
      const oldOwnerMember = await t.accountMember.findFirst({
        where: { accountId, role: "owner" },
      });

      if (!newOwnerMember || !oldOwnerMember) return false;

      await t.accountMember.update({
        where: { id: newOwnerMember.id },
        data: { role: "owner" },
      });

      await t.accountMember.update({
        where: { id: oldOwnerMember.id },
        data: { role: "editor" },
      });

      return true;
    });
  }

  private generateAccountName() {
    return toKebab(this.usernameGenerator.getName(), false)!;
  }

  async accountNameTaken(name: string) {
    const count = await this.prisma.account.count({
      where: {
        name,
      },
    });

    return count > 0;
  }

  private async createAccountWithSingleOwner(userId: number, name: string) {
    return this.prisma.$transaction(async (t) => {
      const account = await t.account.create({
        data: {
          name,
        },
      });

      await t.accountMember.create({
        data: {
          role: "owner",
          accountId: account.id,
          userId,
        },
      });

      return account.id;
    });
  }
}
