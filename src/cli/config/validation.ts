import Joi, { type ValidationError } from 'joi'
import { type VendeeConfig } from './types'
import { GIVER, GIVERS, SE_GIVERS } from './types/giverLabels'

const defaults: VendeeConfig = {
  networks: {
    local: {
      endpoints: ['http://localhost'],
      giver: GIVER.se.v3
    }
  },
  se: {
    version: 'latest',
    instance: 'default',
    port: 80,
    dbPort: 'none'
  },
  paths: {
    build: 'build',
    cache: 'cache',
    contracts: 'contracts',
    keys: 'keys',
    tests: 'tests'
  }
}

export function validateAndSetDefaults (config: any):
  { error: undefined, value: VendeeConfig } |
  { error: ValidationError, value: undefined }
{
  const schema: Joi.ObjectSchema = Joi.object({
    networks: Joi.object().pattern(
      Joi.string(),
      Joi.alternatives(
        Joi.object({
          endpoints: Joi.array().items(Joi.string()).default(defaults.networks.local.endpoints),
          giver: Joi.string().valid(...SE_GIVERS).default(defaults.networks.local.giver)
        }),
        Joi.object({
          endpoints: Joi.array().items(Joi.string()).required(),
          giver: Joi.string().valid(...GIVERS).required(),
          keys: Joi.object({
            name: Joi.string(),
            file: Joi.string()
          })
        })
      ).default(defaults.networks.local)
    ),
    se: Joi.object({
      version: Joi.string().default(defaults.se.version),
      image: Joi.string(),
      container: Joi.string(),
      port: Joi.number().integer().default(defaults.se.port),
      dbPort: Joi.alternatives(
        Joi.number().integer(),
        Joi.string()
      ).default(defaults.se.dbPort),
      instance: Joi.string().default(defaults.se.instance)
    }).default(defaults.se),
    paths: Joi.object({
      build: Joi.string().default(defaults.paths.build),
      cache: Joi.string().default(defaults.paths.cache),
      contracts: Joi.string().default(defaults.paths.contracts),
      keys: Joi.string().default(defaults.paths.keys),
      tests: Joi.string().default(defaults.paths.tests)
    }).default(defaults.paths)
  })
  return schema.validate(config)
}
