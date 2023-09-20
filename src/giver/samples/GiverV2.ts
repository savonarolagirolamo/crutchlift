import { type Giver, type SendParameters } from '../index'
import { GiverV2 as GiverV2Contract } from '../../contract/samples/GiverV2'
import { type Contract, type ContractOptions, type ResultOfCall } from '../../contract'
import { type KeyPair } from '@eversdk/core'

export class GiverV2 implements Giver {
  private readonly _contract: GiverV2Contract

  constructor (keys: KeyPair, options: ContractOptions = {}) {
    this._contract = new GiverV2Contract({ keys }, options)
  }

  get contract (): Contract {
    return this._contract
  }

  async send (options: SendParameters): Promise<ResultOfCall> {
    return await this._contract.call.sendTransaction({
      dest: options.to,
      value: options.value,
      bounce: false
    })
  }
}
