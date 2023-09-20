import { type VendeeConfig } from '../config/types'
import { BACK, ELLIPSIS, HELP, Select } from './enquirer'
import { help } from '../actions/help'
import { showMainMenu } from './showMainMenu'
import { showRunScriptMenu } from './showRunScriptMenu'

export async function showRunMenu (config: VendeeConfig): Promise<void> {
  const choice = await (new Select({
    message: 'Select network',
    choices: [
      ...Object.keys(config.networks).map(value => value + ELLIPSIS),
      HELP,
      BACK
    ]
  })).run()

  const network = choice.substring(0, choice.length - ELLIPSIS.length)
  switch (choice) {
    case HELP:
      help()
      break
    case BACK:
      --process.argv.length
      await showMainMenu(config)
      break
    default:
      await showRunScriptMenu(config, network)
  }
}
