import { type VendeeConfig } from '../../config/types'
import { createGlobal } from '../../global/createGlobal'
import { printInfo } from './printInfo'

export type GiverSendOptions = {
  to: string
  value: string
}

export async function giverInfo (config: VendeeConfig, network: string): Promise<void> {
  const globalVendee = await createGlobal(config, network)
  await printInfo(globalVendee.giver.contract)
  globalVendee.client.close()
}

export async function giverSend (config: VendeeConfig, network: string, options: GiverSendOptions): Promise<void> {
  console.log('TODO giver send')
  console.log(config)
  console.log(network)
  console.log(options)
}

export async function giverDeploy (config: VendeeConfig, network: string): Promise<void> {
  console.log('TODO giver deploy')
  console.log(config)
  console.log(network)
}
