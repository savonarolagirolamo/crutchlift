import * as fs from 'fs'
import path from 'path'
import './register'
import Joi from 'joi'
import { red, yellow } from 'colors'

const NAME: string = 'vendee.config.ts'
const file: string = path.resolve(process.cwd(), NAME)

export const isConfigExist: boolean = fs.existsSync(file)

export interface VendeeConfig {
  se: SEConfig
}

export interface SEConfig {
  version?: string | 'latest'
  image?: string
  container?: string
  port?: number
  dbPort?: number | 'none'
  instance?: string | 'default' | '*'
}

export function readConfig (path: string = file): VendeeConfig {
  // eslint-disable-next-line
  const config = require(path)

  const schema: Joi.ObjectSchema = Joi.object({
    se: Joi.object({
      version: Joi.string().default('latest'),
      image: Joi.string(),
      container: Joi.string(),
      port: Joi.number().integer().default(80),
      dbPort: Joi.alternatives(Joi.number().integer(), Joi.string()).default('none'),
      instance: Joi.string().default('default')
    })
  })
  const validationResult: Joi.ValidationResult<VendeeConfig> = schema.validate(config.default)
  if (validationResult.error != null) {
    console.error(red(`Invalid ${yellow(NAME)} config content`))
    console.error(validationResult.error)
    process.exit()
  }
  return validationResult.value
}
