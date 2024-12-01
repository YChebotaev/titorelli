export type ClientScopes = 'predict' | 'train' | 'train_bulk'

export type ServiceAuthClient = {
  id: string
  secret: string
  scopes: ClientScopes[]
}
