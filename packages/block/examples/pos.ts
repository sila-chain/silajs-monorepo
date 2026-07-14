import { createBlock } from '@silajs/block'
import { Common, SilaMainnet } from '@silajs/common'

const common = new Common({ chain: SilaMainnet })

const block = createBlock(
  {
    // Provide your block data here or use default values
  },
  { common },
)

console.log(`Proof-of-Stake (default) block created with hardfork=${block.common.hardfork()}`)
