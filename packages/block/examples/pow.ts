import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'

const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'pow'
console.log(common.consensusAlgorithm()) // 'ethash'

createBlock({}, { common })
console.log(`Old Proof-of-Work block created`)
