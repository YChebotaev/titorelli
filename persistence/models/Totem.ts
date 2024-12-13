import { Model } from 'objection'

export class TotemModel extends Model {
  static tableName = 'totems'
  static idColumn = 'id'
}
