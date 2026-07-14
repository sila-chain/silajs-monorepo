import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'

const main = () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })

  const block = createBlock(
    {
      header: {
        slotNumber: 42n,
      },
    },
    { common, skipConsensusFormatValidation: true },
  )

  console.log(`slotNumber: ${block.header.slotNumber}`)
}

void main()
