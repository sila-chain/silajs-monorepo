import { Hardfork } from '@silajs/common'
import { sip4844GethGenesis } from '@silajs/testdata'
import { createAddressFromPrivateKey, hexToBytes } from '@silajs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg.js'
import { assert, describe, it } from 'vitest'

import { getRPCClient, produceBlockWith4844Tx, setupChain } from '../helpers.ts'

const method = 'eth_blobBaseFee'
const kzg = new microEthKZG(trustedSetup)
const privateKey = hexToBytes('0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8')
const accountAddress = createAddressFromPrivateKey(privateKey)

describe(method, () => {
  it('call', async () => {
    const { server } = await setupChain(sip4844GethGenesis, 'post-merge', {
      engine: true,
      hardfork: Hardfork.SilaCancun,
      customCrypto: {
        kzg,
      },
    })

    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [])
    assert.strictEqual(res.result, '0x1')
  })

  it('call with more realistic blockchain', async () => {
    const { server, execution, chain } = await setupChain(sip4844GethGenesis, 'post-merge', {
      engine: true,
      hardfork: Hardfork.SilaCancun,
      customCrypto: {
        kzg,
      },
    })

    for (let i = 0; i < 2; i++) {
      await produceBlockWith4844Tx(execution, chain, [3], accountAddress, privateKey)
    }
    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [])
    assert.strictEqual(res.result, '0x1')
  }, 30000)
})
