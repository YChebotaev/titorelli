import { TitorelliClient } from './lib'

const client = new TitorelliClient({
  serviceUrl: 'http://localhost:3000',
  clientId: 'react_ru_bot',
  clientSecret: '--dummy-secret--'
})

client
  .model('react_ru')
  .predict({ text: 'Выиграл джекпот в слоте Dog House' })
  .then(prediction => console.log('prediction =', prediction))
