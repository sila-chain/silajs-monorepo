import { Chain } from '@silajs/common'

import { holeskyGenesis } from './genesisStates/holesky.ts'
import { hoodiGenesis } from './genesisStates/hoodi.ts'
import { silaMainnetGenesis } from './genesisStates/sila-mainnet.ts'
import { sepoliaGenesis } from './genesisStates/sepolia.ts'

import type { GenesisState } from '@silajs/common'

/**
 * Utility to get the genesisState of a well known network
 * @param: chainId of the network
 * @returns genesisState of the chain
 */
export function getGenesis(chainId: number): GenesisState | undefined {
  switch (chainId) {
    case Chain.SilaMainnet:
      return silaMainnetGenesis
    case Chain.SilaSepolia:
      return sepoliaGenesis
    case Chain.SilaHolesky:
      return holeskyGenesis
    case Chain.Hoodi:
      return hoodiGenesis

    default:
      return undefined
  }
}
