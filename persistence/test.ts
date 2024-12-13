import './setup-model'

import { ExampleModel } from './index'

const main = async () => {
  const foo = await ExampleModel.query().insert({
    text: 'Hello, world!',
    textHash: '123131',
    tgUserId: 13,
    tgChatId: 12,
    modelId: 'react_ru',
    label: 'spam',
    classifier: 'logistic-regression',
    confidence: 0.9231,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  console.log('foo =', foo)
}

main()
  .catch(e => console.error(e))
