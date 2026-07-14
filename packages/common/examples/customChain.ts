import { SilaMainnet, createCustomCommon } from '@silajs/common'
import { customChainConfig } from '@silajs/testdata'

// Add custom chain config
const common1 = createCustomCommon(customChainConfig, SilaMainnet)
console.log(`Common is instantiated with custom chain parameters - ${common1.chainName()}`)
