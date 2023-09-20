import { type VendeeConfig } from '../config/types'
import { compile } from './compile'
import { createGlobal } from '../global/createGlobal'
import { SE, upSeIfNotActive } from './common/se'
import path from 'path'
import fs from 'fs-extra'
import { red, yellow } from 'colors'

export async function run (
  config: VendeeConfig,
  script: string,
  network: string = SE,
  compilation: boolean = true
): Promise<void> {
  ///////////
  // Up SE //
  ///////////
  await upSeIfNotActive(network, config.se)

  /////////////
  // Compile //
  /////////////
  if (compilation)
    await compile(config)

  ///////////////////
  // Create global //
  ///////////////////
  await createGlobal(config, network)

  ////////////////
  // Check file //
  ////////////////
  const file = path.resolve(process.cwd(), config.paths.scripts, script)
  const fileTs = file + '.ts'
  const fileExist = fs.existsSync(file)
  const fileTsExist = fs.existsSync(fileTs)
  if (!fileExist && !fileTsExist) {
    console.error(red(`${yellow(script)} not found in scripts directory`))
    process.exit()
  }

  /////////
  // Run //
  /////////
  if (fileTsExist)
    require(fileTs) // eslint-disable-line
  else if (fileExist)
    require(file) // eslint-disable-line
}
