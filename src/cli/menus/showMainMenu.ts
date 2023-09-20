import { HELP, QUIT, Select } from './enquirer'
import { COMPILE, GIVER, SE, TEST, TREE, CLEAN, PUBLISH } from '../commands'
import { compile } from '../actions/compile'
import { test } from '../actions/test'
import { showGiverMenu } from './showGiverMenu'
import { showSEMenu } from './showSEMenu'
import { tree } from '../actions/tree'
import { clean } from '../actions/clean'
import { publish } from '../actions/publish'
import { type VendeeConfig } from '../config/types'
import { help } from '../actions/help'

export async function showMainMenu (config: VendeeConfig): Promise<void> {
  const GIVER_ELLIPSIS: string = GIVER + ' …'
  const SE_ELLIPSIS: string = SE + ' …'
  const choice: string = await (new Select({
    message: 'Vendee',
    choices: [
      COMPILE,
      TEST,
      GIVER_ELLIPSIS,
      SE_ELLIPSIS,
      TREE,
      CLEAN,
      PUBLISH,
      HELP,
      QUIT
    ]
  })).run()

  switch (choice) {
    case COMPILE:
      compile()
      break
    case TEST:
      test()
      break
    case GIVER_ELLIPSIS:
      process.argv.push(GIVER)
      await showGiverMenu(config, true)
      break
    case SE_ELLIPSIS:
      process.argv.push(SE)
      await showSEMenu(config, true)
      break
    case TREE:
      tree()
      break
    case CLEAN:
      clean(config.paths)
      break
    case PUBLISH:
      publish()
      break
    case HELP:
      help()
      break
  }
}
