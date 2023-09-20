import { red } from 'colors'

export function error (config: string, error: Error): never {
  console.error(red(`Invalid ${config}`))
  console.error(error)
  process.exit()
}
