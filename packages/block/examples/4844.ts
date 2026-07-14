import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createBlob4844Tx } from '@silajs/tx'
import { createAddressFromPrivateKey } from '@silajs/util'
import { randomBytes } from '@noble/hashes/utils.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)

  const common = new Common({
    chain: SilaMainnet,
    customCrypto: {
      kzg,
    },
    hardfork: Hardfork.SilaCancun,
  })
  const blobTx = createBlob4844Tx(
    { blobsData: ['myFirstBlob'], to: createAddressFromPrivateKey(randomBytes(32)) },
    { common },
  )

  const block = createBlock(
    {
      header: {
        excessBlobGas: 0n,
      },
      transactions: [blobTx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
    },
  )

  console.log(
    `4844 block header with excessBlobGas=${block.header.excessBlobGas} created and ${
      block.transactions.filter((tx) => tx.type === 3).length
    } blob transactions`,
  )
}

void main()
