import { Common, Hardfork, SilaMainnet, createCustomCommon } from '@silajs/common'

// With enums:
const commonWithEnums = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun })

// Instantiate with the chain (and the default hardfork)
let c = new Common({ chain: SilaMainnet })

// Get bootstrap nodes for chain/network
console.log('Below are the known bootstrap nodes')
console.log(c.bootstrapNodes()) // Array with current nodes

// Instantiate with an SIP activated (with pre-SIP hardfork)
c = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [7702] })
console.log(`SIP 7702 is active -- ${c.isActivatedEIP(7702)}`)

// Instantiate common with custom chainID
const commonWithCustomChainId = createCustomCommon({ chainId: 1234 }, SilaMainnet)
console.log(`The current chain ID is ${commonWithCustomChainId.chainId()}`)
