import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createLegacyTx } from '@silajs/tx'
import {
  createAccount,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@silajs/util'
import { createVM, runTx } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaShanghai })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 1_000_000_000n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const res = await runTx(vm, { tx })
  console.log(res.totalGasSpent) // 21000n - gas cost for simple SIL transfer
}

void main()
