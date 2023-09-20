import path from 'path'
import fs from 'fs-extra'
import { type VascooConfig } from '../../config/types'
import { type Metadata } from './index'

const FILE = 'contracts.json'

export type Cache = {
  compiler: string
  linker: string
  contracts: Record<string, Metadata>
}

/**
 * Read metadata from cache
 * @param config
 * @return Example:
 *   {
 *     'TokenRoot.tsol': {
 *       modificationTime: 1685314482,
 *       imports: ['ITokenRoot.tsol']
 *     },
 *     'TokenWallet.tsol': {
 *       modificationTime: 1685314482,
 *       imports: ['ITokenWallet.tsol']
 *     }
 *   }
 */
export function readCache (config: VascooConfig): Record<string, Metadata> {
  const file = path.resolve(process.cwd(), config.paths.cache, FILE)
  if (!fs.existsSync(file))
    return {}

  const cache: Cache = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }))
  if (cache.compiler !== config.compile.compiler && cache.linker !== config.compile.linker)
    return {}

  return cache.contracts ?? {}
}

/**
 * Write metadata to cache
 * @param config
 * @param metadata Example:
 *   {
 *     'TokenRoot.tsol': {
 *       modificationTime: 1685314482,
 *       imports: ['ITokenRoot.tsol']
 *     },
 *     'TokenWallet.tsol': {
 *       modificationTime: 1685314482,
 *       imports: ['ITokenWallet.tsol']
 *     }
 *   }
 */
export function writeCache (config: VascooConfig, metadata: Record<string, Metadata>): void {
  const file = path.resolve(process.cwd(), config.paths.cache, FILE)
  const directory = path.dirname(file)
  const cache: Cache = {
    compiler: config.compile.compiler,
    linker: config.compile.linker,
    contracts: metadata
  }
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(cache, null, 2))
}
