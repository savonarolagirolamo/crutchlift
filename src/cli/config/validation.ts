import Joi, { type ValidationError, type ValidationResult } from 'joi'
import { type VendeeConfig } from './types'

const defaults: VendeeConfig = {
  se: {
    version: 'latest',
    instance: 'default',
    port: 80,
    dbPort: 'none'
  },
  paths: {
    contracts: 'contracts',
    cache: 'cache',
    build: 'build',
    tests: 'tests'
  }
}

export type Validation =
  { error: undefined, value: VendeeConfig } |
  { error: ValidationError, value: undefined }

export function validateAndSetDefaults (config: any): Validation {
  const schema: Joi.ObjectSchema = Joi.object({
    se: Joi.object({
      version: Joi.string().default(defaults.se.version),
      image: Joi.string(),
      container: Joi.string(),
      port: Joi.number().integer().default(defaults.se.port),
      dbPort: Joi.alternatives(Joi.number().integer(), Joi.string()).default(defaults.se.dbPort),
      instance: Joi.string().default(defaults.se.instance)
    }).default(defaults.se),
    paths: Joi.object({
      build: Joi.string().default(defaults.paths.build),
      cache: Joi.string().default(defaults.paths.cache),
      contracts: Joi.string().default(defaults.paths.contracts),
      tests: Joi.string().default(defaults.paths.tests)
    }).default(defaults.paths)
  })
  const validationResult: ValidationResult<VendeeConfig> = schema.validate(config)
  return validationResult
}
