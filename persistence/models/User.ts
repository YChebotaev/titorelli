import { randomBytes, createHash } from 'node:crypto'
import { JSONSchema, Model } from 'objection'
import { UserContact } from '../types'

export class UserModel extends Model {
  static tableName = 'users'
  static idColumn = 'id'

  id: number
  name: string
  passwordHash: string
  passwordSalt: string
  contacts: UserContact[]
  accountId: number
  createdAt: Date
  updatedAt: Date

  static jsonSchema: JSONSchema = {
    type: 'object',
    properties: {
      name: { type: 'string', maxLength: 48 },
      passwordHash: { type: 'string', maxLength: 255 },
      passwordSalt: { type: 'string', maxLength: 255 },
      contacts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { enum: ['email', 'phone', 'telegram-id'] },
            email: { type: 'string', maxLength: 255 },
            phone: { type: 'string', maxLength: 255 },
            tgUserId: { type: 'string', maxLength: 255 }
          }
        }
      }
    }
  }

  static async createPassword(rawPassword: string, passwordPepper: string, passwordSalt = randomBytes(32).toString('hex')) {
    const passwordHash = createHash('sha-256')
      .update(rawPassword)
      .update(passwordSalt)
      .update(passwordPepper)
      .digest('hex')

    return [passwordHash, passwordSalt]
  }

  async challengePassword(rawPassword: string, passwordPepper: string) {
    const rawPasswordHash = createHash('sha-256')
      .update(rawPassword)
      .update(this.passwordSalt)
      .update(passwordPepper)
      .digest('hex')

    return rawPasswordHash === this.passwordHash
  }
}
