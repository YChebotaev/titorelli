import { JSONSchema, Model } from 'objection'

export class AccountModel extends Model {
  static tableName = 'accounts'
  static idColumn = 'id'

  id: number
  name: string
  administratorIds: number[]
  createdAt: Date
  updatedAt: Date

  static jsonSchema: JSONSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string', maxLength: 48 },
      administratorIds: {
        type: 'array',
        items: { type: 'number' }
      },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' }
    }
  };


}
