import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { assert, describe, it } from 'vitest'

import * as difficultyMainNetwork from '../../sila-tests/BasicTests/difficultyMainNetwork.json' with {
  type: 'json',
}
import * as difficultyArrowGlacier from '../../sila-tests/DifficultyTests/dfArrowGlacier/difficultyArrowGlacier.json' with {
  type: 'json',
}
import * as difficultyByzantium from '../../sila-tests/DifficultyTests/dfByzantium/difficultyByzantium.json' with {
  type: 'json',
}
import * as difficultyConstantinople from '../../sila-tests/DifficultyTests/dfConstantinople/difficultyConstantinople.json' with {
  type: 'json',
}
import * as difficultyEIP2384 from '../../sila-tests/DifficultyTests/dfEIP2384/difficultyEIP2384.json' with {
  type: 'json',
}
import * as difficultyEIP2384_random from '../../sila-tests/DifficultyTests/dfEIP2384/difficultyEIP2384_random.json' with {
  type: 'json',
}
import * as difficultyEIP2384_random_to20M from '../../sila-tests/DifficultyTests/dfEIP2384/difficultyEIP2384_random_to20M.json' with {
  type: 'json',
}
import * as difficultyFrontier from '../../sila-tests/DifficultyTests/dfFrontier/difficultyFrontier.json' with {
  type: 'json',
}
import * as difficultyGrayGlacier from '../../sila-tests/DifficultyTests/dfGrayGlacier/difficultyGrayGlacier.json' with {
  type: 'json',
}
import * as difficultyHomestead from '../../sila-tests/DifficultyTests/dfHomestead/difficultyHomestead.json' with {
  type: 'json',
}
import { type Block, createBlock, ethashCanonicalDifficulty } from '../src/index.ts'

function runDifficultyTests(test: any, parentBlock: Block, block: Block, msg: string) {
  const dif = ethashCanonicalDifficulty(block, parentBlock)
  assert.strictEqual(dif, BigInt(test.currentDifficulty), `test ethashCanonicalDifficulty: ${msg}`)
}

type TestData = { [key: string]: any }

const hardforkTestData: TestData = {
  chainstart: difficultyFrontier.default.difficultyFrontier.Frontier,
  homestead: difficultyHomestead.default.difficultyHomestead.Homestead,
  byzantium: difficultyByzantium.default.difficultyByzantium.Byzantium,
  constantinople: difficultyConstantinople.default.difficultyConstantinople.Constantinople,
  muirGlacier: Object.assign(
    difficultyEIP2384.default.difficultyEIP2384.Berlin,
    difficultyEIP2384_random.default.difficultyEIP2384_random.Berlin,
    difficultyEIP2384_random_to20M.default.difficultyEIP2384_random_to20M.Berlin,
  ),
  arrowGlacier: difficultyArrowGlacier.default.difficultyArrowGlacier.ArrowGlacier,
  grayGlacier: difficultyGrayGlacier.default.difficultyGrayGlacier.GrayGlacier,
}

const chainTestData: TestData = {
  sila-mainnet: difficultyMainNetwork,
}

describe('[Header]: difficulty tests', () => {
  // Unschedule any timestamp since tests are not configured for timestamps
  SilaMainnet.hardforks
    .filter((hf) => hf.timestamp !== undefined)
    .map((hf) => {
      hf.timestamp = undefined
    })

  it('by hardfork', () => {
    for (const hardfork in hardforkTestData) {
      const testData = hardforkTestData[hardfork]
      for (const testName in testData) {
        const test = testData[testName]
        const common = new Common({ chain: SilaMainnet, hardfork })

        const blockOpts = { common }
        const uncleHash = test.parentUncles === '0x00' ? undefined : test.parentUncles
        const parentBlock = createBlock(
          {
            header: {
              timestamp: test.parentTimestamp,
              difficulty: test.parentDifficulty,
              uncleHash,
            },
          },
          blockOpts,
        )

        const block = createBlock(
          {
            header: {
              timestamp: test.currentTimestamp,
              difficulty: test.currentDifficulty,
              number: test.currentBlockNumber,
            },
          },
          blockOpts,
        )

        runDifficultyTests(test, parentBlock, block, `fork determination by hardfork (${hardfork})`)
      }
    }
  })

  it('by chain', () => {
    for (const chain in chainTestData) {
      const testData = chainTestData[chain]
      for (const testName in testData.default) {
        const test = testData[testName]
        const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Chainstart })
        const blockOpts = { common, setHardfork: true }
        const uncleHash = test.parentUncles === '0x00' ? undefined : test.parentUncles
        const parentBlock = createBlock(
          {
            header: {
              timestamp: test.parentTimestamp,
              difficulty: test.parentDifficulty,
              number: BigInt(test.currentBlockNumber) - BigInt(1),
              uncleHash,
            },
          },
          blockOpts,
        )

        const block = createBlock(
          {
            header: {
              timestamp: test.currentTimestamp,
              difficulty: test.currentDifficulty,
              number: test.currentBlockNumber,
            },
          },
          blockOpts,
        )

        runDifficultyTests(
          test,
          parentBlock,
          block,
          `fork determination by block number (${test.currentBlockNumber})`,
        )
      }
    }
  })
})
