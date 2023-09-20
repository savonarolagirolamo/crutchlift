import { type TonClient } from '@eversdk/core'
import { type Giver } from '../giver'
import { type VaskuConfig } from '../cli/config/types'

export type GlobalVasku = {
  client: TonClient
  giver: Giver
  config: VaskuConfig
}

declare global {
  /* eslint-disable */
  var vasku: Partial<GlobalVasku> | undefined
}

export class Global {
  static get client (): TonClient | undefined {
    return global.vasku?.client
  }

  static set client (value: TonClient | undefined) {
    global.vasku = global.vasku ?? {}
    global.vasku.client = value
  }

  static get giver (): Giver | undefined {
    return global.vasku?.giver
  }

  static set giver (value: Giver | undefined) {
    global.vasku = global.vasku ?? {}
    global.vasku.giver = value
  }

  static get config (): VaskuConfig | undefined {
    return global.vasku?.config
  }

  static set config (value: VaskuConfig | undefined) {
    global.vasku = global.vasku ?? {}
    global.vasku.config = value
  }

  static set vasku (value: GlobalVasku) {
    global.vasku = value
  }
}
