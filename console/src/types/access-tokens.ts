export type AccessTokenVm = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type AccessTokenCreatedRequestDataVm = {
  name: string
  description?: string
}

export type AccessTokenCreatedResultVm = {
  token: string
}
