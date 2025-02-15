import { maskNumber } from "@/lib/server/keymask"
import { ManagedBot } from "@prisma/client"

export type BotState = "created" | "starting" | "running" | "stopping" | "stopped" | "failed"

export type BotCreateRequestDataVm = {
  name: string
  description: string
  bypassTelemetry: boolean
  modelCode: string
  accessTokenId: string
  tgBotToken: string
}

export interface BotVm {
  id: string
  name: string
  description: string
  state: BotState
  bypassTelemetry: boolean
  accessTokenId: string
  modelId: string
  createdAt: string
}

export type BotStateChangeRequestDataVm = {
  id: string
  state: BotState
}

export type BotStateChangeResultVm = {
  state: BotState
}

export const mapBotDtoToVm = ({ id, name, description, state, bypassTelemetry, accessTokenId, modelId, createdAt }: ManagedBot): BotVm => ({
  id: maskNumber(id),
  name,
  description,
  state: state as BotState,
  bypassTelemetry,
  accessTokenId: maskNumber(accessTokenId),
  modelId: maskNumber(modelId),
  createdAt: createdAt.toISOString()
})
