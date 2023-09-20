import { giverSend } from '../actions/giver'
import { Form } from './enquirer'
import { type VendeeConfig } from '../config/types'

export async function showGiverSendForm (config: VendeeConfig, network: string): Promise<void> {
  const options = await new Form({
    message: 'Send coins',
    choices: [
      { name: 'to', message: 'To', initial: '0:0000000000000000000000000000000000000000000000000000000000000000' },
      { name: 'value', message: 'Value', initial: '0.001' }
    ]
  }).run()

  await giverSend(config, network, options)
}
