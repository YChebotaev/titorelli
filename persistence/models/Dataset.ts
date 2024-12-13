import { Model } from 'objection'

export class DatasetModel extends Model {
  static tableName = 'datasets'
  static idColumn = 'id'
}
