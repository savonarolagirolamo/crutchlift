import * as fs from 'fs'
import path from 'path'
import { type VendeeConfig } from './types'
import { validateAndSetDefaults, type Validation } from './validation'
import { error } from './error'

const NAME: string = 'vendee.config.ts'
const file: string = path.resolve(process.cwd(), NAME)

export function isConfigExist (): boolean {
  return fs.existsSync(file)
}

export function readConfig (path: string = file): VendeeConfig {
  const config: any = require(path) // eslint-disable-line
  const validation: Validation = validateAndSetDefaults(config.default)
  if (validation.error !== undefined)
    error(NAME, validation.error)
  else
    return validation.value
}
