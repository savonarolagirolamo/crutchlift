import { type GiverSendOptions } from '../actions/giver'

export const GIVER_SEND_FLAGS = {
  to: '-t, --to <to>',
  value: '-v, --value <value>'
}

type GiverSendCommandLineOptions = {
  to?: string
  value?: string
}

export type GiverSendOptionsValidationResult = {
  value: GiverSendOptions
  error?: Error
} | {
  value?: GiverSendOptions
  error: Error
}

export function validateGiverSendOptions (options: GiverSendCommandLineOptions): GiverSendOptionsValidationResult {
  if (options.to === undefined)
    return { error: error(GIVER_SEND_FLAGS.to) }
  else if (options.value === undefined)
    return { error: error(GIVER_SEND_FLAGS.to) }
  return { value: options as GiverSendOptions }
}

function error (flag: string): Error {
  return new Error(`Required option ${flag} not specified`)
}
