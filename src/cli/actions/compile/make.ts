import path from 'path'
import { type VendeeConfig } from '../../config/types'
import { consoleTerminal, runCommand, type Terminal } from 'everdev'
import { green, grey } from 'colors'
import { ABI_JSON, CONTENT_TS } from './artifacts'

const onlyErrorConsoleTerminal: Terminal = new class implements Terminal {
  log (..._0: unknown[]): void {}
  write (_0: string): void {}
  writeError (text: string): void {
    process.stderr.write(text)
  }
}()

export async function make (config: VendeeConfig, contracts: string[]): Promise<void> {
  await runCommand(consoleTerminal, 'sol set', {
    compiler: config.compile.compiler,
    linker: config.compile.linker
  })

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i]
    const relative = path.relative(path.resolve(process.cwd(), config.paths.contracts), contract)
    const directory = path.dirname(relative)
    const name = path.basename(relative)
    const directoryText = directory === '.' ? '' : directory + '/'
    console.log(`${green('•')} ${grey(directoryText)}${name}`)

    await compile(config, directory, contract)
    await wrap(config, directory, contract)
  }
}

async function compile (config: VendeeConfig, directory: string, contract: string): Promise<void> {
  await runCommand(consoleTerminal, 'sol compile', {
    file: contract,
    outputDir: path.resolve(process.cwd(), config.paths.build, directory)
  })
}

async function wrap (config: VendeeConfig, directory: string, contract: string): Promise<void> {
  const name = path.parse(path.basename(contract)).name
  await runCommand(onlyErrorConsoleTerminal, 'js wrap', {
    file: path.resolve(process.cwd(), config.paths.build, directory, `${name}${ABI_JSON}`),
    export: 'es6-default',
    output: path.resolve(process.cwd(), config.paths.build, directory, `${name}${CONTENT_TS}`)
  })
}
