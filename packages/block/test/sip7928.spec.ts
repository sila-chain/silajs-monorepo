import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { randomBytes } from '@silajs/util'
import { assert, describe, it } from 'vitest'
import { createBlock } from '../src/index.ts'

const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })

describe('SIP7928 tests', () => {
  it('should accept and correctly assign new blockAccessListHash field (main constructor)', () => {
    const blockAccessListHash = randomBytes(32)
    const block = createBlock(
      {
        header: {
          blockAccessListHash,
        },
      },
      { common },
    )
    assert.deepEqual(block.header.blockAccessListHash, blockAccessListHash)
  })
})
