import { B } from '../../../utils/suffixes'

export type SendOptions = {
  to: string
  value: string
}

export function validate (options: SendOptions): {
  to: string
  value: bigint
} {
  if (!isAddress(options.to))
    throw new Error(`Invalid address: "${options.to}"`)

  if (!isFloat(options.value))
    throw new Error(`Invalid value: "${options.value}"`)

  return {
    to: options.to,
    value: BigInt(parseFloat(options.value) * parseFloat(B.toString()))
  }
}

function isAddress (address: string): boolean {
  return /^\d:[0-9a-fA-F]{64}$/.test(address)
}

function isFloat (number: string): boolean {
  return !Number.isNaN(parseFloat(number))
}
