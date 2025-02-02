export type FolderTypes = "by-chat" | "by-model";

export type DMChat = {
  id: string | number
  tgChatId: number
  tgBotId: number
  name: string
  latestExample: DMExample
  updatedAt: string
  createdAt: string
}

export type DMExample = {
  id: string | number
  tgMessageId: number
  tgChatId: number
  date: number
  text: string
  caption: string
  createdAt: string
}
