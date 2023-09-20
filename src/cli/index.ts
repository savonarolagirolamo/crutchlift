#!/usr/bin/env node

import { isConfigExist, readConfig } from './config'
import { type VendeeConfig } from './config/types'
import { isNoCommands, isGiverCommand, isGiverSendCommand, isSECommand } from './checkers'
import { init } from './init'
import { showMainMenu } from './menus/showMainMenu'
import { showGiverMenu } from './menus/showGiverMenu'
import { showSEMenu } from './menus/showSEMenu'
import { showGiverSendForm } from './menus/showGiverSendForm'
import { createCommands } from './commands'
import { program } from 'commander'

async function main (): Promise<void> {
  if (!isConfigExist()) {
    await init()
    return
  }

  const config: VendeeConfig = readConfig()
  createCommands(config)

  if (isNoCommands) {
    await showMainMenu(config)
    return
  }

  if (isGiverCommand) {
    await showGiverMenu(config)
    return
  }

  if (isGiverSendCommand) {
    await showGiverSendForm()
    return
  }

  if (isSECommand) {
    await showSEMenu(config)
    return
  }

  program.parse()
}

main().catch(console.error)
