import { type VendeeConfig } from '../config/types'
import { type KeyPair, type TonClient } from '@eversdk/core'
import { namedKeys, readKeys } from '../../keys'

export async function createOrReadGlobalGiverKeys (config: VendeeConfig, network: string, client: TonClient): Promise<KeyPair> {
  const keys = config.networks[network].keys

  if (keys?.file !== undefined && keys?.file !== '')
    return readKeys(keys.file)

  const name = (keys?.name === undefined || keys?.name === '') ? `${network}.giver` : keys.name
  return await namedKeys(name, config.paths.keys, client)
}
