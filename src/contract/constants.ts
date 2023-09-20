import { x0 } from '../utils/hex'

export const noClientError = new Error('SDK client is undefined')
export const noKeysError = new Error('Contract key pair is undefined')

const ZERO256 = '0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO = {
  keys: {
    public: ZERO256,
    secret: ZERO256
  },
  address: `0:${ZERO256}`,
  uint256: x0(ZERO256)
}
