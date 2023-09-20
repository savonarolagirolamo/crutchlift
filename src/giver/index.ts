import { type Contract } from '../contract'

export abstract class Giver {
  protected constructor (private readonly _contract: Contract) {
    this._contract = _contract
  }

  get contract (): Contract {
    return this._contract
  }
}
