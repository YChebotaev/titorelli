import Generator from "do-usernames";
import toKebab from "kebab-case";
import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../prisma-client";
import { ProfileAccountRoles } from "@/types/my-profile";

export class AccountService {
  private usernameGenerator = new Generator();
  private prisma: PrismaClient = prismaClient;

  async createDefaultAccountForUser(userId: number) {
    let name: string;

    do {
      name = this.generateAccountName();
    } while (await this.accountNameTaken(name));

    await this.createAccountWithSingleOwner(userId, name);
  }

  async createAccountWithNameForUser(userId: number, name: string) {
    if (await this.accountNameTaken(name)) {
      throw new Error(`Account name = "${name}" taken`);
    }

    await this.createAccountWithSingleOwner(userId, name);
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
      },
      include: {
        user: true,
      },
    });

    return memberships.map(({ user }) => user);
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

  private async accountNameTaken(name: string) {
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
