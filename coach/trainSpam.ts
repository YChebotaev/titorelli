import { readFileSync } from 'node:fs'

const spamDatasetText = readFileSync('data/spam.txt', 'utf-8')
const spamTexts: string[] = spamDatasetText
  .split('---')
  .map(text => text.trim())
  .slice(199)

const trainSpam = async () => {
  await fetch('https://titorelli.ru/react_ru/train_bulk', {
    method: 'POST',
    body: JSON.stringify(spamTexts.map(text => ({ label: 'spam', text }))),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

if (require.main === module) {
  trainSpam()
}
