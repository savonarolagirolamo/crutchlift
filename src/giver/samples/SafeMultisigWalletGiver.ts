import { type Giver, type SendParameters } from '../index'
import { SafeMultisigWallet } from '../../contract/samples/SafeMultisigWallet'
import { type Contract, type ContractOptions, type ResultOfCall } from '../../contract'
import { type KeyPair } from '@eversdk/core'
import { createTransferPayload } from '../../contract/payload'

export class SafeMultisigWalletGiver implements Giver {
  private readonly _contract: SafeMultisigWallet

  constructor (keys: KeyPair, options: ContractOptions = {}) {
    this._contract = new SafeMultisigWallet({ keys }, options)
  }

  get contract (): Contract {
    return this._contract
  }

  async send (options: SendParameters): Promise<ResultOfCall> {
    const payload = await createTransferPayload()
    return await this._contract.call.sendTransaction({
      dest: options.to,
      value: options.value,
      bounce: false,
      flags: 3,
      payload
    })
  }
}
