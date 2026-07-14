import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createEOACode7702Tx } from '@silajs/tx'
import { type PrefixedHexString, createAddressFromPrivateKey, randomBytes } from '@silajs/util'

const ones32 = `0x${'01'.repeat(32)}` as PrefixedHexString

const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [7702] })
const tx = createEOACode7702Tx(
  {
    authorizationList: [
      {
        chainId: '0x2',
        address: `0x${'20'.repeat(20)}`,
        nonce: '0x1',
        yParity: '0x1',
        r: ones32,
        s: ones32,
      },
    ],
    to: createAddressFromPrivateKey(randomBytes(32)),
  },
  { common },
)

console.log(
  `SIP-7702 EOA code tx created with ${tx.authorizationList.length} authorization list item(s).`,
)
