import path from 'node:path'
import { unlinkSync } from 'node:fs'
import { Totems } from './lib/Totems'

const testFilename = path.join(__dirname, `totems-test_model.sqlite3`)

const main = async () => {
  const totems = new Totems(__dirname, 'test_model')

  await totems.add(8888)
  await totems.add(9999)

  if ((await totems.has(8888)) !== true)
    throw new Error('Totem has not be saved somehow')

  if ((await totems.has(1010)) !== false)
    throw new Error('Non-existing totems still exists somehoe')

  await totems.revoke(9999)

  if ((await totems.has(9999)) !== false)
    throw new Error('Totem has not be removed')

  unlinkSync(testFilename)
}

const performance = async () => {
  console.group('performance testing')

  const totems = new Totems(__dirname, 'test_model')

  console.time('insertion')
  for (let i = 0; i < 100000; i++) {
    await totems.add(i)
  }
  console.timeEnd('insertion')

  console.time('read')
  for (let i = 0; i < 100000; i++) {
    await totems.has(i)
  }
  console.timeEnd('read')

  unlinkSync(testFilename)

  console.groupEnd()
}

main()
  .catch(e => console.error(e))
  // .then(performance)
  .catch(e => console.error(e))
  .finally(() => process.exit(0))
