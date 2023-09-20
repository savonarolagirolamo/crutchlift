import { Giver } from '../index'
import { SafeMultisigWallet } from '../../contract/samples/SafeMultisigWallet'
import { type ContractOptions } from '../../contract'
import { type KeyPair } from '@eversdk/core'

export class SafeMultisigWalletGiver extends Giver {
  constructor (keys: KeyPair, options: ContractOptions = {}) {
    super(new SafeMultisigWallet({ keys }, options))
  }
}
