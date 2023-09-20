import { GIVER, GIVER_ACTIONS, SE, TEST } from './commands'
import { type NetworkConfig } from './config/types'

const LENGTH = process.argv.length
const COMMAND = process.argv[2]
export const FIRST_ARGUMENT = process.argv[3]
const SECOND_ARGUMENT = process.argv[4]

export function isNoCommands (): boolean {
  return LENGTH === 2
}

export function isTestCommand (): boolean {
  return LENGTH === 3 && COMMAND === TEST
}

export function isGiverCommand (): boolean {
  return LENGTH === 3 && COMMAND === GIVER
}

export function isGiverNetworkCommand (config: Record<string, NetworkConfig>): boolean {
  return LENGTH === 4 && COMMAND === GIVER && config[FIRST_ARGUMENT] !== undefined
}

export function isGiverNetworkSendCommand (config: Record<string, NetworkConfig>): boolean {
  return LENGTH === 5 &&
    COMMAND === GIVER &&
    config[FIRST_ARGUMENT] !== undefined &&
    SECOND_ARGUMENT === GIVER_ACTIONS.SEND
}

export function isSECommand (): boolean {
  return LENGTH === 3 && COMMAND === SE
}
