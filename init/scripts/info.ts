import { Counter } from '../build/Counter'
import { B, Global, namedKeys } from 'vendee'

async function main (): Promise<void> {
  const counter = new Counter( { keys: await namedKeys('counter')})
  console.log(await counter.address())
  console.log(await counter.balance())
  Global.client?.close()
}

main().catch(console.error)