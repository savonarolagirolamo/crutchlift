import { type TonClient } from '@eversdk/core'
import { type Giver } from '../giver'
import { type VascooConfig } from '../cli/config/types'

export type GlobalVascoo = {
  client: TonClient
  giver: Giver
  config: VascooConfig
}

declare global {
  /* eslint-disable */
  var vascoo: Partial<GlobalVascoo> | undefined
}

export class Global {
  static get client (): TonClient | undefined {
    return global.vascoo?.client
  }

  static set client (value: TonClient | undefined) {
    global.vascoo = global.vascoo ?? {}
    global.vascoo.client = value
  }

  static get giver (): Giver | undefined {
    return global.vascoo?.giver
  }

  static set giver (value: Giver | undefined) {
    global.vascoo = global.vascoo ?? {}
    global.vascoo.giver = value
  }

  static get config (): VascooConfig | undefined {
    return global.vascoo?.config
  }

  static set config (value: VascooConfig | undefined) {
    global.vascoo = global.vascoo ?? {}
    global.vascoo.config = value
  }

  static set vascoo (value: GlobalVascoo) {
    global.vascoo = value
  }
}
