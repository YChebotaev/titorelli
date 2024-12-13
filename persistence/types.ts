export type UserContact = {
  type: 'email' | 'phone' | 'telegram-id',
  email?: string
  phone?: string
  tgUserId?: number
}
