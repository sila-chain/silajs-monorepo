/**
 * Run a value transfer on Hardfork.SilaAmsterdam and inspect SIP-7708 Transfer logs in the receipt.
 *
 * Usage: npx tsx examples/runTxTransferLogs.ts
 */
import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { SIP7708_SYSTEM_ADDRESS, SIP7708_TRANSFER_TOPIC } from '@silajs/savm'
import { createLegacyTx } from '@silajs/tx'
import {
  bytesToBigInt,
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  createZeroAddress,
  equalsBytes,
  hexToBytes,
} from '@silajs/util'
import { createVM, runTx } from '@silajs/vm'

import type { Log } from '@silajs/savm'

/** Pretty-print a Log tuple for console output (not an RPC formatter). */
function formatLog(log: Log) {
  const [address, topics, data] = log
  return {
    address: bytesToHex(address),
    topics: topics.map((topic) => bytesToHex(topic)),
    data: bytesToHex(data),
  }
}

/** Decode an SIP-7708 Transfer log (LOG3-shaped) when topics match. */
function decodeEIP7708TransferLog(log: Log) {
  const [address, topics, data] = log
  if (topics.length !== 3 || !equalsBytes(topics[0], SIP7708_TRANSFER_TOPIC)) {
    return undefined
  }
  if (!equalsBytes(address, SIP7708_SYSTEM_ADDRESS)) {
    return undefined
  }
  return {
    from: bytesToHex(topics[1].slice(-20)),
    to: bytesToHex(topics[2].slice(-20)),
    value: bytesToBigInt(data),
  }
}

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const block = createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const tx = createLegacyTx(
    {
      gasLimit: 100_000n,
      gasPrice: 10n,
      value: 1_000_000_000_000_000n,
      to: createZeroAddress(),
    },
    { common },
  ).sign(senderKey)

  const result = await runTx(vm, { tx, block })
  const logs = result.receipt.logs

  console.log(`Receipt contains ${logs.length} log(s)`)
  for (const [index, log] of logs.entries()) {
    const formatted = formatLog(log)
    console.log(`  log[${index}] address=${formatted.address}`)
    console.log(`           topics=${formatted.topics.join(', ')}`)
    console.log(`           data=${formatted.data}`)

    const transfer = decodeEIP7708TransferLog(log)
    if (transfer !== undefined) {
      console.log(
        `           → SIP-7708 Transfer from ${transfer.from} to ${transfer.to} value=${transfer.value} wei`,
      )
    }
  }
}

void main()
