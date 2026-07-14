import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { KECCAK256_RLP } from '@silajs/util'
import { assert, describe, it } from 'vitest'

import type { MerkleStateManager } from '@silajs/statemanager'
import { createVM } from '../../../src/index.ts'

describe('General MuirGlacier VM tests', () => {
  it('should accept muirGlacier hardfork option for supported chains', async () => {
    const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.MuirGlacier })
    const vm = await createVM({ common })
    assert.isDefined(vm.stateManager)
    assert.deepEqual(
      (vm.stateManager as MerkleStateManager)['_trie'].root(),
      KECCAK256_RLP,
      'it has default trie',
    )
  })
})
