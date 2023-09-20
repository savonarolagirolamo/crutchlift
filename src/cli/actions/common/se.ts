import { type SEConfig } from '../../config/types'
import { TonClient } from '@eversdk/core'
import { seStart } from '../se'
import { startPreloader, stopPreloader } from './preloader'
import { delay } from '../../../utils/delay'

export const SE = 'se'
const TIMEOUT = 2000
const URL = 'http://localhost'
const DEFAULT_PORT = 8080
const DELAY = 200

export async function upSeIfNotActive (network: string, config: SEConfig): Promise<void> {
  if (network === SE && !(await seIsActive(config))) {
    await seStart(config)
    startPreloader('Waiting for query server. This may take a few minutes in first time')
    await waitForSE(config)
    stopPreloader()
  }
}

async function seIsActive (config: SEConfig): Promise<boolean> {
  const client = new TonClient({
    network: {
      endpoints: [`${URL}:${config.port ?? DEFAULT_PORT}`],
      max_reconnect_timeout: TIMEOUT,
      message_processing_timeout: TIMEOUT,
      wait_for_timeout: TIMEOUT,
      query_timeout: TIMEOUT,
      reconnect_timeout: TIMEOUT
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

async function waitForSE (config: SEConfig): Promise<void> {
  let active = await seIsActive(config)
  while (!active) {
    await delay(DELAY)
    active = await seIsActive(config)
  }
}
