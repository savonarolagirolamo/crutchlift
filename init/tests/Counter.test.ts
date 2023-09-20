import { assert } from 'chai'
import { Counter } from '../build'
import { B, generateRandomKeyPair, SafeMultisigWallet, x0 } from 'vascoo'

const INITIAL_VALUE = 10

describe('Counter', function () {
  it('deploy', async (): Promise<void> => {
    const counter = new Counter()
    await counter.deploy(0.1 * B, { number: INITIAL_VALUE })
    const getCountOut = await counter.run.getCount()
    assert.equal(parseInt(getCountOut.count), INITIAL_VALUE)
  })

  it('self add', async (): Promise<void> => {
    const counter = new Counter()
    await counter.deploy(0.1 * B, { number: INITIAL_VALUE })
    await counter.call.selfAdd({ number: INITIAL_VALUE })
    const getCountOut = await counter.run.getCount()
    assert.equal(parseInt(getCountOut.count), INITIAL_VALUE * 2)
  })

  it('add', async (): Promise<void> => {
    const counter = new Counter()
    await counter.deploy(B, { number: INITIAL_VALUE })
    const wallet = new SafeMultisigWallet()
    const keys = await generateRandomKeyPair()
    await wallet.deploy(0.2 * B, { owners: [x0(keys.public)], reqConfirms: 1 })
    await wallet.call.sendTransaction({
      dest: await counter.address(),
      value: 0.1 * B,
      bounce: true,
      flags: 0,
      payload: await counter.payload.add({
        number: INITIAL_VALUE
      })
    }, keys)
    await counter.wait()
    const getCountOut = await counter.run.getCount()
    assert.equal(parseInt(getCountOut.count), INITIAL_VALUE * 2)
  })
})