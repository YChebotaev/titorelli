import { AccountModel, UserContact, UserModel } from '@titorelli/persistence'
import type { ICommand } from '../lib'

export type CreateAccountProps = {
  accountName: string
  initiator: {
    name: string
    rawPassword: string
    contacts: UserContact[]
  }
  passwordPepper: string
}

export class CreateAccountCommand implements ICommand<CreateAccountProps> {
  async execute({ accountName, initiator: { name, rawPassword, contacts }, passwordPepper }: CreateAccountProps): Promise<void> {
    await AccountModel.transaction(async (t) => {
      const newAccount = await AccountModel.query(t).insert({
        name: accountName,
        administratorIds: []
      })

      const [passwordHash, passwordSalt] = await UserModel.createPassword(rawPassword, passwordPepper)

      const newUser = await UserModel.query(t).insert({
        name,
        passwordHash,
        passwordSalt,
        contacts,
        accountId: newAccount.id
      })

      await newAccount.$query(t).patch({ administratorIds: [newUser.id] })
    })
  }
}
