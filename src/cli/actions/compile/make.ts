import path from 'path'
import { type PathsConfig, type VascooConfig } from '../../config/types'
import { consoleTerminal, runCommand, type Terminal } from 'everdev'
import { green, grey } from 'colors'
import { ABI_JSON, CONTENT_TS } from './artifacts'
import { generateTypeScript } from './generators/generateTypeScript'

const onlyErrorConsoleTerminal: Terminal = new class implements Terminal {
  log (..._0: unknown[]): void {}
  write (_0: string): void {}
  writeError (text: string): void {
    process.stderr.write(text)
  }
}()

/**
 * Compile all contracts
 * @param config
 * @param contracts
 *   ['A.tsol', 'B.tsol', 'x/C.tsol']
 */
export async function make (config: VascooConfig, contracts: string[]): Promise<void> {
  await runCommand(consoleTerminal, 'sol set', {
    compiler: config.compile.compiler,
    linker: config.compile.linker
  })

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i]
    const directory = path.dirname(contract)
    const name = path.basename(contract)
    const directoryText = directory === '.' ? '' : directory + '/'
    console.log(`${green('•')} ${grey(directoryText)}${name}`)

    await compile(config.paths, directory, name)
    await wrap(config.paths, directory, name)
    generateTypeScript(config.paths, directory, name)
  }
}

/**
 * Compile contract
 * @param config
 * @param directory
 *   'x'
 * @param name
 *   'C.tsol'
 */
async function compile (config: PathsConfig, directory: string, name: string): Promise<void> {
  await runCommand(consoleTerminal, 'sol compile', {
    file: path.resolve(process.cwd(), config.contracts, directory, name),
    outputDir: path.resolve(process.cwd(), config.build, directory)
  })
}

/**
 * Wrap contract data in *.ts constant
 * @param config
 * @param directory
 *   'x'
 * @param name
 *   'C.tsol'
 */
async function wrap (config: PathsConfig, directory: string, name: string): Promise<void> {
  const nameWithoutExtension = path.parse(name).name
  await runCommand(onlyErrorConsoleTerminal, 'js wrap', {
    file: path.resolve(process.cwd(), config.build, directory, `${nameWithoutExtension}${ABI_JSON}`),
    export: 'es6-default',
    output: path.resolve(process.cwd(), config.build, directory, `${nameWithoutExtension}${CONTENT_TS}`)
  })
}
