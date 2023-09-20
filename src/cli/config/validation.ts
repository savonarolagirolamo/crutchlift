import Joi, { type ValidationError } from 'joi'
import { type VendeeConfig } from './types'
import { GIVER, GIVERS, SE_GIVERS } from './types/giverLabels'

const defaults: VendeeConfig = {
  compile: {
    compiler: 'latest',
    linker: 'latest',
    include: ['**/*.tsol', '**/*.sol'],
    exclude: ['**/interface/*', '**/interfaces/*']
  },
  networks: {
    local: {
      endpoints: ['http://localhost'],
      giver: GIVER.se.v3
    }
  },
  se: {
    version: 'latest',
    instance: 'default',
    port: 8080,
    dbPort: 'none'
  },
  paths: {
    build: 'build',
    cache: 'cache',
    contracts: 'contracts',
    keys: 'keys',
    tests: 'tests',
    scripts: 'scripts'
  },
  timeout: 60000
}

export function validateAndSetDefaults (config: any):
{ error: undefined, value: VendeeConfig } |
{ error: ValidationError, value: undefined } {
  const schema: Joi.ObjectSchema = Joi.object({
    compile: Joi.object({
      compiler: Joi.string().default(defaults.compile.compiler),
      linker: Joi.string().default(defaults.compile.linker),
      include: Joi.array().items(Joi.string()).default(defaults.compile.include),
      exclude: Joi.array().items(Joi.string()).default(defaults.compile.exclude)
    }).default(defaults.compile),
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
            name: Joi.any(),
            file: Joi.any()
          })
        })
      ).default(defaults.networks.local)
    ),
    se: Joi.object({
      version: Joi.string().default(defaults.se.version),
      image: Joi.string().allow(''),
      container: Joi.string().allow(''),
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
      tests: Joi.string().default(defaults.paths.tests),
      scripts: Joi.string().default(defaults.paths.scripts)
    }).default(defaults.paths),
    timeout: Joi.number().default(defaults.timeout)
  })
  return schema.validate(config)
}
