export const GIVER = {
  se: {
    v2: 'v2.se',
    v3: 'v3.se',
    safeMultiSigWallet: 'safeMultiSigWallet.se'
  },
  v2: 'v2',
  v3: 'v3',
  safeMultiSigWallet: 'safeMultiSigWallet'
}

const SE_GIVERS = [GIVER.se.v2, GIVER.se.v3, GIVER.se.safeMultiSigWallet] as const
const GIVERS = [GIVER.v2, GIVER.v3, GIVER.safeMultiSigWallet] as const

export type SEGiverLabel = typeof SE_GIVERS[number]
export type GiverLabels = typeof GIVERS[number]

export { SE_GIVERS }
export { GIVERS }
