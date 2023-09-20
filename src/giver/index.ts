import { type Contract, type ResultOfCall } from '../contract'

export type SendParameters = {
  to: string
  value: string | number | bigint
}

export interface Giver {
  contract: Contract
  send: (parameters: SendParameters) => Promise<ResultOfCall>
}
