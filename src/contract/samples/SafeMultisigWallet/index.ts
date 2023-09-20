import { SafeMultisigWalletContent } from './SafeMultisigWalletContent'
import { type CompiledContractConfig, Contract, type ContractOptions, type ResultOfCall } from '../../index'
import { type KeyPair, type ResultOfProcessMessage } from '@eversdk/core'

type DeployIn = {
  owners: string[] | number[] | bigint[]
  reqConfirms: string | number | bigint
}

type SendTransactionIn = {
  dest: string
  value: string | number | bigint
  bounce: boolean
  flags: string | number | bigint
  payload: string
}

type AcceptTransferIn = {
  payload: string
}

type SubmitTransactionIn = {
  dest: string
  value: string | number | bigint
  bounce: boolean
  flags: string | number | bigint
  payload: string
}

type SubmitTransactionOut = {
  transId: string
}

type ConfirmTransactionIn = {
  transactionId: string | number | bigint
}

type IsConfirmedIn = {
  mask: string | number | bigint
  index: string | number | bigint
}

type IsConfirmedOut = {
  confirmed: boolean
}

type GetParametersOut = {
  maxQueuedTransactions: string
  maxCustodianCount: string
  expirationTime: string
  minValue: string
  requiredTxnConfirms: string
}

type GetTransactionIn = {
  transactionId: string | number | bigint
}

type GetTransactionOut = {
  trans: {
    id: string
    confirmationsMask: string
    signsRequired: string
    signsReceived: string
    creator: string
    index: string
    dest: string
    value: string
    sendFlags: string
    payload: string
    bounce: boolean
  }
}

type GetTransactionsOut = {
  trans: Array<{
    id: string
    confirmationsMask: string
    signsRequired: string
    signsReceived: string
    creator: string
    index: string
    dest: string
    value: string
    sendFlags: string
    payload: string
    bounce: boolean
  }>
}

type GetTransactionIdsOut = {
  ids: string[]
}

type GetCustodiansOut = {
  index: string
  name: string
}

export class SafeMultisigWallet extends Contract {
  private readonly _call: SafeMultisigWalletCalls
  private readonly _run: SafeMultisigWalletRuns
  private readonly _payload: SafeMultisigWalletPayload

  constructor (config: CompiledContractConfig = {}, options: ContractOptions = {}) {
    if (config.address === undefined)
      super({
        abi: SafeMultisigWalletContent.abi,
        initialData: config.initialData ?? {},
        keys: config.keys,
        tvc: SafeMultisigWalletContent.tvc
      }, options)
    else
      super({
        address: config.address,
        abi: SafeMultisigWalletContent.abi
      }, options)
    this._call = new SafeMultisigWalletCalls(this)
    this._run = new SafeMultisigWalletRuns(this)
    this._payload = new SafeMultisigWalletPayload(this)
  }

  async deploy (
    value: string | number | bigint,
    input: DeployIn,
    useGiver: boolean = true,
    timeout: number = 60000
  ): Promise<ResultOfProcessMessage> {
    return await this._deploy(value, input, useGiver, timeout)
  }

  get call (): SafeMultisigWalletCalls {
    return this._call
  }

  get run (): SafeMultisigWalletRuns {
    return this._run
  }

  get payload (): SafeMultisigWalletPayload {
    return this._payload
  }
}

class SafeMultisigWalletCalls {
  constructor (private readonly contract: Contract) {}

  public async acceptTransfer (input: AcceptTransferIn, keys?: KeyPair): Promise<ResultOfCall> {
    return await this.contract.callMethod('acceptTransfer', input, keys)
  }

  public async sendTransaction (input: SendTransactionIn, keys?: KeyPair): Promise<ResultOfCall> {
    return await this.contract.callMethod('sendTransaction', input, keys)
  }

  public async submitTransaction (input: SubmitTransactionIn, keys?: KeyPair): Promise<ResultOfCall & { out: SubmitTransactionOut }> {
    return await this.contract.callMethod('submitTransaction', input, keys)
  }

  public async confirmTransaction (input: ConfirmTransactionIn, keys?: KeyPair): Promise<ResultOfCall> {
    return await this.contract.callMethod('confirmTransaction', input, keys)
  }

  public async isConfirmed (input: IsConfirmedIn, keys?: KeyPair): Promise<ResultOfCall & { out: IsConfirmedOut }> {
    return await this.contract.callMethod('isConfirmed', input, keys)
  }

  public async getParameters (keys?: KeyPair): Promise<ResultOfCall & { out: GetParametersOut }> {
    return await this.contract.callMethod('getParameters', {}, keys)
  }

  public async getTransaction (input: GetTransactionIn, keys?: KeyPair): Promise<ResultOfCall & { out: GetTransactionOut }> {
    return await this.contract.callMethod('getTransaction', input, keys)
  }

  public async getTransactions (keys?: KeyPair): Promise<ResultOfCall & { out: GetTransactionsOut }> {
    return await this.contract.callMethod('getTransactions', {}, keys)
  }

  public async getTransactionIds (keys?: KeyPair): Promise<ResultOfCall & { out: GetTransactionIdsOut }> {
    return await this.contract.callMethod('getTransactionIds', {}, keys)
  }

  public async getCustodians (keys?: KeyPair): Promise<ResultOfCall & { out: GetCustodiansOut }> {
    return await this.contract.callMethod('getCustodians', {}, keys)
  }
}

class SafeMultisigWalletRuns {
  constructor (private readonly contract: Contract) {}

  public async submitTransaction (input: SubmitTransactionIn): Promise<SubmitTransactionOut> {
    return (await this.contract.runMethod('submitTransaction', input)).value
  }

  public async isConfirmed (input: IsConfirmedIn): Promise<IsConfirmedOut> {
    return (await this.contract.runMethod('isConfirmed', input)).value
  }

  public async getParameters (): Promise<GetParametersOut> {
    return (await this.contract.runMethod('getParameters')).value
  }

  public async getTransaction (input: GetTransactionIn): Promise<GetTransactionOut> {
    return (await this.contract.runMethod('getTransaction', input)).value
  }

  public async getTransactions (): Promise<GetTransactionsOut> {
    return (await this.contract.runMethod('getTransactions')).value
  }

  public async getTransactionIds (): Promise<GetTransactionIdsOut> {
    return (await this.contract.runMethod('getTransactionIds')).value
  }

  public async getCustodians (): Promise<GetCustodiansOut> {
    return (await this.contract.runMethod('getCustodians')).value
  }
}

class SafeMultisigWalletPayload {
  constructor (private readonly contract: Contract) {}

  public async acceptTransfer (input: AcceptTransferIn): Promise<string> {
    return await this.contract.createPayload('acceptTransfer', input)
  }

  public async sendTransaction (input: SendTransactionIn): Promise<string> {
    return await this.contract.createPayload('sendTransaction', input)
  }

  public async submitTransaction (input: SubmitTransactionIn): Promise<string> {
    return await this.contract.createPayload('submitTransaction', input)
  }

  public async confirmTransaction (input: ConfirmTransactionIn): Promise<string> {
    return await this.contract.createPayload('confirmTransaction', input)
  }

  public async isConfirmed (input: IsConfirmedIn): Promise<string> {
    return await this.contract.createPayload('isConfirmed', input)
  }

  public async getParameters (): Promise<string> {
    return await this.contract.createPayload('getParameters')
  }

  public async getTransaction (input: GetTransactionIn): Promise<string> {
    return await this.contract.createPayload('getTransaction', input)
  }

  public async getTransactions (): Promise<string> {
    return await this.contract.createPayload('getTransactions')
  }

  public async getTransactionIds (): Promise<string> {
    return await this.contract.createPayload('getTransactionIds')
  }

  public async getCustodians (): Promise<string> {
    return await this.contract.createPayload('getCustodians')
  }
}
