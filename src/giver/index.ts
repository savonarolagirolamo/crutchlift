import { type Contract, type ResultOfCall } from '../contract'
import { type ResultOfProcessMessage } from '@eversdk/core'

export type SendParameters = {
  to: string
  value: string | number | bigint
}

export interface Giver {
  contract: Contract
  send: (parameters: SendParameters) => Promise<ResultOfCall>
  deploy: (value: string | number | bigint) => Promise<ResultOfProcessMessage>
}
