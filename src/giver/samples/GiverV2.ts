import { Giver } from '../index'
import { GiverV2 as GiverV2Contract } from '../../contract/samples/GiverV2'
import { type ContractOptions } from '../../contract'
import { type KeyPair } from '@eversdk/core'

export class GiverV2 extends Giver {
  constructor (keys: KeyPair, options: ContractOptions = {}) {
    super(new GiverV2Contract({ keys }, options))
  }
}
