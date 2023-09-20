import { TonClient } from '@eversdk/core'
import { libNode } from '@eversdk/lib-node'
import { type VascooConfig } from '../config/types'
import { Global, type GlobalVascoo } from '../../global'
import { createGlobalGiver } from './createGlobalGiver'

export async function createGlobal (config: VascooConfig, network: string): Promise<GlobalVascoo> {
  const networkConfig = config.networks[network]
  if (networkConfig === undefined)
    throw new Error(`Network "${network}" is unknown`)

  TonClient.useBinaryLibrary(libNode)
  const client = new TonClient({ network: networkConfig })
  const giver = await createGlobalGiver(config, network, client)
  const globalVascoo = { client, giver, config }
  Global.vascoo = globalVascoo
  return globalVascoo
}
