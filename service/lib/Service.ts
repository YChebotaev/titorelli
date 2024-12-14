import fastify, { type FastifyInstance } from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyJwt, { type FastifyJwtNamespace } from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { Logger } from 'pino'
import type {
  EnsembleModel,
  LabeledExample,
  Prediction,
  TemporaryStorage,
  IModel,
  ITotems,
  ICas
} from "@titorelli/model"
import type { ServiceAuthClient } from './types'

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'jwt' }> {
    verifyToken: Function
  }
}

export type ServiceConfig = {
  port: number
  host: string
  logger: Logger,
  modelsStore: TemporaryStorage<IModel, [string]>
  cas: ICas
  totemsStore: TemporaryStorage<ITotems, [string]>
  jwtSecret: string
  oauthClients: ServiceAuthClient[]
}

export type JwtTokenPayload = {
  sub: string,
  scopes: string[]
}

export class Service {
  private logger: Logger
  private modelsStore: TemporaryStorage<IModel, [string]>
  private cas: ICas
  private totemsStore: TemporaryStorage<ITotems, [string]>
  private service: FastifyInstance
  private port: number
  private host: string
  private jwtSecret: string
  private oauthClients: ServiceAuthClient[]
  private ready: Promise<void>
  private modelPredictPath = '/models/:modelId/predict'
  private modelTrainPath = '/models/:modelId/train'
  private modelTrainBulkPath = '/models/:modelId/train_bulk'
  private modelExactMatchTrainPath = '/models/:modelId/exact_match/train'
  private modelTotemsTrainPath = '/models/:modelId/totems/train'
  private casTrainPath = '/cas/train'
  private ouathTokenPath = '/oauth2/token'

  constructor({
    port,
    host,
    logger,
    modelsStore,
    cas,
    totemsStore,
    jwtSecret,
    oauthClients
  }: ServiceConfig) {
    this.logger = logger
    this.modelsStore = modelsStore
    this.cas = cas
    this.totemsStore = totemsStore
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
    this.service = fastify({ loggerInstance: this.logger })

    await this.installPluginsBegin()
    await this.installModelPredictRoute()
    await this.installModelTrainRoute()
    await this.installModelTrainBulkRoute()
    await this.installModelExactMatchTrainRoute()
    await this.installModelTotemsTrainRoute()
    await this.installCasTrainRoute()
    await this.installOauthTokenRoute()
    await this.installPluginsEnd()
  }

  private verifyToken = (req, reply, done) => {
    const token = this.service.jwt.lookupToken(req)

    try {
      this.service.jwt.verify(token)

      done()
    } catch (error) {
      this.logger.error(error)

      reply.send(error)
    }
  }

  private allowScopeTemplate = (scopePostfix: string) => {
    return (req, _reply, done) => {
      const { params: { modelId } } = req
      const { sub, scopes } = this.service.jwt.decode<JwtTokenPayload>(this.service.jwt.lookupToken(req))

      const finalScope = `${modelId}/${scopePostfix}`

      if (!scopes.includes(finalScope))
        throw new Error(`Client with id = '${sub}' don't have scope ${finalScope} for this operation`)

      done()
    }
  }

  private allowScopeExact = (testScope: string) => {
    return (req, _reply, done) => {
      const { sub, scopes } = this.service.jwt.decode<JwtTokenPayload>(this.service.jwt.lookupToken(req))

      if (!scopes.includes(testScope))
        throw new Error(`Client with id = ${sub} don't have scope ${testScope} for this operatiob`)

      done()
    }
  }

  private async installPluginsBegin() {
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
  }

  private async installModelPredictRoute() {
    await this.service.post<{
      Body: {
        text: string
        tgUserId?: number
      },
      Params: {
        modelId: string
      }
    }>(
      this.modelPredictPath,
      {
        onRequest: [this.verifyToken, this.allowScopeTemplate('predict')],
        schema: {
          body: {
            type: 'object',
            required: ['text'],
            properties: {
              text: { type: 'string' },
              tgUserId: { type: 'number' }
            }
          },
          response: {
            200: {
              type: 'object',
              properties: {
                reason: { enum: ['classifier', 'duplicate', 'totem', 'cas'] },
                value: { type: 'string' },
                confidence: { type: 'number' },
              }
            }
          }
        }
      },
      async (req) => {
        const { params: { modelId }, body: { text, tgUserId } } = req

        if (tgUserId != null) {
          {
            const casPrediction = await this.checkCas(tgUserId)

            if (casPrediction != null)
              return casPrediction
          }

          {
            const totemPrediction = await this.checkTotem(modelId, tgUserId)

            if (totemPrediction != null)
              return totemPrediction
          }
        }

        const model = await this.modelsStore.getOrCreate(modelId)

        return model.predict({ text })
      }
    )
  }

  private async checkCas(tgUserId: number): Promise<Prediction | null> {
    if (await this.cas.has(tgUserId)) {
      return {
        value: 'spam',
        confidence: 1,
        reason: 'cas'
      }
    }

    return null
  }

  private async checkTotem(modelId: string, tgUserId: number): Promise<Prediction | null> {
    const totems = await this.totemsStore.getOrCreate(modelId)

    if (await totems.has(tgUserId)) {
      return {
        value: 'ham',
        confidence: 1,
        reason: 'totem'
      }
    }

    return null
  }

  private async installModelTrainRoute() {
    await this.service.post<{
      Body: {
        label: 'spam' | 'ham'
        text: string
      }
      Params: {
        modelId: string
      }
    }>(this.modelTrainPath, {
      onRequest: [this.verifyToken, this.allowScopeTemplate('train')],
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

    }, async ({ params: { modelId }, body: { text, label } }) => {
      const model = await this.modelsStore.getOrCreate(modelId)

      await model.train({ text, label })
    })
  }

  private async installModelTrainBulkRoute() {
    await this.service.post<{
      Body: {
        label: 'spam' | 'ham'
        text: string
      }[]
      Params: {
        modelId: string
      }
    }>(
      this.modelTrainBulkPath,
      {
        onRequest: [this.verifyToken, this.allowScopeTemplate('train_bulk')],
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
        }
      },
      async (req) => {
        const { params: { modelId }, body: examples } = req

        const model = await this.modelsStore.getOrCreate(modelId)

        await model.trainBulk(examples)
      })
  }

  private async installModelExactMatchTrainRoute() {
    await this.service.post<{
      Body: LabeledExample,
      Params: {
        modelId: string
      }
    }>(
      this.modelExactMatchTrainPath,
      {
        onRequest: [this.verifyToken, this.allowScopeTemplate('exact_match/train')],
        schema: {
          params: {
            type: 'object',
            properties: {
              modelId: { type: 'string' }
            }
          },
          body: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              label: { enum: ['spam', 'ham'] }
            }
          }
        }
      },
      async ({ params: { modelId }, body }) => {
        const ensemble = await this.modelsStore.getOrCreate(modelId) as Awaited<EnsembleModel>
        const emModel = ensemble.getModelByType('exact-match')

        if (!emModel)
          return null

        await emModel.train(body)
      })
  }

  private async installModelTotemsTrainRoute() {
    await this.service.post<{
      Params: {
        modelId: string
      },
      Body: {
        tgUserId: number
      }
    }>(this.modelTotemsTrainPath, {
      onRequest: [this.verifyToken, this.allowScopeTemplate('totems/train')],
      schema: {
        params: {
          type: 'object',
          properties: {
            modelId: { type: 'string' }
          }
        },
        body: {
          type: 'object',
          properties: {
            tgUserId: { type: 'number' }
          }
        }
      }
    }, async ({ params: { modelId }, body: { tgUserId } }) => {
      const totems = await this.totemsStore.getOrCreate(modelId)

      await totems.add(tgUserId)
    })
  }

  private async installCasTrainRoute() {
    await this.service.post<{
      Body: {
        tgUserId: number
      }
    }>(this.casTrainPath, {
      onRequest: [this.verifyToken, this.allowScopeExact('cas/train')],
      schema: {
        body: {
          type: 'object',
          properties: {
            tgUserId: { type: 'number' }
          }
        }
      }
    }, async ({ body: { tgUserId } }) => {
      await this.cas.add(tgUserId)
    })
  }

  private async installOauthTokenRoute() {
    await this.service.post<{
      Body: {
        grant_type: 'client_credentials'
        client_id: string
        client_secret: string
        scope: string
      }
    }>(
      this.ouathTokenPath,
      {
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
        const scopes = requestScopes.filter(s => client.scopes.includes(s))

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
  }

  private async installPluginsEnd() {
    await this.service.register(fastifySwaggerUi)
  }
}
