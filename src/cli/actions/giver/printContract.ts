import colors, { type Color } from 'colors'
import { type AccountType, type Contract } from '../../../contract'
import { B } from '../../../utils/suffixes'

/* eslint-disable */
const types: Record<AccountType, string> = {
  '-1': 'Not found',
  '0': 'Un init',
  '1': 'Active',
  '2': 'Frozen',
  '3': 'Non exist'
}

/* eslint-disable */
const colorize: Record<AccountType, Color> = {
  '-1': colors.gray,
  '0': colors.yellow,
  '1': colors.green,
  '2': colors.blue,
  '3': colors.red
}

/**
 * Read account data from GraphQL and output to the terminal
 * @param contract contract
 */
export async function printContract (contract: Contract): Promise<void> {
  const contractName = contract.constructor.name
  const address = await contract.address()
  const balance = prettifyBalance(await contract.balance())
  const accountType = await contract.accountType()
  const type = types[await contract.accountType()]
  const colorizeFunction = colorize[accountType]
  console.log(
    `${colors.gray(contractName)}\n` +
    `${colors.white(address)}\n` +
    `${colorizeFunction(`${balance} ● ${type}`)}`
  )
}

/**
 * Return balance in human-readable format
 * @param balance
 * @example
 *   prettifyBalance(1234567890123456789n)
 * @return
 *   '1,234,567,890.123,456,789'
*/
function prettifyBalance (balance: bigint): string {
  const integerPartOfNumber = balance / B
  const integerPartOfNumberText = integerPartOfNumber.toLocaleString()
  const fractionalPartOfNumber = balance % B + B
  const fractionalPartOfNumberText = fractionalPartOfNumber.toLocaleString(
    'en',
    { maximumFractionDigits: 10 }
  ).substring(2)
  const text = `${integerPartOfNumberText}${colors.cyan('.')}${fractionalPartOfNumberText}`
  return text.replaceAll(',', colors.gray(','))
}

/**
 * Print message between two empty lines
 */
export async function printMessage (message: string): Promise<void> {
  console.log()
  console.log(`${message}  ...`)
  console.log()
}

/**
 * Print empty line
 */
export async function printEmptyLine (): Promise<void> {
  console.log()
}

/**
 * Print error
 */
export async function printError (e: any): Promise<void> {
  console.error(e)
}
