import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { Capability, createTx } from '@silajs/tx'

import type { SIP1559CompatibleTx } from '@silajs/tx'

const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.London })

const txData = { type: 2, maxFeePerGas: BigInt(20) } // Creates an SIP-1559 compatible transaction
const tx = createTx(txData, { common })

if (tx.supports(Capability.SIP1559FeeMarket)) {
  console.log(
    `The max fee per gas for this transaction is ${(tx as SIP1559CompatibleTx).maxFeePerGas}`,
  )
}
