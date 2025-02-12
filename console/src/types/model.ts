import { maskNumber } from "@/lib/server/keymask"
import type { ClassificationModel } from "@prisma/client"

export type ModelVM = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export const mapModelDtoToVm = ({
  id,
  name,
  description,
  createdAt,
  updatedAt
}: ClassificationModel): ModelVM => ({
  id: maskNumber(id),
  name,
  description,
  createdAt: createdAt.toISOString(),
  updatedAt: updatedAt.toISOString()
})

