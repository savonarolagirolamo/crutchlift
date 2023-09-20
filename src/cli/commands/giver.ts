import { type SendOptions } from '../actions/giver/validate'

export const GIVER_SEND_FLAGS = {
  to: '-t, --to <to>',
  value: '-v, --value <value>'
}

export function validateGiverSendOptions (options: {
  to?: string
  value?: string
}): {
    value: SendOptions
    error?: Error
  } | {
    value?: SendOptions
    error: Error
  } {
  if (options.to === undefined)
    return { error: error(GIVER_SEND_FLAGS.to) }
  else if (options.value === undefined)
    return { error: error(GIVER_SEND_FLAGS.to) }
  return { value: options as SendOptions }
}

function error (flag: string): Error {
  return new Error(`Required option ${flag} not specified`)
}
