import * as fs from 'fs'
import path from 'path'
import { type VaskuConfig } from './types'
import { validateAndSetDefaults } from './validation'
import { red } from 'colors'

const NAME = 'vasku.config.ts'
const file = path.resolve(process.cwd(), NAME)

export function isConfigExist (): boolean {
  return fs.existsSync(file)
}

export function readConfig (path: string = file): VaskuConfig {
  const config: any = require(path) // eslint-disable-line
  const validation = validateAndSetDefaults(config.default)
  if (validation.error !== undefined) {
    console.error(red(`Invalid ${NAME}`))
    console.error(validation.error)
    process.exit()
  } else
    return validation.value
}
