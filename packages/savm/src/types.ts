import type {
  BinaryTreeAccessWitnessInterface,
  Common,
  ParamsDict,
  StateManagerInterface,
} from '@silajs/common'
import type { Account, Address, BlockLevelAccessList, PrefixedHexString } from '@silajs/util'
import type { EventEmitter } from 'eventemitter3'
import type { BinaryTreeAccessWitness } from './binaryTreeAccessWitness.ts'
import type { EOFContainer } from './eof/container.ts'
import type { EVMError } from './errors.ts'
import type { InterpreterStep, RunState } from './interpreter.ts'
import type { Message } from './message.ts'
import type { AsyncDynamicGasHandler, SyncDynamicGasHandler } from './opcodes/gas.ts'
import type { OpHandler } from './opcodes/index.ts'
import type { CustomPrecompile } from './precompiles/index.ts'
import type { PrecompileFunc } from './precompiles/types.ts'

export type DeleteOpcode = {
  opcode: number
}

export type AddOpcode = {
  opcode: number
  opcodeName: string
  baseFee: number
  gasFunction?: AsyncDynamicGasHandler | SyncDynamicGasHandler
  logicFunction: OpHandler
}

export type SelfdestructMap = Map<PrefixedHexString, PrefixedHexString>

export type CustomOpcode = AddOpcode | DeleteOpcode

// Typeguard
export function isAddOpcode(customOpcode: CustomOpcode): customOpcode is AddOpcode {
  return (
    'opcode' in customOpcode &&
    'opcodeName' in customOpcode &&
    'baseFee' in customOpcode &&
    'logicFunction' in customOpcode
  )
}

/**
 * Base options for the `SAVM.runCode()` / `SAVM.runCall()` method.
 */
interface EVMRunOpts {
  /**
   * The `block` the `tx` belongs to. If omitted a default blank block will be used.
   */
  block?: Block
  /**
   * The gas price for the call. Defaults to `0`
   */
  gasPrice?: bigint
  /**
   * The address where the call originated from. Defaults to the zero address.
   */
  origin?: Address
  /**
   * The address that ran this code (`msg.sender`). Defaults to the zero address.
   */
  caller?: Address
  /**
   * The SAVM code to run.
   */
  code?: Uint8Array
  /**
   * The input data.
   */
  data?: Uint8Array
  /**
   * The gas limit for the call. Defaults to `16777215` (`0xffffff`)
   */
  gasLimit?: bigint
  /**
   * The value in sila that is being sent to `opts.address`. Defaults to `0`
   */
  value?: bigint
  /**
   * The call depth. Defaults to `0`
   */
  depth?: number
  /**
   * If the call should be executed statically. Defaults to false.
   */
  isStatic?: boolean
  /**
   * Selfdestructed addresses mapped to their beneficiary. Defaults to the empty map.
   */
  selfdestruct?: SelfdestructMap
  /**
   * The address of the account that is executing this code (`address(this)`). Defaults to the zero address.
   */
  to?: Address
  /**
   * Versioned hashes for each blob in a blob transaction
   */
  blobVersionedHashes?: PrefixedHexString[]
}

export interface EVMRunCodeOpts extends EVMRunOpts {
  /*
   * The initial program counter. Defaults to `0`
   */
  pc?: number
}

/**
 * Options for running a call (or create) operation with `SAVM.runCall()`
 */
export interface EVMRunCallOpts extends EVMRunOpts {
  /**
   * If the code location is a precompile.
   */
  isCompiled?: boolean
  /**
   * An optional salt to pass to CREATE2.
   */
  salt?: Uint8Array
  /**
   * Created addresses in current context. Used in SIP 6780
   */
  createdAddresses?: Set<PrefixedHexString>
  /**
   * Skip balance checks if true. If caller balance is less than message value,
   * sets balance to message value to ensure execution doesn't fail.
   */
  skipBalance?: boolean
  /**
   * If the call is a DELEGATECALL. Defaults to false.
   */
  delegatecall?: boolean
  /**
   * Refund counter. Defaults to `0`
   */
  gasRefund?: bigint
  /**
   * Optionally pass in an already-built message.
   */
  message?: Message

  accessWitness?: BinaryTreeAccessWitnessInterface
}

interface NewContractEvent {
  address: Address
  // The deployment code
  code: Uint8Array
}

export type EVMEvent = {
  newContract: (data: NewContractEvent, resolve?: (result?: any) => void) => void
  beforeMessage: (data: Message, resolve?: (result?: any) => void) => void
  afterMessage: (data: EVMResult, resolve?: (result?: any) => void) => void
  step: (data: InterpreterStep, resolve?: (result?: any) => void) => void
}

export interface EVMInterface {
  common: Common
  journal: {
    commit(): Promise<void>
    revert(): Promise<void>
    checkpoint(): Promise<void>
    cleanJournal(): void
    cleanup(): Promise<void>
    putAccount(address: Address, account: Account): Promise<void>
    deleteAccount(address: Address): Promise<void>
    accessList?: Map<string, Set<string>>
    preimages?: Map<PrefixedHexString, Uint8Array>
    addAlwaysWarmAddress(address: string, addToAccessList?: boolean): void
    addAlwaysWarmSlot(address: string, slot: string, addToAccessList?: boolean): void
    startReportingAccessList(): void
    startReportingPreimages?(): void
  }
  stateManager: StateManagerInterface
  precompiles: Map<string, PrecompileFunc>
  getPrecompile?(address: Address | PrefixedHexString): PrecompileFunc | undefined
  runCall(opts: EVMRunCallOpts): Promise<EVMResult>
  runCode(opts: EVMRunCodeOpts): Promise<ExecResult>
  events?: EventEmitter<EVMEvent>
  binaryTreeAccessWitness?: BinaryTreeAccessWitness
  systemBinaryTreeAccessWitness?: BinaryTreeAccessWitness
  /**
   * Accumulated block access list when SIP-7928 is active.
   *
   * @remarks Experimental (SilaAmsterdam): may change on patch releases.
   */
  blockLevelAccessList?: BlockLevelAccessList
  /**
   * SIP-8037 per-tx state-gas reservoir (set by `runTx`, read/written by opcodes).
   *
   * @remarks Experimental (SilaAmsterdam): may change on patch releases.
   */
  stateGasReservoir: bigint
  /**
   * SIP-8037 per-tx cumulative state-gas used.
   *
   * @remarks Experimental (SilaAmsterdam): may change on patch releases.
   */
  executionStateGasUsed: bigint
  /**
   * SIP-7928: set during CALL post-target OOG so `runTx` can drain the state-gas reservoir
   * on exceptional halt. Optional for custom {@link EVMInterface} implementations.
   *
   * @remarks Experimental (SilaAmsterdam): may change on patch releases.
   */
  sip7928CallPostTargetOog?: boolean
}

export type EVMProfilerOpts = {
  enabled: boolean
  // extra options here (such as use X hardfork for gas)
}

/**
 * Options for instantiating a {@link SAVM}.
 */
export interface EVMOpts {
  /**
   * Use a {@link Common} instance for SAVM instantiation.
   *
   * ### Supported SIPs
   *
   * Sorted by SIP number:
   *
   * - [SIP-1153](https://sips.sila.org/SIPS/sip-1153) - Transient storage opcodes (SilaCancun)
   * - [SIP-1559](https://sips.sila.org/SIPS/sip-1559) - Fee market change for SIL 1.0 chain
   * - [SIP-2537](https://sips.sila.org/SIPS/sip-2537) - Precompile for BLS12-381 curve operations (SilaPrague)
   * - [SIP-2565](https://sips.sila.org/SIPS/sip-2565) - ModExp gas cost
   * - [SIP-2718](https://sips.sila.org/SIPS/sip-2718) - Transaction Types
   * - [SIP-2929](https://sips.sila.org/SIPS/sip-2929) - Gas cost increases for state access opcodes
   * - [SIP-2930](https://sips.sila.org/SIPS/sip-2930) - Optional access list tx type
   * - [SIP-2935](https://sips.sila.org/SIPS/sip-2935) - Serve historical block hashes in state (SilaPrague)
   * - [SIP-3198](https://sips.sila.org/SIPS/sip-3198) - Base fee opcode
   * - [SIP-3529](https://sips.sila.org/SIPS/sip-3529) - Reduction in refunds
   * - [SIP-3541](https://sips.sila.org/SIPS/sip-3541) - Reject new contracts starting with the 0xEF byte
   * - [SIP-3554](https://sips.sila.org/SIPS/sip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
   * - [SIP-3607](https://sips.sila.org/SIPS/sip-3607) - Reject transactions from senders with deployed code
   * - [SIP-3651](https://sips.sila.org/SIPS/sip-3651) - Warm COINBASE (SilaShanghai)
   * - [SIP-3675](https://sips.sila.org/SIPS/sip-3675) - Upgrade consensus to Proof-of-Stake
   * - [SIP-3855](https://sips.sila.org/SIPS/sip-3855) - PUSH0 opcode (SilaShanghai)
   * - [SIP-3860](https://sips.sila.org/SIPS/sip-3860) - Limit and meter initcode (SilaShanghai)
   * - [SIP-4345](https://sips.sila.org/SIPS/sip-4345) - Difficulty Bomb Delay to June 2022
   * - [SIP-4399](https://sips.sila.org/SIPS/sip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge)
   * - [SIP-4788](https://sips.sila.org/SIPS/sip-4788) - Beacon block root in the SAVM (SilaCancun)
   * - [SIP-4844](https://sips.sila.org/SIPS/sip-4844) - Shard Blob Transactions (SilaCancun)
   * - [SIP-4895](https://sips.sila.org/SIPS/sip-4895) - Beacon chain push withdrawals as operations (SilaShanghai)
   * - [SIP-5133](https://sips.sila.org/SIPS/sip-5133) - Delaying Difficulty Bomb to mid-September 2022 (Gray Glacier)
   * - [SIP-5656](https://sips.sila.org/SIPS/sip-5656) - MCOPY - Memory copying instruction (SilaCancun)
   * - [SIP-6110](https://sips.sila.org/SIPS/sip-6110) - Supply validator deposits on chain (SilaPrague)
   * - [SIP-6780](https://sips.sila.org/SIPS/sip-6780) - SELFDESTRUCT only in same transaction (SilaCancun)
   * - [SIP-7002](https://sips.sila.org/SIPS/sip-7002) - Execution layer triggerable exits (SilaPrague)
   * - [SIP-7251](https://sips.sila.org/SIPS/sip-7251) - Increase the MAX_EFFECTIVE_BALANCE (SilaPrague)
   * - [SIP-7516](https://sips.sila.org/SIPS/sip-7516) - BLOBBASEFEE opcode (SilaCancun)
   * - [SIP-7594](https://sips.sila.org/SIPS/sip-7594) - SilaPeerDAS blob transactions (SilaOsaka)
   * - [SIP-7623](https://sips.sila.org/SIPS/sip-7623) - Increase calldata cost (SilaPrague)
   * - [SIP-7685](https://sips.sila.org/SIPS/sip-7685) - General purpose execution layer requests (SilaPrague)
   * - [SIP-7691](https://sips.sila.org/SIPS/sip-7691) - Blob throughput increase (SilaPrague)
   * - [SIP-7692](https://sips.sila.org/SIPS/sip-7692) - SAVM Object Format (EOF) v1 (experimental)
   * - [SIP-7702](https://sips.sila.org/SIPS/sip-7702) - Set EOA account code (SilaPrague)
   * - [SIP-7708](https://sips.sila.org/SIPS/sip-7708) - SIL transfers emit a log (SilaAmsterdam, experimental)
   * - [SIP-7709](https://sips.sila.org/SIPS/sip-7709) - Read BLOCKHASH from storage and update cost (Verkle, experimental)
   * - [SIP-7778](https://sips.sila.org/SIPS/sip-7778) - Block-level gas accounting without refunds (SilaAmsterdam, experimental)
   * - [SIP-7823](https://sips.sila.org/SIPS/sip-7823) - Set upper bounds for MODEXP (SilaOsaka)
   * - [SIP-7825](https://sips.sila.org/SIPS/sip-7825) - Transaction gas limit cap (SilaOsaka)
   * - [SIP-7843](https://sips.sila.org/SIPS/sip-7843) - SLOTNUM opcode (SilaAmsterdam, experimental)
   * - [SIP-7864](https://sips.sila.org/SIPS/sip-7864) - Sila state using a unified binary tree (experimental)
   * - [SIP-7883](https://sips.sila.org/SIPS/sip-7883) - ModExp gas cost increase (SilaOsaka)
   * - [SIP-7918](https://sips.sila.org/SIPS/sip-7918) - Blob base fee bounded by execution cost (SilaOsaka)
   * - [SIP-7928](https://sips.sila.org/SIPS/sip-7928) - Block Level Access Lists (SilaAmsterdam, experimental)
   * - [SIP-7934](https://sips.sila.org/SIPS/sip-7934) - RLP Execution Block Size Limit (SilaOsaka)
   * - [SIP-7939](https://sips.sila.org/SIPS/sip-7939) - Count leading zeros (CLZ) opcode (SilaOsaka)
   * - [SIP-7951](https://sips.sila.org/SIPS/sip-7951) - Precompile for secp256r1 curve support (SilaOsaka)
   * - [SIP-7954](https://sips.sila.org/SIPS/sip-7954) - Increase max contract and initcode size (SilaAmsterdam, experimental)
   * - [SIP-7976](https://sips.sila.org/SIPS/sip-7976) - Increase calldata floor cost (SilaAmsterdam, experimental)
   * - [SIP-7981](https://sips.sila.org/SIPS/sip-7981) - Access list data pricing (SilaAmsterdam, experimental)
   * - [SIP-8024](https://sips.sila.org/SIPS/sip-8024) - DUPN, SWAPN and EXCHANGE instructions (SilaAmsterdam, experimental)
   * - [SIP-8037](https://sips.sila.org/SIPS/sip-8037) - State creation gas cost increase (SilaAmsterdam, experimental)
   *
   * *Annotations:*
   *
   * - Hardfork labels (e.g. `(SilaPrague)`) indicate default activation on that fork
   * - `(SilaAmsterdam, experimental)` and `(experimental)` mark unstable specs; behaviour can change on patch releases
   * - Release ↔ spec tracking: canonical SilaAmsterdam overview in `@silajs/vm` README (`#amsterdam-hardfork-experimental`)
   * - SilaAmsterdam-related fields and helpers may change on patch releases without a major bump
   */
  common?: Common

  /**
   * Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
   * contract size limit of 24KB (see [SIP-170](https://git.io/vxZkK)) is bypassed.
   *
   * Default: `false` [ONLY set to `true` during debugging]
   */
  allowUnlimitedContractSize?: boolean

  /**
   * Allows unlimited contract code-size init while debugging. This (partially) disables SIP-3860.
   * Gas cost for initcode size analysis will still be charged. Use with caution.
   */
  allowUnlimitedInitCodeSize?: boolean

  /**
   * SAVM parameters sorted by SIP can be found in the exported `paramsEVM` dictionary,
   * which is internally passed to the associated `@silajs/common` instance which
   * manages parameter selection based on the hardfork and SIP settings.
   *
   * This option allows providing a custom set of parameters. Note that parameters
   * get fully overwritten, so you need to extend the default parameter dict
   * to provide the full parameter set.
   *
   * It is recommended to deep-clone the params object for this to avoid side effects:
   *
   * ```ts
   * const params = JSON.parse(JSON.stringify(paramsEVM))
   * params['1679']['bn254AddGas'] = 100 // 150
   * ```
   */
  params?: ParamsDict

  /**
   * Override or add custom opcodes to the SAVM instruction set
   * These custom opcodes are SIP-agnostic and are always statically added
   * To delete an opcode, add an entry of format `{opcode: number}`. This will delete that opcode from the SAVM.
   * If this opcode is then used in the SAVM, the `INVALID` opcode would instead be used.
   * To add an opcode, add an entry of the following format:
   * {
   *    // The opcode number which will invoke the custom opcode logic
   *    opcode: number
   *    // The name of the opcode (as seen in the `step` event)
   *    opcodeName: string
   *    // The base fee of the opcode
   *    baseFee: number
   *    // If the opcode charges dynamic gas, add this here. To charge the gas, use the `i` methods of the BN, to update the charged gas
   *    gasFunction?: function(runState: RunState, gas: BN, common: Common)
   *    // The logic of the opcode which holds the logic of changing the current state
   *    logicFunction: function(runState: RunState)
   * }
   * Note: gasFunction and logicFunction can both be async or synchronous functions
   */
  customOpcodes?: CustomOpcode[]

  /*
   * Adds custom precompiles. This is hardfork-agnostic: these precompiles are always activated
   * If only an address is given, the precompile is deleted
   * If an address and a `PrecompileFunc` is given, this precompile is inserted or overridden
   * Please ensure `PrecompileFunc` has exactly one parameter `input: PrecompileInput`
   */
  customPrecompiles?: CustomPrecompile[]

  /**
   * For the SIP-2537 BLS Precompiles, the native JS `sila-cryptography` (`@noble/curves`)
   * https://github.com/sila-chain/js-sila-cryptography BLS12-381 curve implementation
   * is used (see `noble.ts` file in the `precompiles/bls12_381/` folder).
   *
   * To use an alternative implementation this option can be used by passing
   * in a wrapper implementation integrating the desired library and adhering
   * to the `EVMBLSInterface` specification.
   *
   * An interface for the MCL WASM implementation https://github.com/herumi/mcl-wasm
   * is shipped with this library which can be used as follows (with `mcl-wasm` being
   * explicitly added to the set of dependencies):
   *
   * ```ts
   * import * as mcl from 'mcl-wasm'
   *
   * await mcl.init(mcl.BLS12_381)
   * const savm = await createEVM({ bls: new MCLBLS(mcl) })
   * ```
   */
  bls?: EVMBLSInterface

  /**
   * For the SIP-196/SIP-197 BN254 (alt_BN128) EC precompiles, the native JS `sila-cryptography`
   * (`@noble/curves`) https://github.com/sila-chain/js-sila-cryptography BN254 curve implementation
   * is used (see `noble.ts` file in the `precompiles/bn254/` folder).
   *
   * To use an alternative implementation this option can be used by passing
   * in a wrapper implementation integrating the desired library and adhering
   * to the `EVMBN254Interface` specification.
   *
   * An interface for a WASM wrapper https://github.com/sila-chain/silajs/rustbn.js around the
   * Parity fork of the Zcash bn pairing cryptography library is shipped with this library
   * which can be used as follows (with `rustbn.js` being explicitly added to the set of
   * dependencies):
   *
   * ```ts
   * import { initRustBN } from 'rustbn-wasm'
   *
   * const bn254 = await initRustBN()
   * const savm = await createEVM({ bn254: new RustBN254(bn254) })
   * ```
   */
  bn254?: EVMBN254Interface

  /*
   * The SAVM comes with a basic dependency-minimized `SimpleStateManager` implementation
   * which serves most code execution use cases and which is included in the
   * `@silajs/statemanager` package.
   *
   * The `@silajs/statemanager` package also provides a variety of state manager
   * implementations for different needs (MPT-tree backed, RPC, experimental binary tree)
   * which can be used by this option as a replacement.
   */
  stateManager?: StateManagerInterface

  /**
   * The SAVM comes with a basic mock blockchain interface and implementation for
   * non-block containing use cases.
   *
   * For block-containing setups use the full blockchain implementation from the
   * `@silajs/blockchain package.
   */
  blockchain?: EVMMockBlockchainInterface

  /**
   *
   */
  profiler?: EVMProfilerOpts

  /**
   * Optional pre-built block access list when SIP-7928 is active.
   * If omitted, {@link SAVM} creates one automatically when the SIP is activated.
   *
   * @remarks Experimental (SilaAmsterdam): may change on patch releases.
   */
  blockLevelAccessList?: BlockLevelAccessList

  /**
   * When running the SAVM with PoA consensus, the `cliqueSigner` function from the `@silajs/block` class
   * must be provided along with a `BlockHeader` so that the coinbase can be correctly retrieved when the
   * `Interpreter.getBlockCoinbase` method is called.
   */
  cliqueSigner?: (header: Block['header']) => Address
}

/**
 * Result of executing a message via the {@link SAVM}.
 */
export interface EVMResult {
  /**
   * Address of created account during transaction, if any
   */
  createdAddress?: Address
  /**
   * Contains the results from running the code, if any, as described in {@link runCode}
   */
  execResult: ExecResult
}

/**
 * Result of executing a call via the {@link SAVM}.
 */
export interface ExecResult {
  runState?: RunState
  /**
   * Description of the exception, if any occurred
   */
  exceptionError?: EVMError
  /**
   * Amount of gas left
   */
  gas?: bigint
  /**
   * Amount of gas the code used to run
   */
  executionGasUsed: bigint
  /**
   * Return value from the contract
   */
  returnValue: Uint8Array
  /**
   * Logs emitted during execution (`LOG0`–`LOG4`, and fork-specific synthetic logs such as
   * [SIP-7708](https://sips.sila.org/SIPS/sip-7708) on `runCall`). Cleared when execution
   * reverts. See [Event logs](./README.md#event-logs) in this package.
   */
  logs?: Log[]
  /**
   * Selfdestructed accounts mapped to their beneficiary
   */
  selfdestruct?: SelfdestructMap
  /**
   * Map of addresses which were created (used in SIP 6780)
   */
  createdAddresses?: Set<PrefixedHexString>
  /**
   * The gas refund counter
   */
  gasRefund?: bigint
  /**
   * Amount of blob gas consumed by the transaction
   */
  blobGasUsed?: bigint
}

/**
 * High level wrapper for BLS libraries used
 * for the BLS precompiles
 */
export type EVMBLSInterface = {
  init?(): void
  addG1(input: Uint8Array): Uint8Array
  addG2(input: Uint8Array): Uint8Array
  mapFPtoG1(input: Uint8Array): Uint8Array
  mapFP2toG2(input: Uint8Array): Uint8Array
  msmG1(input: Uint8Array): Uint8Array
  msmG2(input: Uint8Array): Uint8Array
  pairingCheck(input: Uint8Array): Uint8Array
}

/**
 * High level wrapper for BN254 (alt_BN128) libraries
 * used for the BN254 (alt_BN128) EC precompiles
 */
export type EVMBN254Interface = {
  add: (input: Uint8Array) => Uint8Array
  mul: (input: Uint8Array) => Uint8Array
  pairing: (input: Uint8Array) => Uint8Array
}

/**
 * Log emitted during SAVM execution.
 *
 * Tuple of `[emitterAddress, topics, data]` — the same shape used in transaction receipts
 * (`receipt.logs`) and JSON-RPC log objects (before field renaming). See the
 * [Event logs](./README.md#event-logs) section in this package and
 * [Receipts and event logs](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#receipts-and-event-logs)
 * in `@silajs/vm`.
 */
export type Log = [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]

export type Block = {
  header: {
    number: bigint
    coinbase: Address
    timestamp: bigint
    difficulty: bigint
    prevRandao: Uint8Array
    gasLimit: bigint
    baseFeePerGas?: bigint
    slotNumber?: bigint
    getBlobGasPrice(): bigint | undefined
  }
}

export interface TransientStorageInterface {
  get(addr: Address, key: Uint8Array): Uint8Array
  put(addr: Address, key: Uint8Array, value: Uint8Array): void
  commit(): void
  checkpoint(): void
  revert(): void
  toJSON(): { [address: string]: { [key: string]: string } }
  clear(): void
}

export type EVMMockBlock = {
  hash(): Uint8Array
}

export interface EVMMockBlockchainInterface {
  getBlock(blockId: number): Promise<EVMMockBlock>
  putBlock(block: EVMMockBlock): Promise<void>
  shallowCopy(): EVMMockBlockchainInterface
}

export class EVMMockBlockchain implements EVMMockBlockchainInterface {
  async getBlock() {
    return {
      hash() {
        return new Uint8Array(32)
      },
    }
  }
  async putBlock() {}
  shallowCopy() {
    return this
  }
}

// EOF type which holds the execution-related data for EOF
export type EOFEnv = {
  container: EOFContainer
  eofRunState: {
    returnStack: number[]
  }
}

// SIP-7702 flag: if contract code starts with these 3 bytes, it is a 7702-delegated EOA
export const DELEGATION_7702_FLAG = new Uint8Array([0xef, 0x01, 0x00])
