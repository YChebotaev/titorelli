import { genericModelCode } from "@/constants";
import { prismaClient } from "../prisma-client";

export class ModelsService {
  private prisma = prismaClient

  public async list(accountId: number) {
    return this.prisma.classificationModel.findMany({
      where: { accountId }
    })
  }

  public async initGenericModel(accountId: number) {
    await this.prisma.classificationModel.create({
      data: {
        name: 'Generic',
        code: genericModelCode,
        description: 'Базовая, общая для всех модель',
        accountId
      }
    })
  }

  public async getModelIdByCode(accountId: number, code: string) {
    const model = await this.prisma.classificationModel.findFirst({
      where: { accountId, code }
    })

    return model?.id ?? null
  }
}
