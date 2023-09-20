import { type VendeeConfig } from '../config/types'

export async function compile (config: VendeeConfig, force: boolean = false): Promise<void> {
  console.log('TODO compile')
  console.log(config && Math.random() > 0.5)
  console.log(force)
}
