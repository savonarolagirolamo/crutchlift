import { ELLIPSIS, HELP, QUIT, Select } from './enquirer'
import { COMPILE, GIVER, SE, TEST, CLEAN } from '../commands'
import { compile } from '../actions/compile'
import { showTestMenu } from './showTestMenu'
import { showGiverMenu } from './showGiverMenu'
import { showSEMenu } from './showSEMenu'
import { clean } from '../actions/clean'
import { help } from '../actions/help'
import { type VendeeConfig } from '../config/types'

export async function showMainMenu (config: VendeeConfig): Promise<void> {
  const choice = await (new Select({
    message: 'Vendee',
    choices: [
      COMPILE,
      TEST + ELLIPSIS,
      GIVER + ELLIPSIS,
      SE + ELLIPSIS,
      CLEAN,
      HELP,
      QUIT
    ]
  })).run()

  switch (choice) {
    case COMPILE:
      await compile(config, true)
      break
    case TEST + ELLIPSIS:
      process.argv.push(TEST)
      await showTestMenu(config)
      break
    case GIVER + ELLIPSIS:
      process.argv.push(GIVER)
      await showGiverMenu(config)
      break
    case SE + ELLIPSIS:
      process.argv.push(SE)
      await showSEMenu(config)
      break
    case CLEAN:
      clean(config.paths)
      break
    case HELP:
      help()
      break
  }
}
