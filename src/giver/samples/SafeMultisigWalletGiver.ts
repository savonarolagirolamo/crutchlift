import { type Giver, type SendParameters } from '../index'
import { SafeMultisigWallet } from '../../contract/samples/SafeMultisigWallet'
import { type Contract, type ContractOptions, type ResultOfCall } from '../../contract'
import { type KeyPair, type ResultOfProcessMessage } from '@eversdk/core'
import { createTransferPayload } from '../../contract/payload'
import { x0 } from '../../utils/hex'

export class SafeMultisigWalletGiver implements Giver {
  private readonly _keys: KeyPair
  private readonly _contract: SafeMultisigWallet

  constructor (keys: KeyPair, options: ContractOptions = {}) {
    this._keys = keys
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

  async deploy (value: string | number | bigint): Promise<ResultOfProcessMessage> {
    return await this._contract.deploy(value, {
      owners: [x0(this._keys.public)],
      reqConfirms: 1
    }, false)
  }
}
