import { type VendeeConfig } from '../config/types'
import { BACK, HELP, Select } from './enquirer'
import { help } from '../actions/help'
import { showMainMenu } from './showMainMenu'
import { test } from '../actions/test'

export async function showTestMenu (config: VendeeConfig): Promise<void> {
  const choice = await (new Select({
    message: 'Select test network',
    choices: [
      ...Object.keys(config.networks),
      HELP,
      BACK
    ]
  })).run()

  switch (choice) {
    case HELP:
      help()
      break
    case BACK:
      --process.argv.length
      await showMainMenu(config)
      break
    default:
      await test(config, [''], choice, true)
  }
}
