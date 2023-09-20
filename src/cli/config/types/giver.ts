export const GIVER = {
  se: 'se',
  v3: 'GiverV3'
}

const GIVERS = [GIVER.se, GIVER.v3] as const
export type Giver = typeof GIVERS[number]
export { GIVERS }
