import { Common, SilaMainnet } from '@silajs/common'
import { SimpleStateManager } from '@silajs/statemanager'

import { SAVM } from './index.ts'
import { NobleBN254 } from './precompiles/index.ts'
import { EVMMockBlockchain } from './types.ts'

import type { EVMOpts } from './index.ts'

/**
 * Use this async static constructor for the initialization
 * of an SAVM object
 *
 * @param createOpts The SAVM options
 * @returns A new SAVM
 */
export async function createEVM(createOpts?: EVMOpts) {
  const opts = createOpts ?? ({} as EVMOpts)

  opts.bn254 = new NobleBN254()

  if (opts.common === undefined) {
    opts.common = new Common({ chain: SilaMainnet })
  }

  if (opts.blockchain === undefined) {
    opts.blockchain = new EVMMockBlockchain()
  }

  if (opts.stateManager === undefined) {
    // Intentionally the only runtime import from @silajs/statemanager in
    // this package (sane zero-config default); all other state manager usage
    // must go through the interfaces in @silajs/common.
    opts.stateManager = new SimpleStateManager()
  }

  return new SAVM(opts)
}
