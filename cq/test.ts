import { test } from 'node:test'

import { CreateAccountCommand } from './commands'

test('Create account', async (t) => {
  const c = new CreateAccountCommand()

  await c.execute({
    accountName: '--test-account--',
    initiator: {
      name: '--test-user--',
      rawPassword: 'adonis11',
      contacts: [
        { type: 'email', email: "adonis@acme.com" }
      ]
    },
    passwordPepper: '--some-string--'
  })
})
