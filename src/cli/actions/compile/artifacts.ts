import path from 'path'
import fs from 'fs-extra'
import { type PathsConfig } from '../../config/types'
import { globSync } from 'glob'

export const ABI_JSON: string = '.abi.json'
export const CONTENT_TS: string = 'Content.ts'
export const TS: string = '.ts'

const extensions = [ABI_JSON, TS, '.tvc', CONTENT_TS]

/**
 * Return a set of contract assembly artifacts
 * @param config
 * @param contract
 *   'A.tsol'
 *   'x/C.tsol'
 * @return
 *   [
 *     'AContent.ts'
 *     'A.tvc'
 *     'A.ts',
 *     'A.abi.json',
 *     'x/CContent.ts'
 *     'x/C.tvc'
 *     'x/C.ts',
 *     'x/C.abi.json',
 *   ]
 */
function getBuildArtifacts (contract: string): string[] {
  ////////////////
  // Extensions //
  ////////////////
  const directory = path.dirname(contract)
  const nameWithoutExtension = path.parse(path.basename(contract)).name
  return extensions
    .map(extension => path.relative('.', `${directory}/${nameWithoutExtension}${extension}`))
}

/**
 * Return true if artifact files (e.g. `*.abi.json`) exists in build directory
 * @param config
 * @param contract
 *   'A.tsol'
 * @return
 *   true
 */
export function buildsArtifactsExists (config: PathsConfig, contract: string): boolean {
  return getBuildArtifacts(contract).reduce((result, value) => {
    return result && fs.existsSync(path.resolve(process.cwd(), config.build, value))
  }
  , true)
}

/**
 * Return true if artifact files (e.g. `*.abi.json`) exists in build directory
 * @param config
 * @param sources
 *   Set {'A.tsol', 'B.tsol'}
 */
export function removeOldArtifacts (config: PathsConfig, sources: Set<string>): void {
  const directory = path.resolve(process.cwd(), config.build)
  const current = globSync(`${path.resolve(process.cwd(), config.build)}/**/*`)
    .map(value => path.relative(directory, value))
  const required = getSourceArtifactsWithDirectories(sources)
  required.add('index.ts')
  current.forEach(value => {
    if (!required.has(value))
      fs.removeSync(path.resolve(process.cwd(), config.build, value))
  })
}

/**
 * Return artifact for source files
 * @param sources
 *     Set {'A.tsol', 'b/B.tsol'}
 * @return
 *   [
 *     'AContent.ts'
 *     'A.tvc'
 *     'A.ts',
 *     'A.abi.json'
 *     'b'
 *     'b/BContent.ts'
 *     'b/B.tvc'
 *     'b/B.ts',
 *     'b/B.abi.json'
 *   ]
 */
function getSourceArtifactsWithDirectories (sources: Set<string>): Set<string> {
  return [...sources].reduce((set, value): Set<string> => {
    const artifacts = getBuildArtifacts(value)
    const firstArtifactDirectory = path.parse(artifacts[0]).dir
    artifacts.forEach(artifact => set.add(artifact))
    return getArtifactParentDirectories(firstArtifactDirectory).reduce((set, artifactDirectory) =>
      set.add(artifactDirectory), set)
  }, new Set<string>())
}

/**
 * Return parent directories in build directory
 * @param directory
 *   'a/b'
 * @return
 *   ['a/b', 'a']
 */
export function getArtifactParentDirectories (directory: string): string[] {
  const result: string[] = []
  while (directory !== '') {
    result.push(directory)
    directory = path.parse(directory).dir
  }
  return result
}
