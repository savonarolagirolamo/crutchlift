import { BACK, HELP, Select } from './enquirer'
import { type VaskuConfig } from '../config/types'
import { SE_ACTIONS } from '../commands'
import { seInfo, seStart, seVersion, seStop, seReset } from '../actions/se'
import { help } from '../actions/help'
import { showMainMenu } from './showMainMenu'

export async function showSEMenu (config: VaskuConfig): Promise<void> {
  const choice = await (new Select({
    message: 'Local node Simple Emulator',
    choices: [
      SE_ACTIONS.INFO,
      SE_ACTIONS.VERSION,
      SE_ACTIONS.START,
      SE_ACTIONS.STOP,
      SE_ACTIONS.RESET,
      HELP,
      BACK
    ]
  })).run()

  switch (choice) {
    case SE_ACTIONS.INFO:
      await seInfo()
      break
    case SE_ACTIONS.VERSION:
      await seVersion()
      break
    case SE_ACTIONS.START:
      await seStart(config.se)
      break
    case SE_ACTIONS.STOP:
      await seStop()
      break
    case SE_ACTIONS.RESET:
      await seReset()
      break
    case HELP:
      help()
      break
    case BACK:
      --process.argv.length
      await showMainMenu(config)
      break
  }
}
