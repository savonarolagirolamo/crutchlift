import { type VendeeConfig } from '../../config/types'

export type GiverSendOptions = {
  to: string
  value: string
}

export async function giverInfo (config: VendeeConfig, network: string): Promise<void> {
  console.log('TODO giver send')
  console.log(config)
  console.log(network)
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
