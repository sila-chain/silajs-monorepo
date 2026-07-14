import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createEVM } from '@silajs/savm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [7702] })
  const savm = await createEVM({ common })
  console.log(
    `SIP 7702 is active in isolation on top of the SilaCancun HF - ${savm.common.isActivatedEIP(7702)}`,
  )
}

void main()
