import { type AbiContract } from '@eversdk/core'

/**
 * Add `0x` to string or number
 * @param number
 * @example
 *   x0('123')
 * @return
 *   '0x123'
 */
export function x0 (number: string | number | bigint): string {
  return `0x${number.toString()}`
}

/**
 * Convert abi to hex
 * @param abi
 * @example
 *   abiToHex('{ABI ver...')
 * @return
 *   '7b0a0922...'
 */
export function abiToHex (abi: AbiContract): string {
  return stringToHex(JSON.stringify(abi))
}

/**
 * Convert string to hex
 * @param string
 * @example
 *   stringToHex('XYZ123')
 * @return
 *   '58595a313233'
 */
export function stringToHex (string: string): string {
  return string.split('').map((x: string) => x.charCodeAt(0).toString(16)).join('')
}

/**
 * Convert array of strings to hex. Actual for string[] or bytes[] parameter in Solidity
 * @param strings
 * @example
 *   stringsToHex(['XYZ123', 'ABC456'])
 * @return
 *   ['58595a313233', '414243343536']
 */
export function stringsToHex (strings: string[]): string[] {
  return strings.map((x: string) => stringToHex(x))
}

/**
 * Convert number to hex
 * @param number
 * @example
 *   numberToHex(1_000_000_000)
 * @return
 *   '0x3b9aca00'
 */
export function numberToHex (number: number): string {
  return x0(number.toString(16))
}
