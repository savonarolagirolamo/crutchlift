import fs from 'fs-extra'
import path from 'path'
import { type PathsConfig, type VendeeConfig } from '../../config/types'
import { readCache, writeCache } from './cache'
import { globSync } from 'glob'
import { make } from './make'
import { buildsArtifactsExists, removeOldBuildArtifacts } from './artifacts'

export type Metadata = {
  modificationTime: number
  imports: string[]
}

export async function compile (config: VendeeConfig, all: boolean = false): Promise<void> {
  const cache = all ? {} : readCache(config)
  const contracts = readContracts(config.paths)
  const metadata = readMetadata(cache, contracts)
  const newOrChangedContracts = getNewOrChangedContracts(cache, metadata)
  const importers = reverseImports(metadata)
  const candidates = getCandidates(importers, newOrChangedContracts)
  const includes = readIncludes(config)
  const excludes = readExcludes(config)
  const sources = readSources(includes, excludes)
  const contractsToCompile = getContractToCompile(config, sources, candidates)
  await make(config, contractsToCompile)
  removeOldBuildArtifacts(config, sources)
  writeCache(config, metadata)
}

/**
 * Read all files from contracts directory
 * @param config
 * @return
 *   ['/home/user/A.tsol', '/home/user/B.tsol']
 */
export function readContracts (config: PathsConfig): string[] {
  return globSync(`${process.cwd()}/${config.contracts}/**`, { nodir: true })
}

/**
 * If the contract has not changed, read the metadata from the cache. If changed, read from file
 * @param cache
 *   {
 *     '/home/user/A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/IA.tsol']
 *     }
 *   }
 * @param contracts
 *   ['/home/user/A.tsol', '/home/user/B.tsol']
 * @return
 *   {
 *     '/home/user/A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/IA.tsol']
 *     },
 *     '/home/user/B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/IB.tsol']
 *     }
 *   }
 */
export function readMetadata (cache: Record<string, Metadata>, contracts: string[]): Record<string, Metadata> {
  return contracts.reduce((meta: Record<string, Metadata>, contract): Record<string, Metadata> => {
    const modificationTime = fs.statSync(contract).mtime.getTime()
    const cacheContract = cache[contract]
    meta[contract] = (cacheContract !== undefined && cacheContract.modificationTime === modificationTime)
      ? cacheContract
      : {
          modificationTime,
          imports: readImports(contract)
        }
    return meta
  }, {})
}

/**
 * Read imports from contract file
 * @param contract
 *   '/home/user/A.tsol'
 * @return
 *   ['/home/user/B.tsol', '/home/user/libraries/IA.tsol']
 */
function readImports (contract: string): string[] {
  const result: string[] = []
  const directory = path.dirname(contract)
  const content = fs.readFileSync(contract, { encoding: 'utf8' })
  const regexp = /(?<=import ").+(?=";)|(?<=import ').+(?=';)/g
  const maths = content.matchAll(regexp)
  for (const [importRelative] of maths)
    result.push(path.resolve(directory, importRelative))
  return result
}

/**
 * Returns contracts that are not in the cache, or are in the cache and the modification time has been changed
 * @param cache
 *   {
 *     '/home/user/A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/IA.tsol']
 *     },
 *     '/home/user/B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/IA.tsol']
 *     }
 *   }
 * @param metadata
 *   {
 *     '/home/user/A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/IA.tsol']
 *     },
 *     '/home/user/B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/IB.tsol']
 *     }
 *   }
 * @return
 *   ['/home/user/B.tsol']
 */
function getNewOrChangedContracts (cache: Record<string, Metadata>, metadata: Record<string, Metadata>): string[] {
  const result: string[] = []
  for (const contract in metadata) {
    const cacheContract = cache[contract]
    const metaContract = metadata[contract]
    if (cacheContract === undefined || cacheContract.modificationTime !== metaContract.modificationTime)
      result.push(contract)
  }
  return result
}

/**
 * Return map (contract) => (contracts that depend on it)
 * @param metadata
 *   {
 *     '/home/user/A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/B.tsol', '/home/user/C.tsol']
 *     },
 *      '/home/user/B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: []
 *     },
 *      '/home/user/C.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['/home/user/D.tsol']
 *     },
 *      '/home/user/D.tsol': {
 *       modificationTime: 1666666666,
 *       imports: []
 *     }
 *   }
 * @return
 *   {
 *     '/home/user/B.tsol': ['/home/user/A.tsol'],
 *     '/home/user/C.tsol': ['/home/user/A.tsol'],
 *     '/home/user/D.tsol': ['/home/user/C.tsol']
 *   }
 */
function reverseImports (metadata: Record<string, Metadata>): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const contract in metadata) {
    metadata[contract].imports.forEach(value => {
      if (result[value] === undefined)
        result[value] = [contract]
      else
        result[value].push(contract)
    })
  }
  return result
}

/**
 * Return a set of candidate contracts to compilation
 * @param importers
 *   {
 *     '/home/user/B.tsol': ['/home/user/A.tsol'],
 *     '/home/user/C.tsol': ['/home/user/A.tsol'],
 *     '/home/user/D.tsol': ['/home/user/C.tsol']
 *   }
 * @param contracts
 *   ['/home/user/B.tsol']
 * @return
 *   Set {'/home/user/A.tsol', '/home/user/B.tsol'}
 */
function getCandidates (importers: Record<string, string[]>, contracts: string[]): Set<string> {
  const set = new Set<string>()
  let list = [...contracts]
  for (let i = 0; i < list.length; ++i) {
    const contract = list[i]
    if (set.has(contract))
      continue

    set.add(contract)
    const contractImporters = importers[contract]
    if (contractImporters !== undefined)
      list = list.concat(contractImporters)
  }
  return set
}

/**
 * Return a set of contracts that included to compilation
 * @param config
 * @return
 *   Set {'/home/user/A.tsol', '/home/user/B.tsol'}
 */
function readIncludes (config: VendeeConfig): Set<string> {
  return readFiles(config, config.compile.include)
}

/**
 * Return a set of contracts that excluded from compilation
 * @param config
 * @return
 *   Set {'/home/user/A.tsol', '/home/user/B.tsol'}
 */
function readExcludes (config: VendeeConfig): Set<string> {
  return readFiles(config, config.compile.exclude)
}

/**
 * Return a set of contracts using glob
 * @param config
 * @param globs
 *   ['*.tsol', '*.sol']
 * @return
 *   Set {'/home/user/A.tsol', '/home/user/B.tsol'}
 */
function readFiles (config: VendeeConfig, globs: string[]): Set<string> {
  return globs.reduce((set, value): Set<string> =>
    globSync(`${process.cwd()}/${config.paths.contracts}/${value}`, { nodir: true })
      .reduce((set, value) => set.add(value), set)
  , new Set<string>())
}

/**
 * Exclude contracts from include
 * @param includes
 *   Set {'/home/user/A.tsol', '/home/user/B.tsol'}
 * @param excludes
 *   Set {'/home/user/A.tsol'}
 * @return
 *   Set {'/home/user/B.tsol'}
 */
function readSources (includes: Set<string>, excludes: Set<string>): Set<string> {
  return [...includes].reduce((set, value): Set<string> =>
    excludes.has(value) ? set : set.add(value)
  , new Set<string>())
}

/**
 * Return contract array to compilation
 */
function getContractToCompile (config: VendeeConfig, sources: Set<string>, candidates: Set<string>): string[] {
  return [...sources].reduce((result: string[], value): string[] => {
    if (candidates.has(value) || !buildsArtifactsExists(config, value))
      result.push(value)
    return result
  }, [])
}
