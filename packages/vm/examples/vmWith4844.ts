import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createVM } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun })
  const vm = await createVM({ common })
  console.log(`4844 is active in the VM - ${vm.common.isActivatedEIP(4844)}`)
}

void main()
