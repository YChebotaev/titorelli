import { JSONSchema, Model } from 'objection'

export class ModelModel extends Model {
  static tableName = 'models'
  static idColumn = 'id'

  id: number
  name: string
  version: number
  location: string
  datasetId: number
  parentId: number
  parentName: string
  properties: object
  accountId: number
  createdAt: Date
  updatedAt: Date

  static jsonSchema: JSONSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string', maxLength: 20 },
      version: { type: 'number' },
      location: { type: 'string', maxLength: 255 },
      datasetId: { type: 'number' },
      parentId: { type: 'number' },
      parentName: { type: 'string', maxLength: 20 },
      properties: { type: 'object' },
      accountId: { type: 'number' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    }
  }
}
