import path from 'node:path'
import { Db } from "../Db"
import { ChatRepository } from './repositories/ChatRepository'
import { ExampleRepository } from './repositories/ExampleRepository'
import { LabelRepository } from './repositories/LabelRepository'
import { MemberRepository } from './repositories/MemberRepository'

export class MarkupServer {
  private db = new Db(process.env.MARKUP_DB_FILENAME ?? path.join(process.cwd(), 'markup.sqlite3'))
  private chatRepository = new ChatRepository(this.db)
  private exampleRepository = new ExampleRepository(this.db)
  private labelRepository = new LabelRepository(this.db)
  private memberRepository = new MemberRepository(this.db)

  upsertChat(...args: Parameters<ChatRepository['upsert']>) {
    return this.chatRepository.upsert(...args)
  }

  insertExample(...args: Parameters<ExampleRepository['insert']>) {
    return this.exampleRepository.insert(...args)
  }

  insertLabel(...args: Parameters<LabelRepository['insert']>) {
    return this.labelRepository.insert(...args)
  }

  insertMember(...args: Parameters<MemberRepository['upsert']>) {
    return this.memberRepository.upsert(...args)
  }

  upsertMemberUsername(...args: Parameters<MemberRepository['upsertUsername']>) {
    return this.memberRepository.upsertUsername(...args)
  }

  upsertMemberFirstName(...args: Parameters<MemberRepository['upsertFirstname']>) {
    return this.memberRepository.upsertFirstname(...args)
  }

  upsertMemberLastName(...args: Parameters<MemberRepository['upsertLastname']>) {
    return this.memberRepository.upsertLastname(...args)
  }

  listChatsByBotId(...args: Parameters<ChatRepository['listByBotId']>) {
    return this.chatRepository.listByBotId(...args)
  }

  listExamplesByChatId(...args: Parameters<ExampleRepository['listByChatId']>) {
    return this.exampleRepository.listByChatId(...args)
  }

  listLabelsByMessageIdAndAuthor(...args: Parameters<LabelRepository['listByMessageIdAndAuthor']>) {
    return this.labelRepository.listByMessageIdAndAuthor(...args)
  }

  getMemberByTgUserId(...args: Parameters<MemberRepository['getByTgUserId']>) {
    return this.memberRepository.getByTgUserId(...args)
  }
}
