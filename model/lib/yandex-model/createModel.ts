import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Model, StemmerLanguage } from "../../types";

export const createModel = async (filename: string, lang: StemmerLanguage) => {
  const model: Model = {
    type: 'yandex-gpt',
    lang,
    data: {
      modelId: path.parse(filename).name,
      newExamples: [],
      functionUrl: process.env.YANDEX_FUNCTION_URL
    }
  }

  await writeFile(filename, JSON.stringify(model, null, 2))

  return model
}
