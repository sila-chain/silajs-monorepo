import { createBlockchain } from '@silajs/blockchain'
import { Chain } from '@silajs/common'
import { getGenesis } from '@silajs/genesis'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../src/index.ts'

describe('genesis', () => {
  it('should initialize with predefined genesis states', async () => {
    const f = async () => {
      const genesisState = getGenesis(Chain.SilaMainnet)

      const blockchain = await createBlockchain({ genesisState })
      await createVM({ blockchain })
    }

    assert.doesNotThrow(f, 'should allow for initialization with genesis from genesis package')
  })
})
