import { Hardfork } from './enums.ts'

import type { EIPsDict } from './types.ts'

export const eipsDict: EIPsDict = {
  /**
   * Frontier/Chainstart
   * (there is no Meta-SIP currently for Frontier, so 1 was chosen)
   */
  1: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Homestead HF Meta SIP
   */
  606: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * TangerineWhistle HF Meta SIP
   */
  608: {
    minimumHardfork: Hardfork.Homestead,
  },
  /**
   * Spurious Dragon HF Meta SIP
   */
  607: {
    minimumHardfork: Hardfork.TangerineWhistle,
  },
  /**
   * Byzantium HF Meta SIP
   */
  609: {
    minimumHardfork: Hardfork.SpuriousDragon,
  },
  /**
   * Constantinople HF Meta SIP
   */
  1013: {
    minimumHardfork: Hardfork.Constantinople,
  },
  /**
   * Petersburg HF Meta SIP
   */
  1716: {
    minimumHardfork: Hardfork.Constantinople,
  },
  /**
   * Istanbul HF Meta SIP
   */
  1679: {
    minimumHardfork: Hardfork.Constantinople,
  },
  /**
   * MuirGlacier HF Meta SIP
   */
  2384: {
    minimumHardfork: Hardfork.Istanbul,
  },
  /**
   * Description : DUPN, SWAPN and EXCHANGE instructions
   * URL         : https://sips.sila.org/SIPS/sip-8024
   * Status      : Review
   */
  8024: {
    minimumHardfork: Hardfork.SilaAmsterdam,
    requiredEIPs: [],
  },
  /**
   * Description : Transient storage opcodes
   * URL         : https://sips.sila.org/SIPS/sip-1153
   * Status      : Final
   */
  1153: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Fee market change for SIL 1.0 chain
   * URL         : https://sips.sila.org/SIPS/sip-1559
   * Status      : Final
   */
  1559: {
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2930],
  },
  /**
   * Description : ModExp gas cost
   * URL         : https://sips.sila.org/SIPS/sip-2565
   * Status      : Final
   */
  2565: {
    minimumHardfork: Hardfork.Byzantium,
  },
  /**
   * Description : BLS12-381 precompiles
   * URL         : https://sips.sila.org/SIPS/sip-2537
   * Status      : Review
   */
  2537: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Typed Transaction Envelope
   * URL         : https://sips.sila.org/SIPS/sip-2718
   * Status      : Final
   */
  2718: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Gas cost increases for state access opcodes
   * URL         : https://sips.sila.org/SIPS/sip-2929
   * Status      : Final
   */
  2929: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Optional access lists
   * URL         : https://sips.sila.org/SIPS/sip-2930
   * Status      : Final
   */
  2930: {
    minimumHardfork: Hardfork.Istanbul,
    requiredEIPs: [2718, 2929],
  },
  /**
   * Description : Save historical block hashes in state (Verkle related usage, UNSTABLE)
   * URL         : https://github.com/gballet/SIPs/pull/3/commits/2e9ac09a142b0d9fb4db0b8d4609f92e5d9990c5
   * Status      : Draft
   */
  2935: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : BASEFEE opcode
   * URL         : https://sips.sila.org/SIPS/sip-3198
   * Status      : Final
   */
  3198: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : Reduction in refunds
   * URL         : https://sips.sila.org/SIPS/sip-3529
   * Status      : Final
   */
  3529: {
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2929],
  },
  /**
   * Description : SAVM Object Format (EOF) v1
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-3540.md
   * Status      : Review
   */
  3540: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3541, 3860],
  },
  /**
   * Description : Reject new contracts starting with the 0xEF byte
   * URL         : https://sips.sila.org/SIPS/sip-3541
   * Status      : Final
   */
  3541: {
    minimumHardfork: Hardfork.Berlin,
  },
  /**
   * Description : Difficulty Bomb Delay to December 1st 2021
   * URL         : https://sips.sila.org/SIPS/sip-3554
   * Status      : Final
   */
  3554: {
    minimumHardfork: Hardfork.MuirGlacier,
  },
  /**
   * Description : Reject transactions from senders with deployed code
   * URL         : https://sips.sila.org/SIPS/sip-3607
   * Status      : Final
   */
  3607: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Warm COINBASE
   * URL         : https://sips.sila.org/SIPS/sip-3651
   * Status      : Final
   */
  3651: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [2929],
  },
  /**
   * Description : EOF - Code Validation
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-3670.md
   * Status      : Review
   */
  3670: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540],
  },
  /**
   * Description : Upgrade consensus to Proof-of-Stake
   * URL         : https://sips.sila.org/SIPS/sip-3675
   * Status      : Final
   */
  3675: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : PUSH0 instruction
   * URL         : https://sips.sila.org/SIPS/sip-3855
   * Status      : Final
   */
  3855: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Limit and meter initcode
   * URL         : https://sips.sila.org/SIPS/sip-3860
   * Status      : Final
   */
  3860: {
    minimumHardfork: Hardfork.SpuriousDragon,
  },
  /**
   * Description : EOF - Static relative jumps
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-4200.md
   * Status      : Review
   */
  4200: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
  },
  /**
   * Description : Difficulty Bomb Delay to June 2022
   * URL         : https://sips.sila.org/SIPS/sip-4345
   * Status      : Final
   */
  4345: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : Supplant DIFFICULTY opcode with PREVRANDAO
   * URL         : https://sips.sila.org/SIPS/sip-4399
   * Status      : Final
   */
  4399: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : EOF - Functions
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-4750.md
   * Status      : Review
   */
  4750: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 5450],
  },
  /**
   * Description : Beacon block root in the SAVM
   * URL         : https://sips.sila.org/SIPS/sip-4788
   * Status      : Final
   */
  4788: {
    minimumHardfork: Hardfork.SilaCancun,
  },
  /**
   * Description : Shard Blob Transactions
   * URL         : https://sips.sila.org/SIPS/sip-4844
   * Status      : Final
   */
  4844: {
    minimumHardfork: Hardfork.SilaParis,
    requiredEIPs: [1559, 2718, 2930, 4895],
  },
  /**
   * Description : Beacon chain push withdrawals as operations
   * URL         : https://sips.sila.org/SIPS/sip-4895
   * Status      : Final
   */
  4895: {
    minimumHardfork: Hardfork.SilaParis,
  },
  /**
   * Description : Delaying Difficulty Bomb to mid-September 2022
   * URL         : https://sips.sila.org/SIPS/sip-5133
   * Status      : Final
   */
  5133: {
    minimumHardfork: Hardfork.GrayGlacier,
  },
  /**
   * Description : EOF - Stack Validation
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-5450.md
   * Status      : Review
   */
  5450: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 4200, 4750],
  },
  /**
   * Description : MCOPY - Memory copying instruction
   * URL         : https://sips.sila.org/SIPS/sip-5656
   * Status      : Final
   */
  5656: {
    minimumHardfork: Hardfork.SilaShanghai,
  },
  /**
   * Description : Supply validator deposits on chain
   * URL         : https://sips.sila.org/SIPS/sip-6110
   * Status      : Review
   */
  6110: {
    minimumHardfork: Hardfork.SilaCancun,
    requiredEIPs: [7685],
  },
  /**
   * Description : EOF - JUMPF and non-returning functions
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-6206.md
   * Status      : Review
   */
  6206: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [4750, 5450],
  },
  /**
   * Description : SELFDESTRUCT only in same transaction
   * URL         : https://sips.sila.org/SIPS/sip-6780
   * Status      : Final
   */
  6780: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : Execution layer triggerable withdrawals (experimental)
   * URL         : https://github.com/sila-chain/SIPs/blob/3b5fcad6b35782f8aaeba7d4ac26004e8fbd720f/SIPS/sip-7002.md
   * Status      : Review
   */
  7002: {
    minimumHardfork: Hardfork.SilaParis,
    requiredEIPs: [7685],
  },
  /**
   * Description : Revamped CALL instructions
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-7069.md
   * Status      : Review
   */
  7069: {
    minimumHardfork: Hardfork.Berlin,
    /* Note: per SIP these are the additionally required SIPs:
      SIP 150 - This is the entire Tangerine Whistle hardfork
      SIP 211 - (RETURNDATASIZE / RETURNDATACOPY) - Included in Byzantium
      SIP 214 - (STATICCALL) - Included in Byzantium
    */
    requiredEIPs: [2929],
  },
  /**
   * Description : Increase the MAX_EFFECTIVE_BALANCE -> Execution layer triggered consolidations (experimental)
   * URL         : https://sips.sila.org/SIPS/sip-7251
   * Status      : Draft
   */
  7251: {
    minimumHardfork: Hardfork.SilaParis,
    requiredEIPs: [7685],
  },
  /**
   * Description : EOF - Data section access instructions
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-7480.md
   * Status      : Review
   */
  7480: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
  },
  /**
   * Description : BLOBBASEFEE opcode
   * URL         : https://sips.sila.org/SIPS/sip-7516
   * Status      : Final
   */
  7516: {
    minimumHardfork: Hardfork.SilaParis,
    requiredEIPs: [4844],
  },
  /**
   * Description : Peerdas blob transactions
   * URL         : hhttps://sips.sila.org/SIPS/sip-7594
   * Status      : Review
   */
  7594: {
    minimumHardfork: Hardfork.SilaParis,
    requiredEIPs: [4844],
  },
  /**
   * Description : EOF Contract Creation
   * URL         : https://github.com/sila-chain/SIPs/blob/dd32a34cfe4473bce143641bfffe4fd67e1987ab/SIPS/sip-7620.md
   * Status      : Review
   */
  7620: {
    minimumHardfork: Hardfork.London,
    /* Note: per SIP these are the additionally required SIPs:
      SIP 170 - (Max contract size) - Included in Spurious Dragon
    */
    requiredEIPs: [3540, 3541, 3670],
  },
  /**
   * Description : Increase calldata cost to reduce maximum block size
   * URL         : https://github.com/sila-chain/SIPs/blob/da2a86bf15044416e8eb0301c9bdb8d561feeb32/SIPS/sip-7623.md
   * Status      : Review
   */
  7623: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : General purpose execution layer requests
   * URL         : https://sips.sila.org/SIPS/sip-7685
   * Status      : Review
   */
  7685: {
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.SilaCancun,
    requiredEIPs: [3675],
  },
  /**
   * Description : Blob throughput increase
   * URL         : https://sips.sila.org/SIPS/sip-7691
   * Status      : Review
   */
  7691: {
    minimumHardfork: Hardfork.SilaParis,
    requiredEIPs: [4844],
  },
  /**
   * Description : Blob base fee bounded by execution cost
   * URL         : https://sips.sila.org/SIPS/sip-7918
   * Status      : Last Call
   */
  7918: {
    minimumHardfork: Hardfork.SilaParis,
    requiredEIPs: [4844],
  },
  /**
   * Description : SAVM Object Format (EOFv1) Meta
   * URL         : https://github.com/sila-chain/SIPs/blob/4153e95befd0264082de3c4c2fe3a85cc74d3152/SIPS/sip-7692.md
   * Status      : Draft
   */
  7692: {
    minimumHardfork: Hardfork.SilaCancun,
    requiredEIPs: [3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7698],
  },
  /**
   * Description : EOF - Creation transaction
   * URL         : https://github.com/sila-chain/SIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/SIPS/sip-7698.md
   * Status      : Draft
   */
  7698: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 7620],
  },
  /**
   * Description : Set EOA account code for one transaction
   * URL         : https://github.com/sila-chain/SIPs/blob/62419ca3f45375db00b04a368ea37c0bfb05386a/SIPS/sip-7702.md
   * Status      : Review
   */
  7702: {
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.SilaCancun,
    requiredEIPs: [2718, 2929, 2930],
  },
  /**
   * Description : Set upper bounds for MODEXP
   * URL         : https://sips.sila.org/SIPS/sip-7823
   * Status      : Review
   */
  7823: {
    minimumHardfork: Hardfork.Byzantium,
  },
  /**
   * Description : Use historical block hashes saved in state for BLOCKHASH
   * URL         : https://sips.sila.org/SIPS/sip-7709
   * Status      : Final
   */
  7709: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [2935],
  },
  /**
   * Description : Transaction Gas Limit Cap
   * URL         : https://sips.sila.org/SIPS/sip-7825
   * Status      : Draft
   */
  7825: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : Sila state using a unified binary tree (experimental)
   * URL         : hhttps://sips.sila.org/SIPS/sip-7864
   * Status      : Draft
   */
  7864: {
    minimumHardfork: Hardfork.London,
  },
  /**
   * Description : SIP-7883: ModExp Gas Cost Increase
   * URL         : hhttps://sips.sila.org/SIPS/sip-7883
   * Status      : Draft
   */
  7883: {
    minimumHardfork: Hardfork.Chainstart,
  },
  /**
   * Description : Block-level gas accounting without refunds
   * URL         : https://sips.sila.org/SIPS/sip-7778
   * Status      : Draft
   */
  7778: {
    minimumHardfork: Hardfork.SilaAmsterdam,
    requiredEIPs: [],
  },
  /**
   * Description : Block Level Access Lists (BAL)
   * URL         : https://sips.sila.org/SIPS/sip-7928
   * Status      : Draft (in development, do not use in production)
   */
  7928: {
    minimumHardfork: Hardfork.SilaPrague,
    requiredEIPs: [],
  },
  /**
   * Description : Count leading zeros (CLZ) opcode
   * URL         : https://sips.sila.org/SIPS/sip-7939
   * Status      : Draft
   */
  7939: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : Precompile for secp256r1 Curve Support
   * URL         : https://sips.sila.org/SIPS/sip-7951
   * Status      : Draft
   */
  7951: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : RLP Execution Block Size Limit
   * URL         : https://sips.sila.org/SIPS/sip-7934
   * Status      : Last Call
   */
  7934: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : SIL transfers emit a log
   * URL         : https://sips.sila.org/SIPS/sip-7708
   * Status      : Draft
   */
  7708: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [1559, 4788, 6780],
  },
  /**
   * Description : SLOTNUM opcode
   * URL         : https://sips.sila.org/SIPS/sip-7843
   * Status      : Draft
   */
  7843: {
    minimumHardfork: Hardfork.SilaCancun,
    requiredEIPs: [],
  },
  /**
   * Description : Increase max contract code size (24 → 32 KiB) and initcode size (48 → 64 KiB)
   * URL         : https://sips.sila.org/SIPS/sip-7954
   * Status      : Draft
   */
  7954: {
    minimumHardfork: Hardfork.SilaAmsterdam,
    requiredEIPs: [],
  },
  /**
   * Description : Increase calldata floor cost
   * URL         : https://sips.sila.org/SIPS/sip-7976
   * Status      : Draft
   */
  7976: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [7623],
  },
  /**
   * Description : Access list data pricing
   * URL         : https://sips.sila.org/SIPS/sip-7981
   * Status      : Draft
   */
  7981: {
    minimumHardfork: Hardfork.SilaAmsterdam,
    requiredEIPs: [2930, 7976],
  },
  /**
   * Description : State Creation Gas Cost Increase
   * URL         : https://sips.sila.org/SIPS/sip-8037
   * Status      : Draft
   */
  8037: {
    minimumHardfork: Hardfork.SilaAmsterdam,
    requiredEIPs: [2780, 6780, 7702, 7825, 7976, 7981],
  },
}
