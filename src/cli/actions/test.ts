import Mocha from 'mocha'
import { type VaskuConfig } from '../config/types'
import { SE, upSeIfNotActive } from './common/se'
import { compile } from './compile'
import { globSync } from 'glob'
import { createGlobal } from '../global/createGlobal'

export async function test (
  config: VaskuConfig,
  patterns: string[] = [''],
  network: string = SE,
  compilation: boolean = true
): Promise<void> {
  if (patterns.length === 0)
    patterns = ['']

  ///////////////////
  // Create global //
  ///////////////////
  await createGlobal(config, network)

  ///////////
  // Up SE //
  ///////////
  await upSeIfNotActive(network, config.se)

  /////////////
  // Compile //
  /////////////
  if (compilation)
    await compile(config)

  ////////////////////
  // Read tests set //
  ////////////////////
  const tests = new Set<string>()
  patterns.forEach((value: string): void => {
    const pattern = `${process.cwd()}/${config.paths.tests}/**/*${value}*`
    const files = globSync(pattern, { nodir: true })
    files.forEach((value: string): void => { tests.add(value) })
  })

  //////////////
  // Run test //
  //////////////
  const mocha = new Mocha({ timeout: config.timeout })
  for (const test of tests.keys())
    mocha.addFile(test)
  mocha.run((fail: number): void => process.exit(fail))
}
