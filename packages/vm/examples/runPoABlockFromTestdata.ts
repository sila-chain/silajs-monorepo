/**
 * Offline PoA block replay from bundled @silajs/testdata fixtures.
 *
 * Does not connect to any network. Uses the Goerli chain config and a pre-built
 * block only as convenient PoA/Clique test vectors (the Goerli testnet itself is deprecated).
 */
import { createBlock } from '@silajs/block'
import { Common } from '@silajs/common'
import { goerliBlocks, goerliChainConfig } from '@silajs/testdata'
import { bytesToHex } from '@silajs/util'
import { createVM, runBlock } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: goerliChainConfig, hardfork: 'london' })
  const vm = await createVM({ common })

  const block = createBlock(goerliBlocks[0], { common })
  const result = await runBlock(vm, { block, generate: true, skipHeaderValidation: true }) // we skip header validation since we are running a block without the full Sila history available
  console.log(`The state root for the block is ${bytesToHex(result.stateRoot)}`)
}

void main()
