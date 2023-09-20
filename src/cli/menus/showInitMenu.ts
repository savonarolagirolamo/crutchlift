import { QUIT, Select } from './enquirer'
import { init } from '../actions/init/init'
import { green } from 'colors'

export async function showInitMenu (): Promise<void> {
  const YES = green('yes')
  const choice = await (new Select({
    message: 'Init project',
    choices: [
      YES,
      QUIT
    ]
  })).run()

  if (choice === YES)
    init()
}
