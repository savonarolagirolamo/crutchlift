import { x0 } from '../utils/hex'

export const error = {
  noKeys: new Error('Contract key pair is undefined'),
  noClient: new Error('SDK client is undefined'),
  noTvc: new Error('Contract tvc is undefined'),
  noGiver: new Error('Contract giver is undefined'),
  contractAlreadyDeployed: new Error('Contract already deployed')
}
export const noKeysError = new Error('Contract key pair is undefined')
export const noTvcError = new Error('Contract tvc is undefined')
export const noGiverError = new Error('Contract giver is undefined')
export const contractAlreadyDeployedError = new Error('Contract already deployed')

const ZERO256 = '0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO = {
  keys: {
    public: ZERO256,
    secret: ZERO256
  },
  address: `0:${ZERO256}`,
  uint256: x0(ZERO256)
}
