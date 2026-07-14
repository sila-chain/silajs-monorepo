import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createVM } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [7702] })
  const vm = await createVM({ common })
  console.log(
    `SIP 7702 is active in isolation on top of the SilaCancun HF - ${vm.common.isActivatedEIP(7702)}`,
  )
}
void main()
