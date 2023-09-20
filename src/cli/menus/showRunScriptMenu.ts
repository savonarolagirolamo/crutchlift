import path from 'path'
import { type VaskuConfig } from '../config/types'
import { BACK, ELLIPSIS, HELP, Select } from './enquirer'
import { help } from '../actions/help'
import { run } from '../actions/run'
import { showRunMenu } from './showRunMenu'
import { globSync } from 'glob'
import { blue } from 'colors'

const ROOT_DIRECTORY = '.'

export async function showRunScriptMenu (
  config: VaskuConfig,
  network: string,
  directory: string = ROOT_DIRECTORY
): Promise<void> {
  ////////////////////////////////
  // Get current menu directory //
  ////////////////////////////////
  const currentDirectory = path.resolve(process.cwd(), config.paths.scripts, directory)

  //////////////////////
  // Read directories //
  //////////////////////
  const directories = globSync(`${currentDirectory}/*/`).reduce((
    map: Map<string, string>,
    value
  ) => {
    const name = path.relative(currentDirectory, value)
    const text = blue(name) + ELLIPSIS
    return map.set(text, name)
  }, new Map<string, string>())

  ///////////////////////////
  // Read TypeScript files //
  ///////////////////////////
  const files = globSync(`${currentDirectory}/*.ts`, { nodir: true }).reduce((
    map: Map<string, string>,
    value
  ) => {
    const file = path.relative(currentDirectory, value)
    const key = file.substring(0, file.length - '.ts'.length)
    return map.set(key, file)
  }, new Map<string, string>())

  ///////////////
  // Show menu //
  ///////////////
  const choice = await (new Select({
    message: 'Select script',
    choices: [
      ...[...directories.keys()].reverse(),
      ...[...files.keys()].reverse(),
      HELP,
      BACK
    ]
  })).run()

  ////////////
  // Choice //
  ////////////
  switch (choice) {
    case HELP:
      help()
      break
    case BACK:
      if (directory === ROOT_DIRECTORY)
        await showRunMenu(config)
      else
        await showRunScriptMenu(config, network, path.basename(path.dirname(directory)))
      break
    default:
      if (directories.has(choice))
        await showRunScriptMenu(config, network, `${directory}/${directories.get(choice) ?? ''}`)
      else
        await run(config, `${directory}/${files.get(choice) ?? ''}`, network, true)
  }
}
