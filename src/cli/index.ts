#!/usr/bin/env node

import { isConfigExist, readConfig } from './config'
import {
  isNoCommands,
  isGiverCommand,
  isGiverNetworkCommand,
  isGiverNetworkSendCommand,
  isSECommand,
  isTestCommand,
  isRunCommand,
  FIRST_ARGUMENT
} from './checkers'
import { init } from './init'
import { enableExecuteTypeScript } from './enableExecuteTypeScript'
import { showMainMenu } from './menus/showMainMenu'
import { showGiverMenu } from './menus/showGiverMenu'
import { showGiverActionsMenu } from './menus/showGiverActionsMenu'
import { showSEMenu } from './menus/showSEMenu'
import { showGiverSendForm } from './menus/showGiverSendForm'
import { createCommands } from './commands'
import { program } from 'commander'
import { showTestMenu } from './menus/showTestMenu'
import { showRunMenu } from './menus/showRunMenu'

async function main (): Promise<void> {
  if (!isConfigExist()) {
    await init()
    return
  }

  enableExecuteTypeScript()
  const config = readConfig()
  createCommands(config)

  if (isNoCommands()) {
    await showMainMenu(config)
    return
  }

  if (isTestCommand()) {
    await showTestMenu(config)
    return
  }

  if (isRunCommand()) {
    await showRunMenu(config)
    return
  }

  if (isGiverCommand()) {
    await showGiverMenu(config)
    return
  }

  if (isGiverNetworkCommand(config.networks)) {
    await showGiverActionsMenu(config, FIRST_ARGUMENT)
    return
  }

  if (isGiverNetworkSendCommand(config.networks)) {
    await showGiverSendForm(config, FIRST_ARGUMENT)
    return
  }

  if (isSECommand()) {
    await showSEMenu(config)
    return
  }

  program.parse()
}

main().catch(console.error)
