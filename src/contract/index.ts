import { type AbiContract, type KeyPair, type TonClient } from '@eversdk/core'
import { type Abi } from '@eversdk/core/dist/modules'
import { type Giver } from '../giver'
import { Global } from '../global'
import { NoClientError } from './constants'

export enum AccountType {
  notFound = '-1',
  unInit = '0',
  active = '1',
  frozen = '2',
  nonExist = '3'
}

export type CompiledContractConfig = {
  address: string
  initialData?: Record<string, any>
  keys?: KeyPair
} | {
  address?: string
  initialData?: Record<string, any>
  keys: KeyPair
}

export type ContractOptions = {
  client?: TonClient
  giver?: Giver
}

export class Contract {
  private readonly abi: Abi
  private readonly initialData?: Record<string, any>
  private readonly keys?: KeyPair
  private readonly tvc?: string

  private readonly client?: TonClient
  private readonly giver?: Giver

  private _address?: string
  private readonly _lastTransactionLogicTime: string

  constructor (
    config: {
      address: string
      abi?: AbiContract
      initialData?: Record<string, any>
      tvc?: string
      keys?: KeyPair
    } | {
      address?: string
      abi: AbiContract
      initialData: Record<string, any>
      tvc: string
      keys: KeyPair
    },
    options: {
      client?: TonClient
      giver?: Giver
    } = {}
  ) {
    this._address = config.address
    this._lastTransactionLogicTime = '0'
    this.abi = {
      type: 'Contract',
      value: config.abi ?? {}
    }
    this.initialData = config.initialData ?? {}
    this.keys = config.keys
    this.tvc = config.tvc

    this.client = options.client ?? Global.client
    this.giver = options.giver ?? Global.giver
  }

  /**
   * Calculates the address only once. Next time returns the already calculated address
   * You can use this if you want to know the address of the contract before deploying
   * @example
   *   const contract = new Contract(...)
   *   const address = await contract.address()
   * @return
   *   '0:97b53be2604579e89bd0077a5456456857792eb2ff09849d14321fc2c167f29e'
   */
  public async address (): Promise<string> {
    if (this._address !== undefined)
      return this._address

    if (this.client === undefined)
      throw NoClientError

    if (this.keys === undefined)
      throw Error('Contract key is undefined')

    if (this.tvc === undefined)
      throw Error('Contract tvc is undefined')

    this._address = (await this.client.abi.encode_message({
      abi: this.abi,
      signer: {
        type: 'Keys',
        keys: this.keys
      },
      deploy_set: {
        tvc: this.tvc,
        initial_data: this.initialData
      }
    })).address
    return this._address
  }

  /**
   * Return contract balance
   * @example
   *   const contract = new Contract(...)
   *   const address = await contract.balance()
   * @return
   *   10000000000n
   */
  public async balance (): Promise<bigint> {
    if (this.client === undefined)
      throw NoClientError

    const result: any[] = (await this.client.net.query_collection({
      collection: 'accounts',
      filter: {
        id: {
          eq: await this.address()
        },
        last_trans_lt: {
          gt: this._lastTransactionLogicTime
        }
      },
      result: 'balance'
    })).result
    return (result !== undefined && result.length > 0) ? BigInt(result[0].balance) : BigInt(0)
  }

  /**
   * Return contract account type
   * @example
   *  const contract = new Contract(...)
   *  const address = await contract.accountType()
   * @return
   *   1
   */
  public async accountType (): Promise<AccountType> {
    if (this.client === undefined)
      throw NoClientError

    const result: any[] = (await this.client.net.query_collection({
      collection: 'accounts',
      filter: {
        id: {
          eq: await this.address()
        },
        last_trans_lt: {
          gt: this._lastTransactionLogicTime
        }
      },
      result: 'acc_type'
    })).result
    return (result !== undefined && result.length > 0) ? result[0].acc_type : AccountType.notFound
  }

  /**
   * Return last transaction logic time
   * @example
   *  const contract = new Contract(...)
   *  contract.lastTransactionLogicTime
   * @return
   *   '0'
   */
  get lastTransactionLogicTime (): string {
    return this._lastTransactionLogicTime
  }

  // TODO deploy impl
  public async deploy (): Promise<void> {
    console.log('TODO deploy')
    console.log(this.giver)
  }
}
