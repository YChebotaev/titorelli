import { Model } from 'objection'

export class BotModel extends Model {
  static tableName = 'bots'
  static idColumn = 'id'
}
