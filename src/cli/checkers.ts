import { GIVER, GIVER_ACTIONS, SE } from './commands'

const LENGTH: number = process.argv.length
const COMMAND: string | undefined = LENGTH === 3 ? process.argv[2] : undefined
const ACTION: string | undefined = LENGTH === 4 ? process.argv[3] : undefined

export const isNoCommands: boolean = LENGTH === 2
export const isGiverCommand: boolean = COMMAND === GIVER
export const isGiverSendCommand: boolean = ACTION === GIVER_ACTIONS.SEND
export const isSECommand: boolean = COMMAND === SE
