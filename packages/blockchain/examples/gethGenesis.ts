import { createBlockchain } from '@silajs/blockchain'
import { createCommonFromGethGenesis, parseGethGenesisState } from '@silajs/common'
import { postMergeGethGenesis } from '@silajs/testdata'
import { bytesToHex } from '@silajs/util'

const main = async () => {
  // Load geth genesis file
  const common = createCommonFromGethGenesis(postMergeGethGenesis, { chain: 'customChain' })
  const genesisState = parseGethGenesisState(postMergeGethGenesis)
  const blockchain = await createBlockchain({
    genesisState,
    common,
  })
  const genesisBlockHash = blockchain.genesisBlock.hash()
  common.setForkHashes(genesisBlockHash)
  console.log(
    `Genesis hash from geth genesis parameters - ${bytesToHex(blockchain.genesisBlock.hash())}`,
  )
}

void main()
