import { GiverV2Content } from './GiverV2Content'
import { type CompiledContractConfig, Contract, type ContractOptions } from '../../index'
import { ZERO_KEY_PAIR } from '../../constants'

export class GiverV2 extends Contract {
  constructor (config: CompiledContractConfig, options: ContractOptions = {}) {
    if (config.address === undefined)
      super({
        abi: GiverV2Content.abi,
        initialData: config.initialData ?? {},
        keys: config.keys ?? ZERO_KEY_PAIR,
        tvc: GiverV2Content.tvc
      }, options)
    else
      super({
        address: config.address,
        abi: GiverV2Content.abi
      }, options)
  }
}
