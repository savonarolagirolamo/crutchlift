import { type SEConfig } from '../../config/types'
import { TonClient } from '@eversdk/core'

const ACTIVATION_WAITING_TIMEOUT = 1000
const URL = 'http://localhost'
const DEFAULT_PORT = 80

export async function seIsActive (config: SEConfig): Promise<boolean> {
  const client = new TonClient({
    network: {
      endpoints: [`${URL}:${config.port ?? DEFAULT_PORT}`],
      network_retries_count: 1,
      wait_for_timeout: ACTIVATION_WAITING_TIMEOUT
    }
  })
  try {
    const query = 'query { info { version } }'
    const version = (await client.net.query({ query })).result.data.info.version
    client.close()
    return version !== undefined
  } catch (e: any) {
    client.close()
    return false
  }
}

export async function waitForSE (config: SEConfig): Promise<void> {
  let active = false
  while (!active)
    active = await seIsActive(config)
}
