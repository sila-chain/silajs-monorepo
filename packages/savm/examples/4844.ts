import { Common, Hardfork, SilaMainnet } from '@silajs/common'

const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun })

console.log('is SIP-4844 active?', common.isActivatedEIP(4844))
