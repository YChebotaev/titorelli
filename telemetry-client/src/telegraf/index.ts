import { Composer, Context, deunionize } from 'telegraf'
import type { Update, Message } from 'telegraf/types'
import type { TelemetryClient } from '../core/TelemetryClient'

const getMessageType = (m: Message) => {
  if ('text' in m) {
    return 'text'
  } else
    if ('caption' in m) {
      return 'media'
    }
}

export const telegrafMiddleware = (client: TelemetryClient) => {
  const chatMemberHandler = (ctx: Context<Update>, next: () => Promise<void>) => {
    return next()
  }

  const editedMessageHandler = (ctx: Context<Update>, next: () => Promise<void>) => {
    return next()
  }

  const messageHandler = async (ctx: Context<Update>, next: () => Promise<void>) => {
    await client.trackSelfBotInfo({
      id: ctx.botInfo.id,
      firstName: ctx.botInfo.first_name,
      lastName: ctx.botInfo.last_name,
      username: ctx.botInfo.username,
      languageCode: ctx.botInfo.language_code,
      isPremium: ctx.botInfo.is_premium,
      addedToAttachmentMenu: ctx.botInfo.added_to_attachment_menu,
      isBot: ctx.botInfo.is_bot,
      canJoinGroups: ctx.botInfo.can_join_groups,
      canReadAllGroupMessages: ctx.botInfo.can_read_all_group_messages,
      supportsInlineQueries: ctx.botInfo.supports_inline_queries
    })

    const c = deunionize(ctx.chat)
    await client.trackChat({
      id: c.id,
      reporterTgBotId: ctx.botInfo.id,
      type: c.type,
      username: c.username,
      title: c.title,
      firstName: c.first_name,
      lastName: c.last_name,
      isForum: c.is_forum,
      description: Reflect.get(c, 'description'),
      bio: Reflect.get(c, 'bio')
    })

    await client.trackMemberInfo({
      id: ctx.from.id,
      reporterTgBotId: ctx.botInfo.id,
      isBot: ctx.from.is_bot,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      username: ctx.from.username,
      languageCode: ctx.from.language_code,
      isPremium: ctx.from.is_premium,
      addedToAttachmentMenu: ctx.from.added_to_attachment_menu
    })

    const m = deunionize(ctx.message)
    await client.trackMessage({
      id: m.message_id,
      reporterTgBotId: ctx.botInfo.id,
      type: getMessageType(ctx.message),
      threadId: m.message_thread_id,
      fromTgUserId: m.from.id,
      senderTgChatId: m.sender_chat?.id,
      date: m.date,
      tgChatId: m.chat.id,
      isTopic: m.is_topic_message,
      text: m.text,
      caption: m.caption
    })

    return next()
  }

  return new Composer((ctx, next) => {
    switch (ctx.updateType) {
      case 'chat_member': return chatMemberHandler(ctx, next)
      case 'edited_message': return editedMessageHandler(ctx, next)
      case 'message': return messageHandler(ctx, next)
      default:
        return next()
    }
  })
}
