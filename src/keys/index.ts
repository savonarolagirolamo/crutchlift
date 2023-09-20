import fs from 'fs-extra'
import path from 'path'
import { Global } from '../global'
import { error } from '../contract/constants'
import { type KeyPair, type TonClient } from '@eversdk/core'
import { generateRandomKeyPair } from '../utils/generateRandomKeyPair'

/**
 * Read key pair from JSON file
 * @param file Absolute path to file
 * @example
 *   readKeys('/home/user/keys/GiverV2.keys.json')
 * @return
 *   {
 *     public: '61d08f0f1aa152095b6b2e19f31bf09d84a5ae6037be9247d0e54a3926d46593',
 *     secret: '2c7645b1201c0dd84dd38c3fe0e3a70e7de0d4ef77333f33a916280d9994205c'
 *   }
 */
export function readKeys (file: string): KeyPair {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }))
  } catch (e: any & { toString: any }) {
    const exceptionMessage = e.toString() as string
    throw new Error(`Can't read key pair from "${file}"\n${exceptionMessage}`)
  }
}

/**
 * Generate random key pair if key file does not exist
 * If file exists calls readKeys()
 * @param file Absolute path to file
 * @param client SDK client
 * @example
 *   createOrReadKeys('/home/user/keys/GiverV2.keys.json')
 * @return
 *   {
 *     public: '61d08f0f1aa152095b6b2e19f31bf09d84a5ae6037be9247d0e54a3926d46593',
 *     secret: '2c7645b1201c0dd84dd38c3fe0e3a70e7de0d4ef77333f33a916280d9994205c'
 *   }
 */
export async function generateOrReadKeys (file: string, client?: TonClient): Promise<KeyPair> {
  const cl = client ?? Global.client
  if (cl === undefined)
    throw error.noClient

  if (fs.existsSync(file))
    return readKeys(file)

  const keys = await generateRandomKeyPair(cl)
  const directory = path.dirname(file)
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(keys, null, 2))
  return keys
}

/**
 * Generate JSON file with random key pair in keys directory if key file does not exist
 * @param name File name without extension e.g. `wallet`
 * @param directory Keys relative path e.g. `./keys`
 * @param client SDK client
 * @example
 *   namedKeys('root')
 * @return
 *   {
 *     public: '61d08f0f1aa152095b6b2e19f31bf09d84a5ae6037be9247d0e54a3926d46593',
 *     secret: '2c7645b1201c0dd84dd38c3fe0e3a70e7de0d4ef77333f33a916280d9994205c'
 *   }
 */
export async function namedKeys (name: string, directory?: string, client?: TonClient): Promise<KeyPair> {
  const dir = directory ?? Global.config?.paths.keys
  if (dir === undefined)
    throw new Error('Keys directory is undefined')

  const file = path.resolve(process.cwd(), dir, `${name}.json`)
  return await generateOrReadKeys(file, client)
}
