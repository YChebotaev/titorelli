export interface ICas {
  has(id: number): Promise<boolean>

  add(id: number): Promise<void>
}

export interface ITotems {
  has(tgUserId: number): Promise<boolean>

  add(tgUserId: number): Promise<void>

  revoke(tgUserId: number): Promise<void>

  onCreated(): void

  onRemoved(): void
}
