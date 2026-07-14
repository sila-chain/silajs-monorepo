[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / EVMOpts

# Interface: EVMOpts

Defined in: [types.ts:220](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L220)

Options for instantiating a [SAVM](../classes/SAVM.md).

## Properties

### allowUnlimitedContractSize?

> `optional` **allowUnlimitedContractSize**: `boolean`

Defined in: [types.ts:297](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L297)

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
contract size limit of 24KB (see [SIP-170](https://git.io/vxZkK)) is bypassed.

Default: `false` [ONLY set to `true` during debugging]

***

### allowUnlimitedInitCodeSize?

> `optional` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: [types.ts:303](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L303)

Allows unlimited contract code-size init while debugging. This (partially) disables SIP-3860.
Gas cost for initcode size analysis will still be charged. Use with caution.

***

### blockchain?

> `optional` **blockchain**: [`EVMMockBlockchainInterface`](EVMMockBlockchainInterface.md)

Defined in: [types.ts:416](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L416)

The SAVM comes with a basic mock blockchain interface and implementation for
non-block containing use cases.

For block-containing setups use the full blockchain implementation from the
`@silajs/blockchain package.

***

### blockLevelAccessList?

> `optional` **blockLevelAccessList**: `BlockLevelAccessList`

Defined in: [types.ts:429](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L429)

Optional pre-built block access list when SIP-7928 is active.
If omitted, [SAVM](../classes/SAVM.md) creates one automatically when the SIP is activated.

#### Remarks

Experimental (SilaAmsterdam): may change on patch releases.

***

### bls?

> `optional` **bls**: [`EVMBLSInterface`](../type-aliases/EVMBLSInterface.md)

Defined in: [types.ts:373](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L373)

For the SIP-2537 BLS Precompiles, the native JS `sila-cryptography` (`@noble/curves`)
https://github.com/sila-chain/js-sila-cryptography BLS12-381 curve implementation
is used (see `noble.ts` file in the `precompiles/bls12_381/` folder).

To use an alternative implementation this option can be used by passing
in a wrapper implementation integrating the desired library and adhering
to the `EVMBLSInterface` specification.

An interface for the MCL WASM implementation https://github.com/herumi/mcl-wasm
is shipped with this library which can be used as follows (with `mcl-wasm` being
explicitly added to the set of dependencies):

```ts
import * as mcl from 'mcl-wasm'

await mcl.init(mcl.BLS12_381)
const savm = await createEVM({ bls: new MCLBLS(mcl) })
```

***

### bn254?

> `optional` **bn254**: [`EVMBN254Interface`](../type-aliases/EVMBN254Interface.md)

Defined in: [types.ts:396](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L396)

For the SIP-196/SIP-197 BN254 (alt_BN128) EC precompiles, the native JS `sila-cryptography`
(`@noble/curves`) https://github.com/sila-chain/js-sila-cryptography BN254 curve implementation
is used (see `noble.ts` file in the `precompiles/bn254/` folder).

To use an alternative implementation this option can be used by passing
in a wrapper implementation integrating the desired library and adhering
to the `EVMBN254Interface` specification.

An interface for a WASM wrapper https://github.com/sila-chain/silajs/rustbn.js around the
Parity fork of the Zcash bn pairing cryptography library is shipped with this library
which can be used as follows (with `rustbn.js` being explicitly added to the set of
dependencies):

```ts
import { initRustBN } from 'rustbn-wasm'

const bn254 = await initRustBN()
const savm = await createEVM({ bn254: new RustBN254(bn254) })
```

***

### cliqueSigner()?

> `optional` **cliqueSigner**: (`header`) => `Address`

Defined in: [types.ts:436](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L436)

When running the SAVM with PoA consensus, the `cliqueSigner` function from the `@silajs/block` class
must be provided along with a `BlockHeader` so that the coinbase can be correctly retrieved when the
`Interpreter.getBlockCoinbase` method is called.

#### Parameters

##### header

###### baseFeePerGas?

`bigint`

###### coinbase

`Address`

###### difficulty

`bigint`

###### gasLimit

`bigint`

###### number

`bigint`

###### prevRandao

`Uint8Array`

###### slotNumber?

`bigint`

###### timestamp

`bigint`

###### getBlobGasPrice

#### Returns

`Address`

***

### common?

> `optional` **common**: `Common`

Defined in: [types.ts:289](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L289)

Use a Common instance for SAVM instantiation.

### Supported SIPs

Sorted by SIP number:

- [SIP-1153](https://sips.sila.org/SIPS/sip-1153) - Transient storage opcodes (SilaCancun)
- [SIP-1559](https://sips.sila.org/SIPS/sip-1559) - Fee market change for SIL 1.0 chain
- [SIP-2537](https://sips.sila.org/SIPS/sip-2537) - Precompile for BLS12-381 curve operations (SilaPrague)
- [SIP-2565](https://sips.sila.org/SIPS/sip-2565) - ModExp gas cost
- [SIP-2718](https://sips.sila.org/SIPS/sip-2718) - Transaction Types
- [SIP-2929](https://sips.sila.org/SIPS/sip-2929) - Gas cost increases for state access opcodes
- [SIP-2930](https://sips.sila.org/SIPS/sip-2930) - Optional access list tx type
- [SIP-2935](https://sips.sila.org/SIPS/sip-2935) - Serve historical block hashes in state (SilaPrague)
- [SIP-3198](https://sips.sila.org/SIPS/sip-3198) - Base fee opcode
- [SIP-3529](https://sips.sila.org/SIPS/sip-3529) - Reduction in refunds
- [SIP-3541](https://sips.sila.org/SIPS/sip-3541) - Reject new contracts starting with the 0xEF byte
- [SIP-3554](https://sips.sila.org/SIPS/sip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
- [SIP-3607](https://sips.sila.org/SIPS/sip-3607) - Reject transactions from senders with deployed code
- [SIP-3651](https://sips.sila.org/SIPS/sip-3651) - Warm COINBASE (SilaShanghai)
- [SIP-3675](https://sips.sila.org/SIPS/sip-3675) - Upgrade consensus to Proof-of-Stake
- [SIP-3855](https://sips.sila.org/SIPS/sip-3855) - PUSH0 opcode (SilaShanghai)
- [SIP-3860](https://sips.sila.org/SIPS/sip-3860) - Limit and meter initcode (SilaShanghai)
- [SIP-4345](https://sips.sila.org/SIPS/sip-4345) - Difficulty Bomb Delay to June 2022
- [SIP-4399](https://sips.sila.org/SIPS/sip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge)
- [SIP-4788](https://sips.sila.org/SIPS/sip-4788) - Beacon block root in the SAVM (SilaCancun)
- [SIP-4844](https://sips.sila.org/SIPS/sip-4844) - Shard Blob Transactions (SilaCancun)
- [SIP-4895](https://sips.sila.org/SIPS/sip-4895) - Beacon chain push withdrawals as operations (SilaShanghai)
- [SIP-5133](https://sips.sila.org/SIPS/sip-5133) - Delaying Difficulty Bomb to mid-September 2022 (Gray Glacier)
- [SIP-5656](https://sips.sila.org/SIPS/sip-5656) - MCOPY - Memory copying instruction (SilaCancun)
- [SIP-6110](https://sips.sila.org/SIPS/sip-6110) - Supply validator deposits on chain (SilaPrague)
- [SIP-6780](https://sips.sila.org/SIPS/sip-6780) - SELFDESTRUCT only in same transaction (SilaCancun)
- [SIP-7002](https://sips.sila.org/SIPS/sip-7002) - Execution layer triggerable exits (SilaPrague)
- [SIP-7251](https://sips.sila.org/SIPS/sip-7251) - Increase the MAX_EFFECTIVE_BALANCE (SilaPrague)
- [SIP-7516](https://sips.sila.org/SIPS/sip-7516) - BLOBBASEFEE opcode (SilaCancun)
- [SIP-7594](https://sips.sila.org/SIPS/sip-7594) - SilaPeerDAS blob transactions (SilaOsaka)
- [SIP-7623](https://sips.sila.org/SIPS/sip-7623) - Increase calldata cost (SilaPrague)
- [SIP-7685](https://sips.sila.org/SIPS/sip-7685) - General purpose execution layer requests (SilaPrague)
- [SIP-7691](https://sips.sila.org/SIPS/sip-7691) - Blob throughput increase (SilaPrague)
- [SIP-7692](https://sips.sila.org/SIPS/sip-7692) - SAVM Object Format (EOF) v1 (experimental)
- [SIP-7702](https://sips.sila.org/SIPS/sip-7702) - Set EOA account code (SilaPrague)
- [SIP-7708](https://sips.sila.org/SIPS/sip-7708) - SIL transfers emit a log (SilaAmsterdam, experimental)
- [SIP-7709](https://sips.sila.org/SIPS/sip-7709) - Read BLOCKHASH from storage and update cost (Verkle, experimental)
- [SIP-7778](https://sips.sila.org/SIPS/sip-7778) - Block-level gas accounting without refunds (SilaAmsterdam, experimental)
- [SIP-7823](https://sips.sila.org/SIPS/sip-7823) - Set upper bounds for MODEXP (SilaOsaka)
- [SIP-7825](https://sips.sila.org/SIPS/sip-7825) - Transaction gas limit cap (SilaOsaka)
- [SIP-7843](https://sips.sila.org/SIPS/sip-7843) - SLOTNUM opcode (SilaAmsterdam, experimental)
- [SIP-7864](https://sips.sila.org/SIPS/sip-7864) - Sila state using a unified binary tree (experimental)
- [SIP-7883](https://sips.sila.org/SIPS/sip-7883) - ModExp gas cost increase (SilaOsaka)
- [SIP-7918](https://sips.sila.org/SIPS/sip-7918) - Blob base fee bounded by execution cost (SilaOsaka)
- [SIP-7928](https://sips.sila.org/SIPS/sip-7928) - Block Level Access Lists (SilaAmsterdam, experimental)
- [SIP-7934](https://sips.sila.org/SIPS/sip-7934) - RLP Execution Block Size Limit (SilaOsaka)
- [SIP-7939](https://sips.sila.org/SIPS/sip-7939) - Count leading zeros (CLZ) opcode (SilaOsaka)
- [SIP-7951](https://sips.sila.org/SIPS/sip-7951) - Precompile for secp256r1 curve support (SilaOsaka)
- [SIP-7954](https://sips.sila.org/SIPS/sip-7954) - Increase max contract and initcode size (SilaAmsterdam, experimental)
- [SIP-7976](https://sips.sila.org/SIPS/sip-7976) - Increase calldata floor cost (SilaAmsterdam, experimental)
- [SIP-7981](https://sips.sila.org/SIPS/sip-7981) - Access list data pricing (SilaAmsterdam, experimental)
- [SIP-8024](https://sips.sila.org/SIPS/sip-8024) - DUPN, SWAPN and EXCHANGE instructions (SilaAmsterdam, experimental)
- [SIP-8037](https://sips.sila.org/SIPS/sip-8037) - State creation gas cost increase (SilaAmsterdam, experimental)

*Annotations:*

- Hardfork labels (e.g. `(SilaPrague)`) indicate default activation on that fork
- `(SilaAmsterdam, experimental)` and `(experimental)` mark unstable specs; behaviour can change on patch releases
- Release ↔ spec tracking: canonical SilaAmsterdam overview in `@silajs/vm` README (`#amsterdam-hardfork-experimental`)
- SilaAmsterdam-related fields and helpers may change on patch releases without a major bump

***

### customOpcodes?

> `optional` **customOpcodes**: `CustomOpcode`[]

Defined in: [types.ts:343](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L343)

Override or add custom opcodes to the SAVM instruction set
These custom opcodes are SIP-agnostic and are always statically added
To delete an opcode, add an entry of format `{opcode: number}`. This will delete that opcode from the SAVM.
If this opcode is then used in the SAVM, the `INVALID` opcode would instead be used.
To add an opcode, add an entry of the following format:
{
   // The opcode number which will invoke the custom opcode logic
   opcode: number
   // The name of the opcode (as seen in the `step` event)
   opcodeName: string
   // The base fee of the opcode
   baseFee: number
   // If the opcode charges dynamic gas, add this here. To charge the gas, use the `i` methods of the BN, to update the charged gas
   gasFunction?: function(runState: RunState, gas: BN, common: Common)
   // The logic of the opcode which holds the logic of changing the current state
   logicFunction: function(runState: RunState)
}
Note: gasFunction and logicFunction can both be async or synchronous functions

***

### customPrecompiles?

> `optional` **customPrecompiles**: [`CustomPrecompile`](../type-aliases/CustomPrecompile.md)[]

Defined in: [types.ts:351](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L351)

***

### params?

> `optional` **params**: `ParamsDict`

Defined in: [types.ts:321](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L321)

SAVM parameters sorted by SIP can be found in the exported `paramsEVM` dictionary,
which is internally passed to the associated `@silajs/common` instance which
manages parameter selection based on the hardfork and SIP settings.

This option allows providing a custom set of parameters. Note that parameters
get fully overwritten, so you need to extend the default parameter dict
to provide the full parameter set.

It is recommended to deep-clone the params object for this to avoid side effects:

```ts
const params = JSON.parse(JSON.stringify(paramsEVM))
params['1679']['bn254AddGas'] = 100 // 150
```

***

### profiler?

> `optional` **profiler**: `EVMProfilerOpts`

Defined in: [types.ts:421](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L421)

***

### stateManager?

> `optional` **stateManager**: `StateManagerInterface`

Defined in: [types.ts:407](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L407)
