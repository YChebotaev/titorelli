import type { Model, Prediction, UnlabeledExample } from '../../types'

export const predict = async (model: Model, { text }: UnlabeledExample): Promise<Prediction> => {
  const functionUrl = Reflect.get(model.data, 'functionUrl') as string
  const modelId = Reflect.get(model.data, 'modelId') as string
  const resp = await fetch(functionUrl, {
    method: 'POST',
    body: JSON.stringify({ modelId, text }),
    headers: { 'Content-Type': 'application/json' }
  })

  const { value, confidence } = await resp.json() as Awaited<Prediction>

  return { value, confidence }
}
