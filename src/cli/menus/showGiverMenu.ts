import {BACK, HELP, QUIT, Select} from './enquirer'
import { GIVER_ACTIONS} from '../commands'
import { showGiverSendForm } from './showGiverSendForm'
import { giverDeploy, giverInfo } from '../actions/giver'
import { showMainMenu } from './showMainMenu'
import { type VendeeConfig } from '../config'
import {help} from '../actions/help'

export async function showGiverMenu (config: VendeeConfig, back: boolean = false): Promise<void> {
  const choice: string = await (new Select({
    message: 'Giver',
    choices: [
      GIVER_ACTIONS.INFO,
      GIVER_ACTIONS.SEND,
      GIVER_ACTIONS.DEPLOY,
      HELP,
      back ? BACK : QUIT
    ]
  })).run()

  switch (choice) {
    case GIVER_ACTIONS.INFO:
      giverInfo()
      break
    case GIVER_ACTIONS.SEND:
      await showGiverSendForm()
      break
    case GIVER_ACTIONS.DEPLOY:
      giverDeploy()
      break
    case HELP:
      await help()
      break
    case BACK:
      --process.argv.length
      await showMainMenu(config)
      break
  }
}
