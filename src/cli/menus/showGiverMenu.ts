import { showMainMenu } from './showMainMenu'
import { showGiverActionsMenu } from './showGiverActionsMenu'
import { help } from '../actions/help'
import { BACK, ELLIPSIS, HELP, Select } from './enquirer'
import { type VendeeConfig } from '../config/types'

export async function showGiverMenu (config: VendeeConfig): Promise<void> {
  const choice: string = await (new Select({
    message: 'Select giver network',
    choices: [
      ...Object.keys(config.networks).map((value: string) => value + ELLIPSIS),
      HELP,
      BACK
    ]
  })).run()

  const network: string = choice.substring(0, choice.length - ELLIPSIS.length)
  switch (choice) {
    case HELP:
      help()
      break
    case BACK:
      --process.argv.length
      await showMainMenu(config)
      break
    default:
      process.argv.push(network)
      await showGiverActionsMenu(config, network)
  }
}
