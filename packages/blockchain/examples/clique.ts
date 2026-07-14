import { CliqueConsensus, createBlockchain } from '@silajs/blockchain'
import { Common, ConsensusAlgorithm, Hardfork } from '@silajs/common'
import { goerliChainConfig } from '@silajs/testdata'

import type { ConsensusDict } from '@silajs/blockchain'

const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.London })

const consensusDict: ConsensusDict = {}
consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
const blockchain = await createBlockchain({
  consensusDict,
  common,
})
console.log(`Created blockchain with ${blockchain.consensus!.algorithm} consensus algorithm`)
