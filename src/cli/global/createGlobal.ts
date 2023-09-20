import { TonClient } from '@eversdk/core'
import { libNode } from '@eversdk/lib-node'
import { type VaskuConfig } from '../config/types'
import { Global, type GlobalVasku } from '../../global'
import { createGlobalGiver } from './createGlobalGiver'

export async function createGlobal (config: VaskuConfig, network: string): Promise<GlobalVasku> {
  const networkConfig = config.networks[network]
  if (networkConfig === undefined)
    throw new Error(`Network "${network}" is unknown`)

  TonClient.useBinaryLibrary(libNode)
  const client = new TonClient({ network: networkConfig })
  const giver = await createGlobalGiver(config, network, client)
  const globalVascoo = { client, giver, config }
  Global.vasku = globalVascoo
  return globalVascoo
}
