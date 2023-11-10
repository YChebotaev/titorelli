import path from 'node:path'
import { existsSync } from 'node:fs'
import fastify from 'fastify'
import { mkdirp } from 'mkdirp'
import {
  readModel,
  createModel,
  predict,
  train,
  trainBulk,
  writeModel,
  type Model
} from '@titorelli/model'

const service = fastify()

const readOrCreateModel = async (modelId: string) => {
  const modelDirname = path.join(__dirname, 'data')
  await mkdirp(modelDirname)
  const modelFilename = path.join(modelDirname, `${modelId}.json`)
  let model: Model

  if (existsSync(modelFilename)) {
    model = await readModel(modelFilename)
  } else {
    model = await createModel(modelFilename, 'ru')
  }

  return {
    model,
    filename: modelFilename
  }
}

service.post<{
  Body: {
    text: string
  },
  Params: {
    modelId: string
  }
}>('/:modelId/predict', {
  schema: {
    body: {
      type: 'object',
      required: ['text'],
      properties: {
        text: {
          type: 'string'
        }
      }
    }
  },
  async handler({ params: { modelId }, body: { text } }) {
    const { model } = await readOrCreateModel(modelId)

    return predict(model, { text })
  }
})

service.post<{
  Body: {
    label: 'spam' | 'ham'
    text: string
  }
  Params: {
    modelId: string
  }
}>('/:modelId/train', {
  schema: {
    body: {
      type: 'object',
      required: ['text'],
      properties: {
        label: {
          enum: ['spam', 'ham']
        },
        text: {
          type: 'string'
        }
      }
    }
  },
  async handler({ params: { modelId }, body: { text, label } }) {
    const { model, filename: modelFilename } = await readOrCreateModel(modelId)

    train(model, { text, label })

    writeModel(modelFilename, model)
  }
})

service.post<{
  Body: {
    label: 'spam' | 'ham'
    text: string
  }[]
  Params: {
    modelId: string
  }
}>('/:modelId/train_bulk', {
  schema: {
    body: {
      type: 'array',
      items: {
        type: 'object',
        required: ['text', 'label'],
        properties: {
          label: {
            enum: ['spam', 'ham']
          },
          text: {
            type: 'string'
          }
        }
      }
    }
  },
  async handler({ params: { modelId }, body: examples }) {
    const { model, filename: modelFilename } = await readOrCreateModel(modelId)

    trainBulk(model, examples)

    writeModel(modelFilename, model)
  }
})

service.listen({
  port: Number(process.env['PORT'] ?? 3000),
  host: process.env['HOST'] ?? '0.0.0.0'
})
