import { Model } from 'objection'

export class ExampleModel extends Model {
  static tableName = 'examples'
  static idColumn = 'id'
}
