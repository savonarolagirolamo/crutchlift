import { Argument, program } from 'commander'
import { compile } from './actions/compile'
import { test } from './actions/test'
import { giverDeploy, giverInfo, giverSend } from './actions/giver'
import { tree } from './actions/tree'
import { clean } from './actions/clean'
import { seInfo, seReset, seStart, seStop, seVersion } from './actions/se'
import { type VendeeConfig } from './config'
import { packageJson } from './package'

export const COMPILE: string = 'compile'
export const TEST: string = 'test'
export const GIVER: string = 'giver'
export const SE: string = 'se'
export const TREE: string = 'tree'
export const CLEAN: string = 'clean'
export const PUBLISH: string = 'publish'

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
    .addArgument(new Argument('[action]', 'action').choices(Object.values(GIVER_ACTIONS)))
    .option('-t, --to <to>', 'address to send coins')
    .option('-v, --value <value>', 'coins value e.g. 0.1')
    .option('-b, --bounce  <bounce>', 'bounce true | false')
    .description('manage giver')
    .action((action: string, options: { to?: string, value?: string, bounce?: string }): void => {
      switch (action) {
        case GIVER_ACTIONS.INFO:
          giverInfo()
          break
        case GIVER_ACTIONS.SEND:
          giverSend(options)
          break
        case GIVER_ACTIONS.DEPLOY:
          giverDeploy()
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
    .description('clean build and artifacts directories')
    .action((): void => { clean() })

  program
    .command(PUBLISH)
    .description('publish npm package with contracts')
    .action((): void => { tree() })
}
