import { Counter } from '../build'
import { B, Global, namedKeys } from 'vendee'

async function main (): Promise<void> {
  await (new Counter( { keys: await namedKeys('counter')}))
    .deploy(0.1 * B, { number: 0 })
  Global.client?.close()
}

main().catch(console.error)