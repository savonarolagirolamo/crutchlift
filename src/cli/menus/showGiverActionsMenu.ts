import { showGiverMenu } from './showGiverMenu'
import { showGiverSendForm } from './showGiverSendForm'
import { giverDeploy, giverInfo } from '../actions/giver'
import { help } from '../actions/help'
import { BACK, ELLIPSIS, HELP, Select } from './enquirer'
import { GIVER_ACTIONS } from '../commands'
import { type VendeeConfig } from '../config/types'

export async function showGiverActionsMenu (config: VendeeConfig, network: string): Promise<void> {
  const choice: string = await (new Select({
    message: 'Giver',
    choices: [
      GIVER_ACTIONS.INFO,
      GIVER_ACTIONS.SEND + ELLIPSIS,
      GIVER_ACTIONS.DEPLOY,
      HELP,
      BACK
    ]
  })).run()

  switch (choice) {
    case GIVER_ACTIONS.INFO:
      await giverInfo(config, network)
      break
    case GIVER_ACTIONS.SEND + ELLIPSIS:
      await showGiverSendForm(config, network)
      break
    case GIVER_ACTIONS.DEPLOY:
      await giverDeploy(config, network)
      break
    case HELP:
      help()
      break
    case BACK:
      --process.argv.length
      await showGiverMenu(config)
      break
  }
}
