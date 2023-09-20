import transferAbi from './transfer.abi.json'
import { type AbiContract, type TonClient } from '@eversdk/core'
import { Global } from '../../global'
import { stringToHex } from '../../utils/hex'
import { error } from '../constants'

/**
 * Generate payload for transfer coins with comment
 * @example
 *   getTransferPayload('for homeless')
 */
export async function createTransferPayload (comment: string = '', client?: TonClient): Promise<string> {
  const cl = client ?? Global.client
  if (cl === undefined)
    throw error.noClient

  return await createPayload(transferAbi, 'transfer', { comment: stringToHex(comment) }, cl)
}

/**
 * Create payload to call another contract
 * @example
 *   getPayload({'ABI version': 2, '...'}, 'bet', {luckyNumber: 50})
 */
export async function createPayload (
  abi: AbiContract,
  method: string,
  input: any = {},
  client?: TonClient
): Promise<string> {
  const cl = client ?? Global.client
  if (cl === undefined)
    throw error.noClient

  return (await cl.abi.encode_message_body({
    abi: {
      type: 'Contract',
      value: abi
    },
    signer: {
      type: 'None'
    },
    call_set: {
      function_name: method,
      input
    },
    is_internal: true
  })).body
}
