import path from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { CasAntispam, ModelsStore, } from '@titorelli/model'
import yaml from 'yaml'
import { Service } from './lib/Service'

const oauthClientsFilename = path.join(__dirname, 'oauth-clients.yaml')

if (!existsSync(oauthClientsFilename)) {
  throw new Error('oauth-clients.yaml file must be present in a root of module')
}

new Service({
  port: Number(process.env['PORT'] ?? 3000),
  host: process.env['HOST'] ?? '0.0.0.0',
  store: new ModelsStore(path.join(__dirname, 'data'), 'logistic-regression', 3600000 /* 3 hours */),
  cas: new CasAntispam(path.join(__dirname, 'data/cas.csv')),
  jwtSecret: process.env.JWT_SECRET,
  oauthClients: yaml.parse(readFileSync(oauthClientsFilename, 'utf-8'))
}).listen()
