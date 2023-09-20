import { Giver } from '../index'
import { GiverV3 as GiverV3Contract } from '../../contract/samples/GiverV3'
import { type ContractOptions } from '../../contract'
import { type KeyPair } from '@eversdk/core'

export class GiverV3 extends Giver {
  constructor (keys: KeyPair, options: ContractOptions = {}) {
    super(new GiverV3Contract({ keys }, options))
  }
}
