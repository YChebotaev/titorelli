import { Model } from 'objection'

export class CasModel extends Model {
  static tableName = 'cas'
  static idColumn = 'id'
}
