import fs from 'fs-extra'
import path from 'path'
import { type PathsConfig, type VaskuConfig } from '../../config/types'
import { readCache, writeCache } from './cache'
import { globSync } from 'glob'
import { make } from './make'
import { buildsArtifactsExists, removeOldArtifacts } from './artifacts'
import { generateIndex } from './generators/generateIndex'

export type Metadata = {
  modificationTime: number
  imports: string[]
}

export async function compile (config: VaskuConfig, all: boolean = false): Promise<void> {
  const cache = all ? {} : readCache(config)
  const contracts = readContracts(config.paths)
  const metadata = readMetadata(config.paths, cache, contracts)
  const newOrChangedContracts = getNewOrChangedContracts(cache, metadata)
  const importers = reverseImports(metadata)
  const candidates = getCandidates(importers, newOrChangedContracts)
  const includes = readIncludes(config)
  const excludes = readExcludes(config)
  const sources = readSources(includes, excludes)
  const contractsToCompile = getContractToCompile(config.paths, sources, candidates)

  if (contractsToCompile.length === 0)
    return

  await make(config, contractsToCompile)
  generateIndex(config.paths, sources)
  removeOldArtifacts(config.paths, sources)
  writeCache(config, metadata)
}

/**
 * Read all files from contracts directory
 * @param config
 * @return
 *   ['A.tsol', 'B.tsol', 'x/C.tsol']
 */
export function readContracts (config: PathsConfig): string[] {
  const directory = path.resolve(process.cwd(), config.contracts)
  return globSync(path.resolve(directory, '**'), { nodir: true })
    .map(value => path.relative(directory, value))
}

/**
 * If the contract has not changed, read the metadata from the cache. If changed, read from file
 * @param config
 * @param cache
 *   {
 *     'A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['IA.tsol']
 *     }
 *   }
 * @param contracts
 *   ['A.tsol', 'B.tsol']
 * @return
 *   {
 *     'A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['IA.tsol']
 *     },
 *     'B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['IB.tsol']
 *     }
 *   }
 */
export function readMetadata (config: PathsConfig, cache: Record<string, Metadata>, contracts: string[]): Record<string, Metadata> {
  return contracts.reduce((meta: Record<string, Metadata>, contract): Record<string, Metadata> => {
    const file = path.resolve(process.cwd(), config.contracts, contract)
    const modificationTime = fs.statSync(file).mtime.getTime()
    const cacheContract = cache[contract]
    meta[contract] = (cacheContract !== undefined && cacheContract.modificationTime === modificationTime)
      ? cacheContract
      : {
          modificationTime,
          imports: readImports(config, file)
        }
    return meta
  }, {})
}

/**
 * Read imports from contract file
 * @param config
 * @param file
 *   'A.tsol'
 * @return
 *   ['B.tsol', 'IA.tsol']
 */
function readImports (config: PathsConfig, file: string): string[] {
  const result: string[] = []
  const relativeDirectory = path.relative(path.resolve(process.cwd(), config.contracts), path.dirname(file))
  const content = fs.readFileSync(file, { encoding: 'utf8' })
  const regexp = /(?<=import ").+(?=";)|(?<=import ').+(?=';)/g
  const maths = content.matchAll(regexp)
  for (const [importRelative] of maths)
    result.push(path.relative(relativeDirectory, importRelative))
  return result
}

/**
 * Returns contracts that are not in the cache, or are in the cache and the modification time has been changed
 * @param cache
 *   {
 *     'A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['IA.tsol']
 *     },
 *     'B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['IA.tsol']
 *     }
 *   }
 * @param metadata
 *   {
 *     'A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['IA.tsol']
 *     },
 *     'B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['IB.tsol']
 *     }
 *   }
 * @return
 *   ['B.tsol']
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
 *     'A.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['B.tsol', 'C.tsol']
 *     },
 *      'B.tsol': {
 *       modificationTime: 1666666666,
 *       imports: []
 *     },
 *      'C.tsol': {
 *       modificationTime: 1666666666,
 *       imports: ['D.tsol']
 *     },
 *      'D.tsol': {
 *       modificationTime: 1666666666,
 *       imports: []
 *     }
 *   }
 * @return
 *   {
 *     'B.tsol': ['A.tsol'],
 *     'C.tsol': ['A.tsol'],
 *     'D.tsol': ['C.tsol']
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
 *     'B.tsol': ['A.tsol'],
 *     'C.tsol': ['A.tsol'],
 *     'D.tsol': ['C.tsol']
 *   }
 * @param contracts
 *   ['B.tsol']
 * @return
 *   Set {'A.tsol', 'B.tsol'}
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
 *   Set {'A.tsol', 'B.tsol'}
 */
function readIncludes (config: VaskuConfig): Set<string> {
  return readFiles(config.paths, config.compile.include)
}

/**
 * Return a set of contracts that excluded from compilation
 * @param config
 * @return
 *   Set {'A.tsol', 'B.tsol'}
 */
function readExcludes (config: VaskuConfig): Set<string> {
  return readFiles(config.paths, config.compile.exclude)
}

/**
 * Return a set of contracts using glob
 * @param config
 * @param globs
 *   ['*.tsol', '*.sol']
 * @return
 *   Set {'A.tsol', 'B.tsol'}
 */
function readFiles (config: PathsConfig, globs: string[]): Set<string> {
  const directory = path.resolve(process.cwd(), config.contracts)
  return globs.reduce((set, value): Set<string> =>
    globSync(path.resolve(directory, value), { nodir: true })
      .map(value => path.relative(directory, value))
      .reduce((set, value) => set.add(value), set)
  , new Set<string>())
}

/**
 * Exclude contracts from include
 * @param includes
 *   Set {'A.tsol', 'B.tsol'}
 * @param excludes
 *   Set {'A.tsol'}
 * @return
 *   Set {'B.tsol'}
 */
function readSources (includes: Set<string>, excludes: Set<string>): Set<string> {
  return [...includes].reduce((set, value): Set<string> =>
    excludes.has(value) ? set : set.add(value)
  , new Set<string>())
}

/**
 * Return contract array to compilation
 * @param config
 * @param sources
 *   Set(3) {'Counter.tsol', 'd/B.tsol', 'd/A.tsol'}
 * @param candidates
 *   Set(4) {
 *     'Counter.tsol',
 *     'interface/ICounter.tsol',
 *     'd/B.tsol',
 *     'd/A.tsol'
 *   }
 * @return
 *   ['Counter.tsol', 'd/B.tsol', 'd/A.tsol']
 */
function getContractToCompile (config: PathsConfig, sources: Set<string>, candidates: Set<string>): string[] {
  return [...sources].reduce((result: string[], value): string[] => {
    if (candidates.has(value) || !buildsArtifactsExists(config, value))
      result.push(value)
    return result
  }, [])
}
