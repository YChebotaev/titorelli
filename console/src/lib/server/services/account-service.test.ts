import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { AccountService } from './account-service'

describe('AccountService', async () => {
  it('Should construct with no arguments', () => {
    new AccountService()
  })

  it('Should generate account name', () => {
    const accountService = new AccountService()

    Reflect.set(accountService, 'usernameGenerator', {
      getName() {
        return 'MockName'
      }
    })

    const generateAccountName = Reflect.get(accountService, 'generateAccountName').bind(accountService)

    assert.equal(generateAccountName(), 'mock-name')
  })

  await it('Should return true if account name taken', async () => {
    const accountService = new AccountService()

    Reflect.set(accountService, 'prisma', {
      account: {
        count({ where: { name } }: { where: { name: string } }) {
          return name === 'name-taken'
        }
      }
    })

    const accountNameTaken = Reflect.get(accountService, 'accountNameTaken').bind(accountService)

    assert.equal(await accountNameTaken('name-taken'), true)
    assert.equal(await accountNameTaken('name-free'), false)
  })

  await it('Should create account with single owner', async () => {
    const accountService = new AccountService()

    Reflect.set(accountService, 'prisma', {
      $transaction(fn: any) {
        fn({
          account: {
            create({ data: { name } }: any) {
              assert.equal(name, 'dummy-name')

              return { id: 1337 }
            }
          },
          accountMember: {
            create({ data: { role, accountId, userId } }: any) {
              assert.equal(role, 'owner')
              assert.equal(accountId, 1337)
              assert.equal(userId, 13)
            }
          }
        })
      }
    })

    const createAccountWithSingleOwner = Reflect.get(accountService, 'createAccountWithSingleOwner').bind(accountService)

    await createAccountWithSingleOwner(13, 'dummy-name')
  })

  await it('Should create default account for user', async () => {
    const accountService = new AccountService()

    Reflect.set(accountService, 'generateAccountName', () => 'dummy-name')
    Reflect.set(accountService, 'accountNameTaken', () => false)
    Reflect.set(accountService, 'createAccountWithSingleOwner', () => { })

    const createDefaultAccountForUser = Reflect.get(accountService, 'createDefaultAccountForUser').bind(accountService)

    assert.doesNotThrow(async () => {
      await createDefaultAccountForUser(14)
    })
  })

  await it('Should stop if 10 account names are taken', async () => {
    const accountService = new AccountService()

    Reflect.set(accountService, 'generateAccountName', () => 'dummy-name')
    Reflect.set(accountService, 'accountNameTaken', () => {
      console.log('!')

      return true
    })
    Reflect.set(accountService, 'createAccountWithSingleOwner', () => { })

    const createDefaultAccountForUser = Reflect.get(accountService, 'createDefaultAccountForUser').bind(accountService)

    await assert.rejects(createDefaultAccountForUser.bind(null, 14), { message: 'Account name generation hangs' })
  })

  await it('Should create account with name for user', async () => {
    const accountService = new AccountService()

    Reflect.set(accountService, 'createAccountWithSingleOwner', (userId: number, name: string) => {
      assert.equal(userId, 16)
      assert.equal(name, 'dummy-name')
    })

    const createAccountWithNameForUser = Reflect.get(accountService, 'createAccountWithNameForUser').bind(accountService)

    assert.doesNotThrow(createAccountWithNameForUser.bind(null, 16, 'dummy-name'))
  })

  await it('Should throw while creating account with name for user because account name is taken', async () => {
    const accountService = new AccountService()

    Reflect.set(accountService, 'accountNameTaken', () => true)

    Reflect.set(accountService, 'createAccountWithSingleOwner', (userId: number, name: string) => {
      assert.equal(userId, 16)
      assert.equal(name, 'dummy-name')
    })

    const createAccountWithNameForUser = Reflect.get(accountService, 'createAccountWithNameForUser').bind(accountService)

    assert.rejects(createAccountWithNameForUser.bind(null, 16, 'dummy-name'), { message: 'Account name = "dummy-name" taken' })
  })
})
