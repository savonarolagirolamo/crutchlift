import { type VascooConfig } from '../config/types'
import { type TonClient } from '@eversdk/core'
import { type Giver } from '../../giver'
import { GIVER } from '../config/types/giverLabels'
import { GiverV2 } from '../../giver/samples/GiverV2'
import giverSEKeys from './keys/giver.se.keys.json'
import { GiverV3 } from '../../giver/samples/GiverV3'
import { SafeMultisigWalletGiver } from '../../giver/samples/SafeMultisigWalletGiver'
import safeMultisigWalletSEKeys from './keys/safeMultisigWallet.se.keys.json'
import { createOrReadGlobalGiverKeys } from './createOrReadGlobalGiverKeys'

export async function createGlobalGiver (config: VascooConfig, network: string, client: TonClient): Promise<Giver> {
  const giver = config.networks[network].giver

  ////////
  // SE //
  ////////
  if (giver === GIVER.se.v2)
    return new GiverV2(giverSEKeys, { client })
  if (giver === GIVER.se.v3)
    return new GiverV3(giverSEKeys, { client })
  if (giver === GIVER.se.safeMultiSigWallet)
    return new SafeMultisigWalletGiver(safeMultisigWalletSEKeys, { client })

  ////////////
  // Not SE //
  ////////////
  const keys = await createOrReadGlobalGiverKeys(config, network, client)
  if (giver === GIVER.v2)
    return new GiverV2(keys, { client })
  if (giver === GIVER.v3)
    return new GiverV3(keys, { client })
  if (giver === GIVER.safeMultiSigWallet)
    return new SafeMultisigWalletGiver(keys, { client })

  /////////////
  // Unknown //
  /////////////
  throw new Error(`Giver "${giver}" is unknown`)
}
