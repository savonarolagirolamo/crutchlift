import { SafeMultisigWalletContent } from './SafeMultisigWalletContent'
import { type CompiledContractConfig, Contract, type ContractOptions } from '../../index'
import { ZERO_KEY_PAIR } from '../../constants'

export class SafeMultisigWallet extends Contract {
  constructor (config: CompiledContractConfig, options: ContractOptions = {}) {
    if (config.address === undefined)
      super({
        abi: SafeMultisigWalletContent.abi,
        initialData: config.initialData ?? {},
        keys: config.keys ?? ZERO_KEY_PAIR,
        tvc: SafeMultisigWalletContent.tvc
      }, options)
    else
      super({
        address: config.address,
        abi: SafeMultisigWalletContent.abi
      }, options)
  }
}
