import Generator from "do-usernames";
import toKebab from "kebab-case";
import { Account, AccountMember, PrismaClient } from "@prisma/client";
import { prismaClient } from "../prisma-client";
import { ProfileAccountRoles } from "@/types/my-profile";
// import { EmailService } from "./email-service";
// import { UserService } from "./user-service";
import { mapAsync, mapFilter } from "@/lib/utils";
// import { InviteService } from "./invite-service";
import { getInviteService, getUserService } from "./instances";

export class AccountService {
  /**
   * `usernameGenerator` генерирует имена по Digital Ocean-овски,
   * т.е. на морскую тематику.
   * А надо генерировать на какую-то другую тематику, но с
   * таким же принципом
   */
  private usernameGenerator = new Generator();
  private prisma: PrismaClient = prismaClient;
  // private userService = new UserService();
  // private inviteService = new InviteService();

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

    await this.createAccountWithSingleOwner(userId, name);
  }

  /**
   * @todo
   * Обработать сценарий, когда название аккаунта занято
   */
  async createAccountWithNameForUser(userId: number, name: string) {
    if (await this.accountNameTaken(name)) {
      throw new Error(`Account name = "${name}" taken`);
    }

    await this.createAccountWithSingleOwner(userId, name);
  }

  async createAccountWithNameAndMembers(
    name: string,
    members: { identity: string; role: string }[],
  ) {
    if (await this.accountNameTaken(name))
      throw new Error(`Account name taken = "${name}"`);

    let checkpoint = 0;
    let account: Account;
    const newMembers: AccountMember[] = [];

    const getOrInviteAccountMember = async (
      accountId: number,
      identity: string,
      role: string,
    ) => {
      const user = await this.userService.getUserByIdentnty(identity);

      await this.inviteService.sendInviteToIdentity(identity, accountId, role);

      return user
        ? {
            accountId,
            role,
            userId: user.id,
          }
        : {
            accountId,
            role: "invited",
            invitedRole: role,
          };
    };

    try {
      account = await this.prisma.account.create({
        data: { name },
      });

      checkpoint += 1;

      for (const inputMember of members) {
        if (inputMember.role === "owner") continue;

        const insertMember = await getOrInviteAccountMember(
          account.id,
          inputMember.identity,
          inputMember.role,
        );

        newMembers.push(
          await this.prisma.accountMember.create({
            data: insertMember,
          }),
        );

        checkpoint += 1;
      }
    } catch (e) {
      console.error(e);

      if (checkpoint >= 1) {
        try {
          await this.prisma.account.delete({ where: { id: account!.id } });
        } catch (e) {
          // Just suppress error

          console.error(e);
        }
      }

      if (checkpoint > 1) {
        for (const newMember of newMembers) {
          try {
            await this.prisma.accountMember.delete({
              where: { id: newMember.id },
            });
          } catch (e) {
            // Just suppress error

            console.error(e);

            continue;
          }
        }
      }
    }
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
    await this.prisma.$transaction(async (t) => {
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
    });
  }
}
