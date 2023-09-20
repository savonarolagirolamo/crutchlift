import path from 'path'
import fs from 'fs-extra'
import { type PathsConfig } from '../../../config/types'

export function generateIndex (config: PathsConfig, sources: Set<string>): void {
  /////////////////////
  // Get directories //
  /////////////////////
  const directories = [...sources.keys()]
    .reduce((set, contract): Set<string> =>
      set.add(path.parse(contract).dir)
    , new Set<string>())

  //////////////////////////////////
  // Get files for each directory //
  //////////////////////////////////
  const files = [...sources.keys()]
    .reduce((result: Record<string, string[]>, source): Record<string, string[]> => {
      const directory = path.parse(source).dir
      const name = path.parse(source).name
      if (result[directory] === undefined)
        result[directory] = []
      result[directory].push(name)
      return result
    }, {})

  //////////////////////
  // Generate imports //
  //////////////////////
  const imports = [...directories.keys()].reduce((result, directory): string => {
    return files[directory].reduce((acc, name): string =>
      (directory === '')
        ? acc + `import { ${name} } from './${name}'\n`
        : acc + `import { ${name} as ${getRef(directory, name)} } from './${directory}/${name}'\n`
    , result)
  }
  , '')

  //////////////////////
  // Generate exports //
  //////////////////////
  const exports = [...directories.keys()].reduce((result, directory): string => {
    const exportClasses = files[directory].reduce((acc, name): string =>
      (directory === '')
        ? acc + `export { ${name} }\n`
        : acc + `  export class ${name} extends ${getRef(directory, name)} {}\n`
    , '')
    return (directory === '')
      ? result + exportClasses
      : result + `export namespace ${getNamespace(directory)} {\n${exportClasses}}\n`
  }
  , '')

  ////////////////
  // Write file //
  ////////////////
  const text = `${imports}${exports}`
  fs.writeFileSync(path.resolve(process.cwd(), config.build, 'index.ts'), text)
}

/**
 * Convert file directory to namespace
 * @param directory Relative directory
 *   'a/b'
 * @return
 *   'a.b'
 */
export function getNamespace (directory: string): string {
  return directory.replace('/', '.')
}

/**
 * Convert file directory to namespace
 * @param name Class name
 *   'Counter'
 * @param directory Relative directory
 *   'a/b'
 * @return
 *   'Counter_a_b_ref'
 */
export function getRef (directory: string, name: string): string {
  return `${name}_${directory.replace('/', '_')}_ref`
}
