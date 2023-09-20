import path from 'path'
import fs from 'fs-extra'
import { type VendeeConfig } from '../../config/types'
import { globSync } from 'glob'

export const ABI_JSON: string = '.abi.json'
export const CONTENT_TS: string = 'Content.ts'
export const TS: string = '.ts'
const extensions = ['.tvc', ABI_JSON, CONTENT_TS, TS]

/**
 * Return a set of contract assembly artifacts
 * @param config
 * @param contract
 *   '/home/user/contracts/A.tsol'
 * @return
 *   ['/home/user/build/A.tvc', '/home/user/build/A.abi.json', '/home/user/build/AContent.ts']
 */
function getBuildArtifacts (config: VendeeConfig, contract: string): string[] {
  const relative = path.relative(path.resolve(process.cwd(), config.paths.contracts), contract)
  const directory = path.dirname(relative)
  const name = path.parse(path.basename(relative)).name
  const pathWithoutExtension: string = path.resolve(config.paths.build, directory, name)
  return extensions.map(value => pathWithoutExtension + value)
}

/**
 * Return true if artifact files (e.g. `*.abi.json`) exists in build directory
 * @param config
 * @param contract
 */
export function buildsArtifactsExists (config: VendeeConfig, contract: string): boolean {
  return getBuildArtifacts(config, contract).reduce((result, value) =>
    result && fs.existsSync(value)
  , true)
}

/**
 * Return true if artifact files (e.g. `*.abi.json`) exists in build directory
 * @param config
 * @param sources
 *   Set {'/home/user/A.tsol', '/home/user/B.tsol'}
 */
export function removeOldBuildArtifacts (config: VendeeConfig, sources: Set<string>): void {
  const artifacts = getSourceArtifactsWithDirectories(config, sources)
  const oldArtifacts = globSync(`${process.cwd()}/${config.paths.build}/**/*`)
  oldArtifacts.forEach(value => {
    if (!artifacts.has(value))
      fs.removeSync(value)
  })
}

/**
 * Return artifact for source files
 * @param config
 *     Set {'/home/user/contract/A.tsol', '/home/user/b/B.tsol'}
 * @param sources
 *   [
 *     '/home/user/build/AContent.ts'
 *     '/home/user/build/A.tvc'
 *     '/home/user/build/A.abi.json'
 *     '/home/user/build/b'
 *     '/home/user/build/b/BContent.ts'
 *     '/home/user/build/b/B.tvc'
 *     '/home/user/build/b/B.abi.json'
 *   ]
 */
function getSourceArtifactsWithDirectories (config: VendeeConfig, sources: Set<string>): Set<string> {
  return [...sources].reduce((set, value): Set<string> => {
    const contractArtifacts = getBuildArtifacts(config, value)
    const firstArtifactDirectory = path.parse(contractArtifacts[0]).dir
    contractArtifacts.forEach(artifact => set.add(artifact))
    return getArtifactParentDirectories(config, firstArtifactDirectory).reduce((set, artifactDirectory) =>
      set.add(artifactDirectory), set)
  }, new Set<string>())
}

/**
 * Return parent directories in build directory
 * @param config
 * @param directory
 *   '/home/user/build/a/b'
 * @return
 *   ['/home/user/build/a/b', '/home/user/build/a']
 */
export function getArtifactParentDirectories (config: VendeeConfig, directory: string): string[] {
  const result: string[] = []
  const buildDirectory = path.resolve(process.cwd(), config.paths.build)
  while (directory !== buildDirectory) {
    result.push(directory)
    directory = path.parse(directory).dir
  }
  return result
}
