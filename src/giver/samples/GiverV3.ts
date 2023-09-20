import { type Giver, type SendParameters } from '../index'
import { GiverV3 as GiverV3Contract } from '../../contract/samples/GiverV3'
import { type Contract, type ContractOptions, type ResultOfCall } from '../../contract'
import { type KeyPair, type ResultOfProcessMessage } from '@eversdk/core'

export class GiverV3 implements Giver {
  private readonly _contract: GiverV3Contract

  constructor (keys: KeyPair, options: ContractOptions = {}) {
    this._contract = new GiverV3Contract({ keys }, options)
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

  async deploy (value: string | number | bigint): Promise<ResultOfProcessMessage> {
    return await this._contract._deploy(value, {}, false)
  }
}
