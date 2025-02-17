import pino from 'pino'
import { Bot } from './lib/Bot'

if (!process.env.TITORELLI_HOST) {
  throw new Error('TITORELLI_HOST environment variable must be provided')
}

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable must be provided')
}

if (!process.env.TITORELLI_CLIENT_ID) {
  throw new Error('TITORELLI_CLIENT_ID environment variable must be provided')
}

if (!process.env.TITORELLI_ACCESS_TOKEN) {
  throw new Error('TITORELLI_ACCESS_TOKEN environment variable must be provided')
}

const bot = new Bot({
  clientId: process.env.TITORELLI_CLIENT_ID,
  accessToken: process.env.TITORELLI_ACCESS_TOKEN,
  botToken: process.env.BOT_TOKEN,
  logger: pino(),
  titorelliServiceUrl: process.env.TITORELLI_HOST,
})

setInterval(() => { }, 3000)

// bot.launch()
//   .catch(() => process.exit(1))
//   .then(() => process.exit(0))
