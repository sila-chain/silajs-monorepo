import { createCommonFromGethGenesis } from '@silajs/common'
import { bytesToHex, hexToBytes, privateToAddress } from '@silajs/util'
import { Client } from 'jayson/promise/index.js'
import { assert, describe, it } from 'vitest'

import {
  filterKeywords,
  filterOutWords,
  runTxHelper,
  startNetwork,
  validateBlockHashesInclusionInBeacon,
  waitForELStart,
} from './simutils.ts'

import type { PrefixedHexString } from '@silajs/util'

const pkey = hexToBytes('0xae557af4ceefda559c924516cabf029bedc36b68109bf8d6183fe96e04121f4e')
const sender = bytesToHex(privateToAddress(pkey))
const client = Client.http({ port: 8545 })

const network = 'sila-mainnet'
const eofJSON = require(`./configs/${network}.json`)
const common = createCommonFromGethGenesis(eofJSON, { chain: network })

export async function runTx(data: PrefixedHexString | '', to?: PrefixedHexString, value?: bigint) {
  return runTxHelper({ client, common, sender, pkey }, data, to, value)
}

describe('simple sila-mainnet test run', async () => {
  if (process.env.EXTRA_CL_PARAMS === undefined) {
    process.env.EXTRA_CL_PARAMS = '--params.CAPELLA_FORK_EPOCH 0'
  }
  const { teardownCallBack, result } = await startNetwork(network, client, {
    filterKeywords,
    filterOutWords,
    externalRun: process.env.EXTERNAL_RUN,
  })

  if (result.includes('SilaJS') === true) {
    assert.isTrue(true, 'connected to client')
  } else {
    assert.fail('connected to wrong client')
  }

  console.log(`Waiting for network to start...`)
  try {
    await waitForELStart(client)
    assert.isTrue(true, 'silajs<>lodestar started successfully')
  } catch (e) {
    assert.fail('silajs<>lodestar failed to start')
    throw e
  }

  const blockHashes: string[] = []
  // ------------Sanity checks--------------------------------
  it(
    'Simple transfer - sanity check',
    async () => {
      await runTx('', '0x3dA33B9A0894b908DdBb00d96399e506515A1009', 1000000n)
      let balance = await client.request('eth_getBalance', [
        '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
        'latest',
      ])
      assert.strictEqual(BigInt(balance.result), 1000000n, 'sent a simple SIL transfer')
      await runTx('', '0x3dA33B9A0894b908DdBb00d96399e506515A1009', 1000000n)
      balance = await client.request('eth_getBalance', [
        '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
        'latest',
      ])
      balance = await client.request('eth_getBalance', [
        '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
        'latest',
      ])
      assert.strictEqual(BigInt(balance.result), 2000000n, 'sent a simple SIL transfer 2x')
      const latestBlock = await client.request('eth_getBlockByNumber', ['latest', false])
      blockHashes.push(latestBlock.result.hash)
    },
    2 * 60_000,
  )

  it('Validate execution hashes present in beacon headers', async () => {
    const eth2res = await (await fetch('http://127.0.0.1:9596/sil/v1/beacon/headers')).json()
    await validateBlockHashesInclusionInBeacon(
      'http://127.0.0.1:9596',
      1,
      parseInt(eth2res.data[0].header.message.slot),
      blockHashes,
    )
  }, 60_000)

  it('should reset td', async () => {
    try {
      await teardownCallBack()
      assert.isTrue(true, 'network cleaned')
    } catch {
      assert.fail('network not cleaned properly')
    }
  }, 60_000)
})
