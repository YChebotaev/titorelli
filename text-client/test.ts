import { TextClient } from './lib/TextClient'

const tc = new TextClient('http://localhost:8080')

const main = async () => {
  const id = await tc.put('Hello, world!')

  console.log('id:', id)

  const cont = await tc.get(id)

  console.log('content:', cont)

  const hsh = await tc.hash(cont)

  console.log('hash:', hsh)

  const h1 = await tc.has(cont)

  console.log('has by content:', h1)

  const h2 = await tc.has(id)

  console.log('has by id:', h2)

  console.log('client-hashing:', tc.getUUIDStringFromText(cont), await tc.hash(cont))
}

main()
