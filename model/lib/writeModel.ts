import { writeFile } from 'node:fs/promises'
import { Model } from '../types'

export const writeModel = async (filename: string, model: Model) => {
  await writeFile(filename, JSON.stringify(model, null, 2), 'utf-8')
}
