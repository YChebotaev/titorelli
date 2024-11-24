import { readFile } from 'node:fs/promises'

import type { Model } from '../../types'

export const readModel = async (filename: string) => {
  const modelText = await readFile(filename, 'utf-8')
  const modelRaw = JSON.parse(modelText)
  const model: Model = modelRaw

  return model
}
