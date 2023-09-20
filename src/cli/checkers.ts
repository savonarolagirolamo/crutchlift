import { GIVER, GIVER_ACTIONS, SE } from './commands'
import { type NetworkConfig } from './config/types'

const LENGTH: number = process.argv.length
const COMMAND: string = process.argv[2]
export const FIRST_ARGUMENT: string = process.argv[3]
const SECOND_ARGUMENT: string = process.argv[4]

export function isNoCommands (): boolean {
  return LENGTH === 2
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
