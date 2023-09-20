import { Global } from '../global'
import { error } from '../contract/constants'
import { type KeyPair, type TonClient } from '@eversdk/core'

/**
 * Wrapper for crypto.generate_random_sign_keys()
 * @example
 *   await createRandomKeyPair()
 * @return
 *   {
 *     public: '61d08f0f1aa152095b6b2e19f31bf09d84a5ae6037be9247d0e54a3926d46593',
 *     secret: '2c7645b1201c0dd84dd38c3fe0e3a70e7de0d4ef77333f33a916280d9994205c'
 *   }
 */
export async function generateRandomKeyPair (client?: TonClient): Promise<KeyPair> {
  const cl = client ?? Global.client
  if (cl === undefined)
    throw error.noClient

  return await cl.crypto.generate_random_sign_keys()
}
