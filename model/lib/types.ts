export interface ICas {
  has(id: number): Promise<boolean>
}

export interface ITotems {
  has(tgUserId: number): Promise<boolean>

  add(tgUserId: number): Promise<void>

  revoke(tgUserId: number): Promise<void>
}
