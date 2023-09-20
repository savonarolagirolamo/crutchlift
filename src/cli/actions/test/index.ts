import Mocha from 'mocha'
import { type VendeeConfig } from '../../config/types'
import { seIsActive, waitForSE } from './se'
import { seStart } from '../se'
import { compile } from '../compile'
import { startPreloader, stopPreloader } from './preloader'
import { globSync } from 'glob'
import { createGlobal } from '../../global/createGlobal'

const SE_NETWORK = 'se'

export async function test (
  config: VendeeConfig,
  patterns: string[] = [''],
  network: string = SE_NETWORK,
  compilation: boolean = true
): Promise<void> {
  if (patterns.length === 0)
    patterns = ['']

  ///////////
  // Up SE //
  ///////////
  if (network === SE_NETWORK && !(await seIsActive(config.se))) {
    await seStart(config.se)
    startPreloader('Waiting for query server. This may take a few minutes in first time')
    await waitForSE(config.se)
    stopPreloader()
  }

  /////////////
  // Compile //
  /////////////
  if (compilation)
    await compile(config)

  ///////////////////
  // Create global //
  ///////////////////
  await createGlobal(config, network)

  ///////////
  // Tests //
  ///////////
  const testsSet = new Set<string>()
  patterns.forEach((value: string): void => {
    const pattern = `${process.cwd()}/${config.paths.tests}/**/*${value}*`
    const files = globSync(pattern, { nodir: true })
    files.forEach((value: string): void => { testsSet.add(value) })
  })

  const mocha = new Mocha({ timeout: config.timeout })
  for (const test of testsSet.keys())
    mocha.addFile(test)
  mocha.run((fail: number): void => process.exit(fail))
}
