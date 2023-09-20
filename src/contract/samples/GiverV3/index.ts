import { GiverV3Content } from './GiverV3Content'
import { type CompiledContractConfig, Contract, type ContractOptions, type ResultOfCall } from '../../index'
import { type KeyPair } from '@eversdk/core'
import { ZERO } from '../../constants'

type SendTransactionIn = {
  dest: string
  value: number | string | bigint
  bounce: boolean
}

type UpgradeIn = {
  code: string
}

type GetMessagesOut = {
  messages: Array<{
    hash: string
    expireAt: string
  }>
}

export class GiverV3 extends Contract {
  private readonly _call: GiverV3Calls
  private readonly _run: GiverV3Runs
  private readonly _payload: GiverV3Payload

  constructor (config: CompiledContractConfig, options: ContractOptions = {}) {
    if (config.address === undefined)
      super({
        abi: GiverV3Content.abi,
        initialData: config.initialData ?? {},
        keys: config.keys ?? ZERO.keys,
        tvc: GiverV3Content.tvc
      }, options)
    else
      super({
        address: config.address,
        abi: GiverV3Content.abi
      }, options)
    this._call = new GiverV3Calls(this)
    this._run = new GiverV3Runs(this)
    this._payload = new GiverV3Payload(this)
  }

  get call (): GiverV3Calls {
    return this._call
  }

  get run (): GiverV3Runs {
    return this._run
  }

  get payload (): GiverV3Payload {
    return this._payload
  }
}

class GiverV3Calls {
  constructor (private readonly contract: Contract) {}

  async sendTransaction (input: SendTransactionIn, keys?: KeyPair): Promise<ResultOfCall> {
    return await this.contract.callMethod('sendTransaction', input, keys)
  }

  async upgrade (input: UpgradeIn, keys?: KeyPair): Promise<ResultOfCall> {
    return await this.contract.callMethod('upgrade', input, keys)
  }

  async getMessages (keys?: KeyPair): Promise<ResultOfCall & { out: GetMessagesOut }> {
    return await this.contract.callMethod('getMessages', {}, keys)
  }
}

class GiverV3Runs {
  constructor (private readonly contract: Contract) {}

  async getMessages (): Promise<GetMessagesOut> {
    return (await this.contract.runMethod('getMessages')).value
  }
}

class GiverV3Payload {
  constructor (private readonly contract: Contract) {}

  async sendTransaction (input: SendTransactionIn): Promise<string> {
    return await this.contract.createPayload('sendTransaction', input)
  }

  async upgrade (input: UpgradeIn): Promise<string> {
    return await this.contract.createPayload('upgrade', input)
  }

  async getMessages (): Promise<string> {
    return await this.contract.createPayload('getMessages')
  }
}
