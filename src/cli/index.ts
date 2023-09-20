#!/usr/bin/env node

import { isConfigExist, readConfig } from './config'
import {
  isNoCommands,
  isGiverCommand,
  isGiverNetworkCommand,
  isGiverNetworkSendCommand,
  isSECommand,
  FIRST_ARGUMENT
} from './checkers'
import { init } from './init'
import { showMainMenu } from './menus/showMainMenu'
import { showGiverMenu } from './menus/showGiverMenu'
import { showGiverActionsMenu } from './menus/showGiverActionsMenu'
import { showSEMenu } from './menus/showSEMenu'
import { showGiverSendForm } from './menus/showGiverSendForm'
import { createCommands } from './commands'
import { program } from 'commander'
import './register'

async function main (): Promise<void> {
  if (!isConfigExist()) {
    await init()
    return
  }

  const config = readConfig()
  createCommands(config)

  if (isNoCommands()) {
    await showMainMenu(config)
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
