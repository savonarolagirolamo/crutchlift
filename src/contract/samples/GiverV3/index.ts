import { GiverV3Content } from './GiverV3Content'
import { type CompiledContractConfig, Contract, type ContractOptions } from '../../index'
import { ZERO_KEY_PAIR } from '../../constants'

export class GiverV3 extends Contract {
  constructor (config: CompiledContractConfig, options: ContractOptions = {}) {
    if (config.address === undefined)
      super({
        abi: GiverV3Content.abi,
        initialData: config.initialData ?? {},
        keys: config.keys ?? ZERO_KEY_PAIR,
        tvc: GiverV3Content.tvc
      }, options)
    else
      super({
        address: config.address,
        abi: GiverV3Content.abi
      }, options)
  }
}
