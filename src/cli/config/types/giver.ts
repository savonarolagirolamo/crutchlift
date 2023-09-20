export const GIVER = {
  se: 'se',
  v2: 'GiverV2',
  v3: 'GiverV3',
  safeMultiSig: 'SafeMultiSig'
}

const GIVERS = [GIVER.se, GIVER.v3] as const
export type Giver = typeof GIVERS[number]
export { GIVERS }
