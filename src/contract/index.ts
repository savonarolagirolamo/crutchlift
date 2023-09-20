import {
  type AbiContract,
  type DecodedMessageBody,
  type KeyPair, type ResultOfProcessMessage,
  type TonClient
} from '@eversdk/core'
import { type Abi } from '@eversdk/core/dist/modules'
import { type Giver } from '../giver'
import { Global } from '../global'
import { error } from './constants'

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

export interface ResultOfCall {
  out: any
  result: ResultOfProcessMessage
}

export class Contract {
  private readonly abi: Abi
  private readonly initialData?: Record<string, any>
  private readonly keys?: KeyPair
  private readonly tvc?: string

  private readonly client?: TonClient
  private readonly giver?: Giver

  private _address?: string
  private _lastTransactionLogicTime: string

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
      throw error.noClient

    if (this.keys === undefined)
      throw error.noKeys

    if (this.tvc === undefined)
      throw new Error('Contract tvc is undefined')

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
      throw error.noClient

    const result: any[] = (await this.client.net.query_collection({
      collection: 'accounts',
      filter: {
        id: {
          eq: await this.address()
        },
        last_trans_lt: {
          ge: this._lastTransactionLogicTime
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
      throw error.noClient

    const result: any[] = (await this.client.net.query_collection({
      collection: 'accounts',
      filter: {
        id: {
          eq: await this.address()
        },
        last_trans_lt: {
          ge: this._lastTransactionLogicTime
        }
      },
      result: 'acc_type'
    })).result
    return (result !== undefined && result.length > 0) ? result[0].acc_type.toString() : AccountType.nonExist
  }

  /**
   * Run contract locally
   * @param method Method name
   * @param input
   * @example
   *   const contract = new Contract(...)
   *   const address = await contract.runMethod('getHistory', { offset: 1 })
   * @return { DecodedMessageBody }
   */
  public async runMethod (method: string, input: any = {}): Promise<DecodedMessageBody> {
    if (this.client === undefined)
      throw error.noClient

    //////////////////////
    // Read Bag Of Cell //
    //////////////////////
    const bagOfCell = (await this.client.net.query_collection({
      collection: 'accounts',
      filter: {
        id: {
          eq: await this.address()
        }
      },
      result: 'boc'
    })).result[0].boc

    /////////////////////////////
    // Encode external message //
    /////////////////////////////
    const encodedMessage = await this.client.abi.encode_message({
      abi: this.abi,
      signer: {
        type: 'None'
      },
      call_set: {
        function_name: method,
        input
      },
      address: this._address
    })

    /////////////////////////////////////////
    // Execute contract on virtual machine //
    /////////////////////////////////////////
    const outputMessage = (await this.client.tvm.run_tvm({
      message: encodedMessage.message,
      account: bagOfCell
    })).out_messages[0]

    ///////////////////////////
    // Decode output message //
    ///////////////////////////
    return await this.client.abi.decode_message({
      abi: this.abi,
      message: outputMessage
    })
  }

  /**
   * External call
   * @param method Method name
   * @param input
   * @param [keys] Use it if you want to call contact with keys. `this.keys` used by default.
   * @example
   *   const contract = new Contract(...)
   *   const address = await contract.runMethod('getHistory', { offset: 1 })
   */
  public async callMethod (method: string, input: any = {}, keys?: KeyPair): Promise<{
    out: any
    result: ResultOfProcessMessage
  }> {
    if (this.client === undefined)
      throw error.noClient

    ////////////////
    // Check keys //
    ////////////////
    const keysPair = keys ?? this.keys
    if (keysPair === undefined)
      throw error.noKeys

    ///////////////////////////////
    // Generate external message //
    ///////////////////////////////
    const resultOfProcessMessage: ResultOfProcessMessage = await this.client.processing.process_message({
      message_encode_params: {
        abi: this.abi,
        signer: {
          type: 'Keys',
          keys: keysPair
        },
        address: await this.address(),
        call_set: {
          function_name: method,
          input
        }
      },
      send_events: false
    })

    ////////////////////
    // Decode message //
    ////////////////////
    this._lastTransactionLogicTime = resultOfProcessMessage.transaction.lt.toString() ?? this._lastTransactionLogicTime
    return {
      out: resultOfProcessMessage.decoded?.output ?? {},
      result: resultOfProcessMessage
    }
  }

  /**
   * Return last transaction logic time
   * @example
   *   const contract = new Contract(...)
   *   contract.lastTransactionLogicTime
   * @return
   *   '0'
   */
  get lastTransactionLogicTime (): string {
    return this._lastTransactionLogicTime
  }

  /**
   * Deploy
   * @param value Deployment in nano coins
   * @param input constructor data
   * @param useGiver Send coins from giver before deployment if true
   * @param timeout How long to wait coins from giver on contract in milliseconds
   */
  public async _deploy (
    value: string | number | bigint,
    input: any = {},
    useGiver: boolean = true,
    timeout: number = 60000
  ): Promise<ResultOfProcessMessage> {
    ////////////////////////////
    // Check all requirements //
    ////////////////////////////
    const accountType = await this.accountType()
    if (accountType === AccountType.active)
      throw error.contractAlreadyDeployed

    if (this.client === undefined)
      throw error.noClient

    if (this.keys === undefined)
      throw error.noKeys

    if (this.tvc === undefined)
      throw error.noTvc

    if (useGiver && this.giver === undefined)
      throw error.noGiver

    ///////////////
    // Use giver //
    ///////////////
    const to = await this.address()
    if (useGiver && this.giver !== undefined)
      await this.giver.send({ to, value })

    /////////////////////////////
    // Waiting for balance > 0 //
    /////////////////////////////
    await this.client.net.wait_for_collection({
      collection: 'accounts',
      filter: {
        id: {
          eq: await this.address()
        },
        data: {
          eq: null
        },
        code: {
          eq: null
        },
        balance: {
          gt: '0'
        }
      },
      result: 'last_trans_lt',
      timeout
    })

    ////////////
    // Deploy //
    ////////////
    const resultOfProcessMessage: ResultOfProcessMessage = await this.client.processing.process_message({
      message_encode_params: {
        abi: this.abi,
        signer: {
          type: 'Keys',
          keys: this.keys
        },
        deploy_set: {
          tvc: this.tvc,
          initial_data: this.initialData
        },
        call_set: {
          function_name: 'constructor',
          input
        }
      },
      send_events: false
    })
    this._lastTransactionLogicTime = resultOfProcessMessage.transaction.lt ?? this._lastTransactionLogicTime
    return resultOfProcessMessage
  }

  /**
   * Use this if you want to wait for a transaction from one contract to another
   * @example
   *   const sender = new SenderContract(...)
   *   const receiver = new ReceiverContract(...)
   *   const to = await receiver.address()
   *   await sender.call.send({to, value: 1_000_000_000})
   *   const waitingResult = await receiver.wait(5000)
   * @param timeout Time in milliseconds
   * @return
   *   true
   */
  public async wait (timeout: number = 60000): Promise<boolean> {
    if (this.client === undefined)
      throw error.noClient

    try {
      const queryCollectionResult = await this.client.net.wait_for_collection({
        collection: 'accounts',
        filter: {
          id: {
            eq: await this.address()
          },
          last_trans_lt: {
            gt: this._lastTransactionLogicTime
          }
        },
        result: 'last_trans_lt',
        timeout
      })
      const result = queryCollectionResult.result
      this._lastTransactionLogicTime = result.last_trans_lt ?? '0'
      return true
    } catch (e: any) {}
    return false
  }
}
