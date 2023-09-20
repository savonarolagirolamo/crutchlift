import { type VendeeConfig } from '../../config/types'
import { createGlobal } from '../../global/createGlobal'
import { printEmptyLine, printContract, printMessage, printError } from './printContract'
import { Contract } from '../../../contract'
import { type SendOptions, validate } from './validate'

export async function giverInfo (config: VendeeConfig, network: string): Promise<void> {
  const global = await createGlobal(config, network)
  try {
    await printContract(global.giver.contract)
  } catch (e: any) {
    await printError(e)
  }
  global.client.close()
}

export async function giverSend (config: VendeeConfig, network: string, options: SendOptions): Promise<void> {
  const sendParameters = validate(options)

  const global = await createGlobal(config, network)
  const giver = global.giver
  const target = new Contract({ address: options.to }, {
    client: global.client
  })

  try {
    await printContract(giver.contract)
    await printEmptyLine()
    await printContract(target)
    await printMessage('send')
    await giver.send(sendParameters)
    await printContract(giver.contract)
    await printEmptyLine()
    await printContract(target)
  } catch (e: any) {
    await printError(e)
  }
  global.client.close()
}

export async function giverDeploy (config: VendeeConfig, network: string): Promise<void> {
  console.log('TODO giver deploy')
  console.log(config)
  console.log(network)
}
