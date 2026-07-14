/**
 * This file is deprecated (helper for old test runner).
 *
 * The new runners in executionSpec*.test.ts will become the main
 * entry point for test running.
 *
 * If you discover functionality here which is still missing in the new runner,
 * please open a PR against executionSpecState.test.ts.
 *
 * PLEASE DO NOT COPY LARGER PARTS OF THE CODE TO THE NEW RUNNER BUT RE-IMPLEMENT
 * (USE COMMON SENSE).
 */
import * as path from 'path'
import { Common, Hardfork, SilaMainnet, createCustomCommon } from '@silajs/common'

import type { HardforkTransitionConfig } from '@silajs/common'
import type { KZG } from '@silajs/util'

/**
 * Default tests path (git submodule: sila-tests)
 */
export const DEFAULT_TESTS_PATH = path.resolve('../sila-tests')

/**
 * Default hardfork rules to run tests against
 */
export const DEFAULT_FORK_CONFIG = 'SilaParis'

/**
 * Tests which should be fixed
 */
export const SKIP_BROKEN = [
  'ForkStressTest', // Only BlockchainTest, temporary till fixed (2020-05-23)
  'ChainAtoChainB', // Only BlockchainTest, temporary, along expectException fixes (2020-05-23)

  // In these tests, we have access to two forked chains. Their total difficulty is equal. There are errors in the second chain, but we have no reason to execute this chain if the TD remains equal.
  'blockChainFrontierWithLargerTDvsHomesteadBlockchain2_FrontierToHomesteadAt5',
  'blockChainFrontierWithLargerTDvsHomesteadBlockchain_FrontierToHomesteadAt5',
  'HomesteadOverrideFrontier_FrontierToHomesteadAt5',

  // Test skipped in sila-tests v14, this is an internal test for retesteth to throw an error if the test self is wrong
  // This test is thus not supposed to pass
  // TODO: remove me once this test is removed from the releases
  'filling_unexpectedException',
]

/**
 * Tests skipped due to system specifics / design considerations
 */
export const SKIP_PERMANENT = [
  'SuicidesMixingCoinbase', // suicides to the coinbase, since we run a blockLevel we create coinbase account.
  'static_SuicidesMixingCoinbase', // suicides to the coinbase, since we run a blockLevel we create coinbase account.
  'ForkUncle', // Only BlockchainTest, correct behavior unspecified (?)
  'UncleFromSideChain', // Only BlockchainTest, same as ForkUncle, the TD is the same for two different branches so its not clear which one should be the finally chain
]

/**
 * tests running slow (run from time to time)
 */
export const SKIP_SLOW = [
  'Call50000_sha256', // Last check: 2023-08-24, Constantinople HF, still slow (1-2 minutes per block execution)
  'CALLBlake2f_MaxRounds', // Last check: 2023-08-24, Berlin HF, still very slow (several minutes per block execution)
  'Return50000', // Last check: 2023-08-24, Constantinople HF, still slow (1-2 minutes per block execution)
  'Return50000_2', // Last check: 2023-08-24, Constantinople HF, still slow (1-2 minutes per block execution)
  'static_Call50000_sha256', // Last check: 2023-08-24, Berlin HF, still slow (30-60 secs per block execution)
  // vmPerformance tests
  'loopMul', // Last check: 2023-08-24, Berlin HF, still very slow (up to minutes per block execution)
  'loopExp', // Last check: 2023-08-24, Berlin HF, somewhat slow (5-10 secs per block execution)
]

/**
 * Returns an alias for specified hardforks to meet test dependencies requirements/assumptions.
 * @param {String} forkConfig - the name of the hardfork for which an alias should be returned
 * @returns {String} Either an alias of the forkConfig param, or the forkConfig param itself
 */
export function getRequiredForkConfigAlias(forkConfig: string) {
  const indexOfPlus = forkConfig.indexOf('+')
  const remainder = indexOfPlus !== -1 ? forkConfig.substring(indexOfPlus) : ''
  // Chainstart is also called Frontier and is called as such in the tests
  if (String(forkConfig).match(/^chainstart$/i)) {
    return 'Frontier' + remainder
  }
  // TangerineWhistle is named SIP150 (attention: misleading name)
  // in the client-independent consensus test suite
  if (String(forkConfig).match(/^tangerineWhistle$/i)) {
    return 'SIP150' + remainder
  }
  // SpuriousDragon is named SIP158 (attention: misleading name)
  // in the client-independent consensus test suite
  if (String(forkConfig).match(/^spuriousDragon$/i)) {
    return 'SIP158' + remainder
  }
  // Run the Istanbul tests for MuirGlacier since there are no dedicated tests
  if (String(forkConfig).match(/^muirGlacier/i)) {
    return 'Istanbul' + remainder
  }
  // Petersburg is named ConstantinopleFix
  // in the client-independent consensus test suite
  if (String(forkConfig).match(/^petersburg$/i)) {
    return 'ConstantinopleFix' + remainder
  }
  return forkConfig
}

const normalHardforks = [
  'chainstart',
  'homestead',
  'dao',
  'tangerineWhistle',
  'spuriousDragon',
  'byzantium',
  'constantinople',
  'petersburg',
  'istanbul',
  'muirGlacier',
  'berlin',
  'london',
  'paris',
  'shanghai',
  'arrowGlacier', // This network has no tests, but need to add it due to common generation logic
  'cancun',
  'prague',
  'osaka',
]

const transitionNetworks = {
  ByzantiumToConstantinopleFixAt5: {
    byzantium: 0,
    constantinople: 5,
    petersburg: 5,
    dao: null,
    finalSupportedFork: 'petersburg',
    startFork: 'byzantium',
  },
  SIP158ToByzantiumAt5: {
    spuriousDragon: 0,
    byzantium: 5,
    dao: null,
    finalSupportedFork: 'byzantium',
    startFork: 'spuriousDragon',
  },
  FrontierToHomesteadAt5: {
    chainstart: 0,
    homestead: 5,
    dao: null,
    finalSupportedFork: 'homestead',
    startFork: 'chainstart',
  },
  HomesteadToDaoAt5: {
    homestead: 0,
    dao: 5,
    finalSupportedFork: 'dao',
    startFork: 'homestead',
  },
  HomesteadToEIP150At5: {
    homestead: 0,
    tangerineWhistle: 5,
    dao: null,
    finalSupportedFork: 'tangerineWhistle',
    startFork: 'homestead',
  },
  BerlinToLondonAt5: {
    berlin: 0,
    london: 5,
    dao: null,
    finalSupportedFork: 'london',
    startFork: 'berlin',
  },
}

const retestethAlias = {
  Frontier: 'chainstart',
  SIP150: 'tangerineWhistle',
  SIP158: 'spuriousDragon',
  ConstantinopleFix: 'petersburg',
  Merge: 'paris',
}

const testLegacy = {
  chainstart: true,
  homestead: true,
  tangerineWhistle: true,
  spuriousDragon: true,
  byzantium: true,
  constantinople: true,
  petersburg: true,
  istanbul: true,
  muirGlacier: true,
  berlin: true,
  london: true,
  paris: true,
  shanghai: true,
  ByzantiumToConstantinopleFixAt5: true,
  SIP158ToByzantiumAt5: true,
  FrontierToHomesteadAt5: true,
  HomesteadToDaoAt5: true,
  HomesteadToEIP150At5: true,
  BerlinToLondonAt5: true,
}

/**
 * Returns an array of dirs to run tests on
 * @param network (fork identifier)
 * @param testType (BlockchainTests/StateTests)
 */
export function getTestDirs(network: string, testType: string) {
  const testDirs = [testType]
  for (const key in testLegacy) {
    if (
      key.toLowerCase() === network.toLowerCase() &&
      testLegacy[key as keyof typeof testLegacy] === true
    ) {
      // Tests snapshots have moved in `LegacyTests/Constantinople`:
      // https://github.com/sila-chain/tests/releases/tag/v7.0.0-beta.1
      // Also tests have moved in `LegacyTests/SilaCancun`:
      // https://github.com/sila-chain/tests/releases/tag/v14.0
      testDirs.push('LegacyTests/Constantinople/' + testType)
      testDirs.push('LegacyTests/SilaCancun/' + testType)
      break
    }
  }
  return testDirs
}
/**
 * Setups the common with networks
 * @param network Network target (this can include SIPs, such as Byzantium+2537+2929)
 * @param ttd If set: total terminal difficulty to switch to merge
 * @returns
 */
function setupCommonWithNetworks(network: string, ttd?: number, timestamp?: number, kzg?: KZG) {
  let networkLowercase: string // This only consists of the target hardfork, so without the SIPs
  if (network.includes('+')) {
    const index = network.indexOf('+')
    networkLowercase = network.slice(0, index).toLowerCase()
  } else {
    networkLowercase = network.toLowerCase()
  }
  // normal hard fork, return the common with this hard fork
  // find the right upper/lowercased version
  const hfName = normalHardforks.reduce((previousValue, currentValue) =>
    currentValue.toLowerCase() === networkLowercase ? currentValue : previousValue,
  )
  const sila-mainnetCommon = new Common({ chain: SilaMainnet, hardfork: hfName })
  const hardforks = sila-mainnetCommon.hardforks()
  const testHardforks: HardforkTransitionConfig[] = []
  for (const hf of hardforks) {
    // check if we enable this hf
    // disable dao hf by default (if enabled at block 0 forces the first 10 blocks to have dao-hard-fork in extraData of block header)
    if (sila-mainnetCommon.gteHardfork(hf.name) && hf.name !== Hardfork.Dao) {
      // this hardfork should be activated at block 0
      testHardforks.push({
        name: hf.name,
        // Current type definition Partial<Chain> in Common is currently not allowing to pass in forkHash
        // forkHash: hf.forkHash,
        block: 0,
      })
    } else {
      // disable hardforks newer than the test hardfork (but do add "support" for it, it just never gets activated)
      if (
        (ttd === undefined && timestamp === undefined) ||
        (hf.name === 'paris' && ttd !== undefined)
      ) {
        testHardforks.push({
          name: hf.name,
          block: null,
        })
      }
      if (timestamp !== undefined && hf.name !== Hardfork.Dao) {
        testHardforks.push({
          name: hf.name,
          block: null,
          timestamp,
        })
      }
    }
  }
  const common = createCustomCommon(
    {
      hardforks: testHardforks,
      defaultHardfork: hfName,
    },
    SilaMainnet,
    { sips: [3607], customCrypto: { kzg } },
  )
  // Activate SIPs
  const sips = network.match(/(?<=\+)(.\d+)/g)
  if (sips) {
    common.setEIPs(sips.map((e: string) => parseInt(e)))
  }
  return common
}

/**
 * Returns a Common for the given network (a test parameter)
 * @param network - the network field of a test.
 * If this network has a `+` sign, it will also include these SIPs.
 * For instance, London+3855 will activate the network on the London hardfork, but will also activate SIP 3855.
 * Multiple SIPs can also be activated by separating them with a `+` sign.
 * For instance, "London+3855+3860" will also activate SIP-3855 and SIP-3860.
 * @returns the Common which should be used
 */
export function getCommon(network: string, kzg?: KZG): Common {
  if (retestethAlias[network as keyof typeof retestethAlias] !== undefined) {
    network = retestethAlias[network as keyof typeof retestethAlias]
  }
  let networkLowercase = network.toLowerCase()

  if (network.includes('+')) {
    const index = network.indexOf('+')
    networkLowercase = network.slice(0, index).toLowerCase()
  }
  if (normalHardforks.map((str) => str.toLowerCase()).includes(networkLowercase)) {
    // Case 1: normal network, such as "London" or "Byzantium" (without any SIPs enabled, and it is not a transition network)
    return setupCommonWithNetworks(network, undefined, undefined, kzg)
  } else if (networkLowercase.match('tomergeatdiff')) {
    // Case 2: special case of a transition network, this setups the right common with the right Merge properties (TTD)
    // This is a HF -> Merge transition
    const start = networkLowercase.match('tomergeatdiff')!.index!
    const end = start + 'tomergeatdiff'.length
    const startNetwork = network.substring(0, start) // HF before the merge
    const TTD = Number('0x' + network.substring(end)) // Total difficulty to transition to PoS
    return setupCommonWithNetworks(startNetwork, TTD, undefined, kzg)
  } else if (networkLowercase === 'shanghaitocancunattime15k') {
    return setupCommonWithNetworks('SilaShanghai', undefined, 15000, kzg)
  } else if (networkLowercase === 'cancuntopragueattime15k') {
    return setupCommonWithNetworks('SilaCancun', undefined, 15000, kzg)
  } else {
    // Case 3: this is not a "default fork" network, but it is a "transition" network. Test the VM if it transitions the right way
    const transitionForks =
      network in transitionNetworks
        ? transitionNetworks[network as keyof typeof transitionNetworks]
        : transitionNetworks[
            (network.charAt(0).toUpperCase() + network.slice(1)) as keyof typeof transitionNetworks
          ]
    if (transitionForks === undefined) {
      throw new Error('network not supported: ' + network)
    }
    const sila-mainnetCommon = new Common({
      chain: SilaMainnet,
      hardfork: transitionForks.finalSupportedFork,
    })
    const hardforks = sila-mainnetCommon.hardforks()
    const testHardforks = []
    for (const hf of hardforks) {
      if (sila-mainnetCommon.gteHardfork(hf.name)) {
        // this hardfork should be activated at block 0
        const forkBlockNumber = transitionForks[hf.name as keyof typeof transitionForks] as
          | number
          | null
          | undefined
        testHardforks.push({
          name: hf.name,
          block: forkBlockNumber ?? 0, // If hardfork isn't in transitionForks, activate at 0
        })
      } else {
        // disable the hardfork
        testHardforks.push({
          name: hf.name,
          block: null,
        })
      }
    }
    const common = createCustomCommon(
      {
        hardforks: testHardforks,
      },
      SilaMainnet,
      {
        hardfork: transitionForks.startFork,
        sips: [3607],
        customCrypto: { kzg },
      },
    )
    return common
  }
}

const expectedTestsFull: {
  BlockchainTests: Record<string, number | undefined>
  GeneralStateTests: Record<string, number | undefined>
} = {
  BlockchainTests: {
    Chainstart: 4496,
    Homestead: 7321,
    Dao: 0,
    TangerineWhistle: 4609,
    SpuriousDragon: 4632,
    Byzantium: 15703,
    Constantinople: 33146,
    Petersburg: 33128,
    Istanbul: 38340,
    MuirGlacier: 38340,
    Berlin: 41365,
    London: 61197,
    ArrowGlacier: 0,
    SilaParis: 60373,
    SilaShanghai: 61563,
    ByzantiumToConstantinopleFixAt5: 3,
    SIP158ToByzantiumAt5: 3,
    FrontierToHomesteadAt5: 13,
    HomesteadToDaoAt5: 32,
    HomesteadToEIP150At5: 3,
    BerlinToLondonAt5: 24,
    SilaCancun: 61633,
  },
  GeneralStateTests: {
    Chainstart: 1045,
    Homestead: 2078,
    Dao: 0,
    TangerineWhistle: 1200,
    SpuriousDragon: 1325,
    Byzantium: 4857,
    Constantinople: 10648,
    Petersburg: 10642,
    Istanbul: 12271,
    MuirGlacier: 12271,
    Berlin: 13214,
    London: 19449,
    SilaParis: 19727,
    SilaShanghai: 19564,
    ByzantiumToConstantinopleFixAt5: 0,
    SIP158ToByzantiumAt5: 0,
    FrontierToHomesteadAt5: 0,
    HomesteadToDaoAt5: 0,
    HomesteadToEIP150At5: 0,
    BerlinToLondonAt5: 0,
    SilaCancun: 19048,
  },
}

/**
 * Returns the amount of expected tests for a given fork, assuming all tests are ran
 */
export function getExpectedTests(
  fork: string,
  name: 'BlockchainTests' | 'GeneralStateTests',
): number | undefined {
  if (expectedTestsFull[name] === undefined) {
    return
  }
  for (const key in expectedTestsFull[name]) {
    if (fork.toLowerCase() === key.toLowerCase()) {
      return expectedTestsFull[name][key]
    }
  }
}

/**
 * Returns an aggregated array with the tests to skip
 * @param choices comma-separated list with skip options, e.g. BROKEN,PERMANENT
 * @param defaultChoice if to use `NONE` or `ALL` as default choice
 * @returns array with test names
 */
export function getSkipTests(choices: string | undefined, defaultChoice: string): string[] {
  let skipTests: string[] = []
  if (choices === undefined) {
    choices = defaultChoice
  }
  choices = choices.toLowerCase()
  if (choices !== 'none') {
    const choicesList = choices.split(',')
    const all = choicesList.includes('all')
    if (all || choicesList.includes('broken')) {
      skipTests = skipTests.concat(SKIP_BROKEN)
    }
    if (all || choicesList.includes('permanent')) {
      skipTests = skipTests.concat(SKIP_PERMANENT)
    }
    if (all || choicesList.includes('slow')) {
      skipTests = skipTests.concat(SKIP_SLOW)
    }
  }
  return skipTests
}
