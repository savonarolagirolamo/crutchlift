import { Counter } from '../build'
import { Global } from 'vascoo'
import { namedKeys } from 'vascoo-keys'

async function main (): Promise<void> {
  const keys = await namedKeys('counter')
  const counter = new Counter( { keys })
  console.log(await counter.address())
  console.log(await counter.balance())
  Global.client?.close()
}

main().catch(console.error)