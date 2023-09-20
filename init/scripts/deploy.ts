import { Counter } from '../build'
import { B, Global } from 'vendee'
import { namedKeys } from 'vendee-keys'

async function main (): Promise<void> {
  const keys = await namedKeys('counter')
  const counter = new Counter( { keys })
  await counter.deploy(0.1 * B, { number: 0 })
  Global.client?.close()
}

main().catch(console.error)