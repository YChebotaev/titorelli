import { MarkupServer } from "./markup/MarkupServer";
import { TelemetryServer } from "./telemetry/TelemetryServer";

/**
 * @deprecated
 */
export class TelemetryToMarkupBridge {
  constructor(
    private markup: MarkupServer,
    private telemetry: TelemetryServer
  ) {

    this.telemetry.on('track:chat', chat => {
      this.markup.upsertChat(0, chat.id, chat.title)
    })

    this.telemetry.on('track:member', member => {
      this.markup.insertMember({
        tgUserId: member.id,
        languageCode: member.languageCode,
        isPremium: member.isPremium
      })
        .then(memberId => {
          this.markup.upsertMemberUsername(memberId, member.username)
          this.markup.upsertMemberLastName(memberId, member.lastName)
          this.markup.upsertMemberFirstName(memberId, member.firstName)
        })      
    })

    this.telemetry.on('track:message', message => {
      this.markup.insertExample({
        tgMessageId: message.id,
        tgChatId: message.tgChatId,
        date: message.date,
        text: message.text,
        caption: message.caption
      })
    })

    this.telemetry.on('track:prediction', prediction => {
      this.markup.insertLabel({
        tgMessageId: prediction.tgMessageId,
        tgChatId: 0,
        label: prediction.label,
        issuer: prediction.reason
      })
    })
  }
}
