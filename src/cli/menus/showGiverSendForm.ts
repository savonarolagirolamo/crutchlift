import { Form } from './enquirer'
import { giverInfo, giverSend } from '../actions/giver'

export async function showGiverSendForm (): Promise<void> {
  giverInfo()

  const options: {
    to: string
    value: string
    bounce: string
  } = await new Form({
    message: 'Send coins',
    choices: [
      { name: 'to', message: 'To', initial: '0:0000000000000000000000000000000000000000000000000000000000000000' },
      { name: 'value', message: 'Value', initial: '0.001' },
      { name: 'bounce', message: 'Bounce', initial: 'false' }
    ]
  }).run()

  giverSend(options)
}
