import { TonClient } from '@eversdk/core'
import { libNode } from '@eversdk/lib-node'
import { type VendeeConfig } from '../config/types'
import { Global, type GlobalVendee } from '../../global'
import { createGlobalGiver } from './createGlobalGiver'

export async function createGlobal (config: VendeeConfig, network: string): Promise<GlobalVendee> {
  const networkConfig = config.networks[network]
  if (networkConfig === undefined)
    throw new Error(`Network "${network}" is unknown`)

  TonClient.useBinaryLibrary(libNode)
  const client = new TonClient({ network: networkConfig })
  const giver = await createGlobalGiver(config, network, client)
  const globalVendee = { client, giver, config }
  Global.vendee = globalVendee
  return globalVendee
}
