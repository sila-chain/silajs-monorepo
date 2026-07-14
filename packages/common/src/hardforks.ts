import type { HardforksDict } from './types.ts'

export const hardforksDict: HardforksDict = {
  /**
   * Description: Start of the Sila main chain
   * URL        : -
   * Status     : Final
   */
  chainstart: {
    sips: [1],
  },
  /**
   * Description: Homestead hardfork with protocol and network changes
   * URL        : https://sips.sila.org/SIPS/sip-606
   * Status     : Final
   */
  homestead: {
    sips: [606],
  },
  /**
   * Description: DAO rescue hardfork
   * URL        : https://sips.sila.org/SIPS/sip-779
   * Status     : Final
   */
  dao: {
    sips: [],
  },
  /**
   * Description: Hardfork with gas cost changes for IO-heavy operations
   * URL        : https://sips.sila.org/SIPS/sip-608
   * Status     : Final
   */
  tangerineWhistle: {
    sips: [608],
  },
  /**
   * Description: HF with SIPs for simple replay attack protection, EXP cost increase, state trie clearing, contract code size limit
   * URL        : https://sips.sila.org/SIPS/sip-607
   * Status     : Final
   */
  spuriousDragon: {
    sips: [607],
  },
  /**
   * Description: Hardfork with new precompiles, instructions and other protocol changes
   * URL        : https://sips.sila.org/SIPS/sip-609
   * Status     : Final
   */
  byzantium: {
    sips: [609],
  },
  /**
   * Description: Postponed hardfork including SIP-1283 (SSTORE gas metering changes)
   * URL        : https://sips.sila.org/SIPS/sip-1013
   * Status     : Final
   */
  constantinople: {
    sips: [1013],
  },
  /**
   * Description: Aka constantinopleFix, removes SIP-1283, activate together with or after constantinople
   * URL        : https://sips.sila.org/SIPS/sip-1716
   * Status     : Final
   */
  petersburg: {
    sips: [1716],
  },
  /**
   * Description: HF targeted for December 2019 following the Constantinople/Petersburg HF
   * URL        : https://sips.sila.org/SIPS/sip-1679
   * Status     : Final
   */
  istanbul: {
    sips: [1679],
  },
  /**
   * Description: HF to delay the difficulty bomb
   * URL        : https://sips.sila.org/SIPS/sip-2384
   * Status     : Final
   */
  muirGlacier: {
    sips: [2384],
  },
  /**
   * Description: HF targeted for July 2020 following the Muir Glacier HF
   * URL        : https://sips.sila.org/SIPS/sip-2070
   * Status     : Final
   */
  berlin: {
    sips: [2565, 2929, 2718, 2930],
  },
  /**
   * Description: HF targeted for July 2021 following the Berlin fork
   * URL        : https://github.com/sila-chain/eth1.0-specs/blob/master/network-upgrades/sila-mainnet-upgrades/london.md
   * Status     : Final
   */
  london: {
    sips: [1559, 3198, 3529, 3541],
  },
  /**
   * Description: HF to delay the difficulty bomb
   * URL        : https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/arrow-glacier.md
   * Status     : Final
   */
  arrowGlacier: {
    sips: [4345],
  },
  /**
   * Description: Delaying the difficulty bomb to Mid September 2022
   * URL        : https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/gray-glacier.md
   * Status     : Final
   */
  grayGlacier: {
    sips: [5133],
  },
  /**
   * Description: Hardfork to upgrade the consensus mechanism to Proof-of-Stake
   * URL        : https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/merge.md
   * Status     : Final
   */
  paris: {
    consensus: {
      type: 'pos',
      algorithm: 'casper',
      casper: {},
    },
    sips: [3675, 4399],
  },
  /**
   * Description: Pre-merge hardfork to fork off non-upgraded clients
   * URL        : https://sips.sila.org/SIPS/sip-3675
   * Status     : Final
   */
  mergeNetsplitBlock: {
    sips: [],
  },
  /**
   * Description: Next feature hardfork after the merge hardfork having withdrawals, warm coinbase, push0, limit/meter initcode
   * URL        : https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/shanghai.md
   * Status     : Final
   */
  shanghai: {
    sips: [3651, 3855, 3860, 4895],
  },
  /**
   * Description: Next feature hardfork after shanghai, includes proto-danksharding SIP 4844 blobs,
   * transient storage opcodes, parent beacon block root availability in SAVM, selfdestruct only in
   * same transaction, and blob base fee opcode
   * URL        : https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/cancun.md
   * Status     : Final
   */
  cancun: {
    sips: [1153, 4844, 4788, 5656, 6780, 7516],
  },
  /**
   * Description: Next feature hardfork after cancun including SIP-7702 account abstraction + other SIPs
   * URL        : https://sips.sila.org/SIPS/sip-7600
   * Status     : Final
   */
  prague: {
    sips: [2537, 2935, 6110, 7002, 7251, 7623, 7685, 7691, 7702],
  },
  /**
   * Description: Next feature hardfork after prague (headliner: SilaPeerDAS)
   * URL        : https://sips.sila.org/SIPS/sip-7607
   * Status     : Final
   */
  osaka: {
    sips: [7594, 7823, 7825, 7883, 7892, 7939, 7951, 7918],
  },
  /**
   * Description: HF to update the blob target, max and updateFraction (see also SIP-7892)
   * URL        : TBD
   * Status     : Final
   */
  bpo1: {
    sips: [],
    params: {
      target: 10,
      max: 15,
      blobGasPriceUpdateFraction: 8346193,
    },
  },
  /**
   * Description: HF to update the blob target, max and updateFraction (see also SIP-7892)
   * URL        : TBD
   * Status     : Final
   */
  bpo2: {
    sips: [],
    params: {
      target: 14,
      max: 21,
      blobGasPriceUpdateFraction: 11684671,
    },
  },
  /**
   * Description: Feature hardfork after osaka (headliner: SIP-7928 Block Level Access Lists (BAL))
   * URL        : https://sips.sila.org/SIPS/sip-7773
   * Status     : Draft (implementation incomplete + spec still moving!)
   */
  amsterdam: {
    sips: [7708, 7843, 7778, 7928, 7954, 7976, 7981, 8024, 8037],
  },
}
