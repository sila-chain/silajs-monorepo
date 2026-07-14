import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createLegacyTx } from '@silajs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@silajs/util'
import { createVM, runBlock } from '@silajs/vm'

import type { AfterBlockEvent } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))

  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 10n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const block = createBlock(
    {
      header: { number: 2n, gasLimit: 30_000_000n, baseFeePerGas: 1n },
      transactions: [tx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
      calcDifficultyFromHeader: parentBlock.header,
    },
  )

  let afterBlock: AfterBlockEvent | undefined
  vm.events.once('afterBlock', (event) => {
    afterBlock = event
  })

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipBlockValidation: true,
  })

  const bal = result.blockLevelAccessList!
  console.log(`BAL accounts: ${bal.toJSON().length}`)
  console.log(`blockAccessListHash: ${bytesToHex(afterBlock!.block.header.blockAccessListHash!)}`)
  console.log(`hash matches result: ${bytesToHex(bal.hash())}`)
}

void main()
