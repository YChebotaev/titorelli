import fastify, { type FastifyInstance } from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyJwt, { type FastifyJwtNamespace } from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { ModelsStore, Prediction } from "@titorelli/model"
import type { ClientScopes, ServiceAuthClient } from './types'
import { ICas } from '@titorelli/model/lib/types'

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'jwt' }> {
    verifyToken: Function
  }
}

export type ServiceConfig = {
  port: number
  host: string
  store: ModelsStore
  cas: ICas
  jwtSecret: string
  oauthClients: ServiceAuthClient[]
}

export type JwtTokenPayload = {
  sub: string,
  scopes: ClientScopes[]
}

export class Service {
  private ready: Promise<void>
  private store: ModelsStore
  private cas: ICas
  private service: FastifyInstance
  private port: number
  private host: string
  private jwtSecret: string
  private oauthClients: ServiceAuthClient[]

  constructor({ port, host, store, cas, jwtSecret, oauthClients }: ServiceConfig) {
    this.store = store
    this.cas = cas
    this.port = port
    this.host = host
    this.jwtSecret = jwtSecret
    this.oauthClients = oauthClients
    this.ready = this.initialize()
  }

  async listen() {
    await this.ready

    await this.service.listen({ port: this.port, host: this.host })
  }

  private async initialize() {
    const store = this.store
    const cas = this.cas

    this.service = fastify()

    const verifyToken = (req, reply, done) => {
      const token = this.service.jwt.lookupToken(req)

      try {
        this.service.jwt.verify(token)

        done()
      } catch (error) {
        reply.send(error)
      }
    }

    await this.service.register(fastifyFormbody)
    await this.service.register(fastifyJwt, { secret: this.jwtSecret })
    await this.service.register(fastifySwagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: "Titorelli api client",
          description: '',
          version: '0.1.0'
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Local dev server'
          },
          {
            url: 'https://titorelli.ru',
            description: 'Production server'
          }
        ]
      }
    })

    this.service.post<{
      Body: {
        text: string
        tgUserId?: number
      },
      Params: {
        modelId: string
      }
    }>('/:modelId/predict', {
      onRequest: [verifyToken],
      schema: {
        body: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string'
            },
            thUserId: { type: 'number' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              confidence: { type: 'number' },
            }
          }
        }
      },
      async handler(req) {
        const { params: { modelId }, body: { text, tgUserId } } = req
        const { sub, scopes } = this.jwt.decode<JwtTokenPayload>(this.jwt.lookupToken(req))

        if (!scopes || !scopes.includes('predict'))
          throw new Error(`Client with id = '${sub}' don't have scope 'predict' for this operation`)

        if (tgUserId != null) {
          const casBan = await cas.has(tgUserId)

          if (casBan) {
            return {
              value: 'spam',
              confidence: 1
            } as Prediction
          }
        }

        const model = await store.getOrCreate(modelId)

        return model.predict({ text })
      }
    })

    this.service.post<{
      Body: {
        label: 'spam' | 'ham'
        text: string
      }
      Params: {
        modelId: string
      }
    }>('/:modelId/train', {
      onRequest: [verifyToken],
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
      async handler(req) {
        const { params: { modelId }, body: { text, label } } = req
        const { sub, scopes } = this.jwt.decode<JwtTokenPayload>(this.jwt.lookupToken(req))

        if (!scopes || !scopes.includes('train'))
          throw new Error(`Client with id = '${sub}' don't have scope 'train' for this operation`)

        const model = await store.getOrCreate(modelId)

        await model.train({ text, label })
      }
    })

    this.service.post<{
      Body: {
        label: 'spam' | 'ham'
        text: string
      }[]
      Params: {
        modelId: string
      }
    }>('/:modelId/train_bulk', {
      onRequest: [verifyToken],
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
      async handler(req) {
        const { params: { modelId }, body: examples } = req
        const { sub, scopes } = this.jwt.decode<JwtTokenPayload>(this.jwt.lookupToken(req))

        if (!scopes || !scopes.includes('train_bulk'))
          throw new Error(`Client with id = '${sub}' don't have scope 'train_bulk' for this operation`)

        const model = await store.getOrCreate(modelId)

        await model.trainBulk(examples)
      }
    })

    this.service.post<{
      Body: {
        grant_type: 'client_credentials'
        client_id: string
        client_secret: string
        scope: string
      }
    }>('/oauth2/token', {
      schema: {
        body: {
          type: 'object',
          properties: {
            grant_type: { enum: ['client_credentials'] },
            client_id: { type: 'string' },
            client_secret: { type: 'string' },
            scope: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              token_type: { enum: ['Bearer'] },
              expires_id: { type: 'number' },
              scope: { type: 'string' }
            }
          }
        }
      }
    }, ({ body }) => {
      const client = this.oauthClients.find(({ id }) => id === body.client_id)

      if (!client) {
        throw new Error(`Client with id = "${body.client_id}" not registered within system`)
      }

      if (client.secret !== body.client_secret)
        throw new Error('Client credentials not valid')

      const requestScopes = body.scope?.split(' ').map(s => s.trim()).filter(s => s) ?? []
      const scopes = requestScopes.filter(s => client.scopes.includes(s as ClientScopes))

      const token = this.service.jwt.sign({
        sub: body.client_id,
        scopes: scopes
      })

      return {
        access_token: token,
        token_type: 'Bearer',
        expires_id: -1,
        scope: scopes.join(' ')
      }
    })

    await this.service.register(fastifySwaggerUi)
  }
}
