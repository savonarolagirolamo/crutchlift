import { x0 } from '../utils/hex'

export const error = {
  noClient: new Error('SDK client is undefined'),
  noTvc: new Error('Contract tvc is undefined'),
  noGiver: new Error('Contract giver is undefined'),
  contractAlreadyDeployed: new Error('Contract already deployed')
}
export const ZERO256 = '0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO_ADDRESS = `0:${ZERO256}`
export const ZERO_UINT256 = x0(ZERO256)
