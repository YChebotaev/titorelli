import path from 'node:path'
import fastify from 'fastify'
import { ModelsStore } from '@titorelli/model'

const store = new ModelsStore(
  path.join(__dirname, 'data'),
  'ensemble'
)
const service = fastify()

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
    },
    response: {
      200: {
        type: 'object',
        properties: {
          timing: { type: 'number' },
          value: { type: 'string' },
          confidence: { type: 'number' },
        }
      }
    }
  },
  async handler({ params: { modelId }, body: { text } }) {
    const startTime = new Date()

    const model = await store.getOrCreate(modelId)

    const prediction = await model.predict({ text })

    const timeDelta = new Date().getTime() - startTime.getTime()

    return {
      timing: timeDelta,
      ...prediction
    }
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
    const model = await store.getOrCreate(modelId)

    await model.train({ text, label })
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
    const model = await store.getOrCreate(modelId)

    await model.trainBulk(examples)
  }
})

service.listen({
  port: Number(process.env['PORT'] ?? 3000),
  host: process.env['HOST'] ?? '0.0.0.0'
})
