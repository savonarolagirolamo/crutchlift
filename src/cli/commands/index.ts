import { Argument, program } from 'commander'
import { compile } from '../actions/compile'
import { test } from '../actions/test'
import { giverDeploy, giverInfo, giverSend } from '../actions/giver'
import { tree } from '../actions/tree'
import { clean } from '../actions/clean'
import { seInfo, seReset, seStart, seStop, seVersion } from '../actions/se'
import { type VendeeConfig } from '../config/types'
import { packageJson } from './package'
import { GIVER_SEND_FLAGS, validateGiverSendOptions } from './giver'

export const COMPILE = 'compile'
export const TEST = 'test'
export const GIVER = 'giver'
export const SE = 'se'
export const TREE = 'tree'
export const CLEAN = 'clean'

export const GIVER_ACTIONS = {
  INFO: 'info',
  SEND: 'send',
  DEPLOY: 'deploy'
}

export const SE_ACTIONS = {
  INFO: 'info',
  VERSION: 'version',
  START: 'start',
  STOP: 'stop',
  RESET: 'reset'
}

export function createCommands (config: VendeeConfig): void {
  program
    .name(packageJson.name)
    .version(packageJson.version)

  program
    .command(COMPILE)
    .description('compile Solidity contracts')
    .action((): void => { compile() })

  program
    .command(TEST)
    .description('run tests')
    .action((): void => { test() })

  program
    .command(GIVER)
    .addArgument(new Argument('<network>', 'network').choices(Object.keys(config.networks)))
    .addArgument(new Argument('<action>', 'action').choices(Object.values(GIVER_ACTIONS)))
    .option(GIVER_SEND_FLAGS.to, 'address to send coins')
    .option(GIVER_SEND_FLAGS.value, 'coins value e.g. 0.1')
    .description('manage giver')
    .action(async (network: string, action: string, options: { to?: string, value?: string }): Promise<void> => {
      const validationResult = validateGiverSendOptions(options)
      switch (action) {
        case GIVER_ACTIONS.INFO:
          await giverInfo(config, network)
          break
        case GIVER_ACTIONS.SEND:
          if (validationResult.value === undefined)
            console.error(validationResult.error)
          else
            await giverSend(config, network, validationResult.value)
          break
        case GIVER_ACTIONS.DEPLOY:
          await giverDeploy(config, network)
          break
      }
    })

  program
    .command(SE)
    .addArgument(new Argument('[action]', 'action').choices(Object.values(SE_ACTIONS)))
    .description('manage local node Simple Emulator')
    .action(async (action: string): Promise<void> => {
      switch (action) {
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
      }
    })

  program
    .command(TREE)
    .description('show contracts dependency tree')
    .action((): void => { tree() })

  program
    .command(CLEAN)
    .description('clean build and cache directories')
    .action((): void => { clean(config.paths) })
}
