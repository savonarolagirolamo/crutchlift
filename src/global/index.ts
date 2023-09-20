import { type TonClient } from '@eversdk/core'
import { type Giver } from '../giver'
import { type VendeeConfig } from '../cli/config/types'

export type GlobalVendee = {
  client: TonClient
  giver: Giver
  config: VendeeConfig
}

declare global {
  /* eslint-disable */
  var vendee: Partial<GlobalVendee> | undefined
}

export class Global {
  /// /////////
  // Client //
  /// /////////
  static get client (): TonClient | undefined {
    return global.vendee?.client
  }

  static set client (value: TonClient | undefined) {
    global.vendee = global.vendee ?? {}
    global.vendee.client = value
  }

  /// ////////
  // Giver //
  /// ////////
  static get giver (): Giver | undefined {
    return global.vendee?.giver
  }

  static set giver (value: Giver | undefined) {
    global.vendee = global.vendee ?? {}
    global.vendee.giver = value
  }

  /// /////////
  // Config //
  /// /////////
  static get config (): VendeeConfig | undefined {
    return global.vendee?.config
  }

  static set config (value: VendeeConfig | undefined) {
    global.vendee = global.vendee ?? {}
    global.vendee.config = value
  }

  /// //////
  // All //
  /// //////
  static set vendee (value: GlobalVendee) {
    global.vendee = value
  }
}
