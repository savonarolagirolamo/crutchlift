import { QUIT, Select } from './enquirer'
import { backup } from '../actions/init/backup'
import { init } from '../actions/init/init'
import { green } from 'colors'

const DIRECTORY = 'backup'

export async function showBackupMenu (): Promise<void> {
  const BACKUP = `move files to ${green(DIRECTORY)} directory and initialize project`
  const choice = await (new Select({
    message: 'Tried to initiate a project, but the directory is not empty',
    choices: [
      BACKUP,
      QUIT
    ]
  })).run()

  if (choice === BACKUP) {
    backup(process.cwd(), DIRECTORY)
    init()
  }
}
