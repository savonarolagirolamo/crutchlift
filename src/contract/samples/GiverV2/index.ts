import { GiverV2Content } from './GiverV2Content'
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

export class GiverV2 extends Contract {
  private readonly _call: GiverV2Calls
  private readonly _run: GiverV2Runs
  private readonly _payload: GiverV2Payload

  constructor (config: CompiledContractConfig, options: ContractOptions = {}) {
    if (config.address === undefined)
      super({
        abi: GiverV2Content.abi,
        initialData: config.initialData ?? {},
        keys: config.keys ?? ZERO.keys,
        tvc: GiverV2Content.tvc
      }, options)
    else
      super({
        address: config.address,
        abi: GiverV2Content.abi
      }, options)
    this._call = new GiverV2Calls(this)
    this._run = new GiverV2Runs(this)
    this._payload = new GiverV2Payload(this)
  }

  get call (): GiverV2Calls {
    return this._call
  }

  get run (): GiverV2Runs {
    return this._run
  }

  get payload (): GiverV2Payload {
    return this._payload
  }
}

class GiverV2Calls {
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

class GiverV2Runs {
  constructor (private readonly contract: Contract) {}

  async getMessages (): Promise<GetMessagesOut> {
    return (await this.contract.runMethod('getMessages')).value
  }
}

class GiverV2Payload {
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
