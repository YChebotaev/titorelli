import { appendFileSync, renameSync } from 'node:fs'
import { examples } from './examples'

export const start = () => {
  renameSync('data/yandex-dataset.json', 'data/yandex-dataset.old.json')

  for (const { text, type } of examples) {
    if (text.trim().length === 0) continue
    if (text.trim().length >= 10000) continue

    const data = {
      text,
      'спам': type === 'spam' ? 1 : 0,
      'не спам': type === 'ham' ? 1 : 0
    }
    const line = JSON.stringify(data)

    appendFileSync('data/yandex-dataset.json', line + '\n', 'utf-8')
  }
}
