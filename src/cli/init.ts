import * as fs from 'fs'
import { printGreeting } from './actions/init/printGreeting'
import { showInitMenu } from './menus/showInitMenu'
import { showBackupMenu } from './menus/showBackupMenu'

export async function init (): Promise<void> {
  printGreeting()

  const targetDirectoryIsEmpty: boolean = fs.readdirSync(process.cwd()).length === 0
  if (targetDirectoryIsEmpty)
    await showInitMenu()
  else
    await showBackupMenu()
}
