export type ClientScopes<M extends string = string> = `${M}_predict` | `${M}_train` | `${M}_train_bulk`

export type ServiceAuthClient = {
  id: string
  secret: string
  scopes: ClientScopes[]
}
