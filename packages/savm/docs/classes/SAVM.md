[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / SAVM

# Class: SAVM

Defined in: [savm.ts:167](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L167)

The SAVM (Sila Virtual Machine) is responsible for executing SAVM bytecode, processing transactions, and managing state changes. It handles both contract calls and contract creation operations.

An SAVM instance can be created with the constructor method:

- [createEVM](../functions/createEVM.md)

## Implements

- [`EVMInterface`](../interfaces/EVMInterface.md)

## Constructors

### Constructor

> **new SAVM**(`opts`): `SAVM`

Defined in: [savm.ts:340](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L340)

Creates new SAVM object

#### Parameters

##### opts

[`EVMOpts`](../interfaces/EVMOpts.md)

The SAVM options

#### Returns

`SAVM`

#### Deprecated

The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async [createEVM](../functions/createEVM.md) constructor instead (same API).

## Properties

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

Defined in: [savm.ts:215](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L215)

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: [savm.ts:216](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L216)

***

### binaryAccessWitness?

> `optional` **binaryAccessWitness**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [savm.ts:208](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L208)

***

### blockchain

> **blockchain**: [`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md)

Defined in: [savm.ts:206](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L206)

***

### blockLevelAccessList?

> `readonly` `optional` **blockLevelAccessList**: `BlockLevelAccessList`

Defined in: [savm.ts:223](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L223)

Accumulated block access list when SIP-7928 is active.

#### Remarks

Experimental (SilaAmsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`blockLevelAccessList`](../interfaces/EVMInterface.md#blocklevelaccesslist)

***

### common

> `readonly` **common**: `Common`

Defined in: [savm.ts:202](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L202)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`common`](../interfaces/EVMInterface.md#common)

***

### createdAccountIntrinsicStateGas

> **createdAccountIntrinsicStateGas**: `Map`\<`` `0x${string}` ``, `bigint`\>

Defined in: [savm.ts:288](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L288)

SIP-8037 (v7): intrinsic state-gas tracking for depth=0 creation
transactions. The intrinsic stateBytesPerNewAccount * costPerStateByte
is paid up-front in runTx and isn't part of stateGasCreate. On a same-tx
SELFDESTRUCT of the freshly-created contract, runTx refunds the STATE
dimension only (decrement execution_state_gas_used) — the reservoir is
NOT credited, so the user still pays the gross intrinsic. This realizes
the v7 spec note "tx doesn't over charge for an account that never
persists" at the block_state_gas_used level.

***

### createdAccountStateGas

> **createdAccountStateGas**: `Map`\<`` `0x${string}` ``, `bigint`\>

Defined in: [savm.ts:277](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L277)

SIP-8037 SELFDESTRUCT deferred refund support.
Per-address record of the state-gas charged for account creation
(stateBytesPerNewAccount × costPerStateByte) plus code deposit
(L × costPerStateByte) at successful CREATE/CREATE2 frame exit.
Reset at the start of each tx and consulted by runTx to refund
state-gas for accounts that were both created and SELFDESTRUCTed
in the same tx (per SIP-6780 + SIP-8037).
Storage-slot state-gas is not tracked here yet; that is a separate
follow-up.

***

### sip7928CallPostTargetOog

> **sip7928CallPostTargetOog**: `boolean` = `false`

Defined in: [savm.ts:249](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L249)

SIP-7928 CALL post-state OOG: set while handling post-target access failure so
`runTx` drains the state-gas reservoir and the sender pays the full tx gas limit.

#### Remarks

Experimental (SilaAmsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`sip7928CallPostTargetOog`](../interfaces/EVMInterface.md#sip7928callposttargetoog)

***

### events

> `readonly` **events**: `EventEmitter`\<`EVMEvent`\>

Defined in: [savm.ts:203](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L203)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`events`](../interfaces/EVMInterface.md#events)

***

### executionStateGasUsed

> **executionStateGasUsed**: `bigint` = `BIGINT_0`

Defined in: [savm.ts:242](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L242)

SIP-8037 cumulative state-gas used by the current transaction.

#### Remarks

Experimental (SilaAmsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`executionStateGasUsed`](../interfaces/EVMInterface.md#executionstategasused)

***

### journal

> **journal**: `Journal`

Defined in: [savm.ts:207](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L207)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`journal`](../interfaces/EVMInterface.md#journal)

***

### stateGasReservoir

> **stateGasReservoir**: `bigint` = `BIGINT_0`

Defined in: [savm.ts:236](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L236)

SIP-8037 transaction-level state-gas reservoir.
Holds gas paid by the user that exceeds the SIP-7825 regular-gas budget
and is reserved exclusively for state-creation charges. State-gas charges
draw from `stateGasReservoir` first; once exhausted, they fall through to
the regular `gasLeft`. Refunds (revert / exceptional halt / SELFDESTRUCT
of same-tx-created accounts) refill it.
Initialized by `runTx` at the start of each transaction; `0` when SIP-8037 is inactive.

#### Remarks

Experimental (SilaAmsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`stateGasReservoir`](../interfaces/EVMInterface.md#stategasreservoir)

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [savm.ts:205](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L205)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`stateManager`](../interfaces/EVMInterface.md#statemanager)

***

### systemBinaryAccessWitness?

> `optional` **systemBinaryAccessWitness**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [savm.ts:209](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L209)

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: [savm.ts:211](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L211)

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

Defined in: [savm.ts:309](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L309)

##### Returns

`OpcodeList`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>

Defined in: [savm.ts:305](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L305)

##### Returns

`Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`precompiles`](../interfaces/EVMInterface.md#precompiles)

## Methods

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

Defined in: [savm.ts:1638](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L1638)

#### Returns

`void`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Defined in: [savm.ts:434](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L434)

Returns a list with the currently activated opcodes
available for SAVM execution

#### Returns

`OpcodeList`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

Defined in: [savm.ts:1634](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L1634)

#### Returns

`object`

##### opcodes

> **opcodes**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

##### precompiles

> **precompiles**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

***

### getPrecompile()

> **getPrecompile**(`address`): [`PrecompileFunc`](../interfaces/PrecompileFunc.md) \| `undefined`

Defined in: [savm.ts:1479](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L1479)

Returns the precompile function registered at the given address,
or `undefined` if no precompile is active there.

Accepts either an `Address` instance or a `0x`-prefixed hex string.

```ts
const savm = await createEVM({
  customPrecompiles: [{ address: '0x000000000000000000000000000000000000ff01', function: myFn }],
})
const fn = savm.getPrecompile('0x000000000000000000000000000000000000ff01')
```

#### Parameters

##### address

`` `0x${string}` `` | `Address`

#### Returns

[`PrecompileFunc`](../interfaces/PrecompileFunc.md) \| `undefined`

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`getPrecompile`](../interfaces/EVMInterface.md#getprecompile)

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

Defined in: [savm.ts:1209](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L1209)

Executes an SAVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

##### opts

[`EVMRunCallOpts`](../interfaces/EVMRunCallOpts.md)

#### Returns

`Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`runCall`](../interfaces/EVMInterface.md#runcall)

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: [savm.ts:1442](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L1442)

Bound to the global VM and therefore
shouldn't be used directly from the savm class

#### Parameters

##### opts

[`EVMRunCodeOpts`](../interfaces/EVMRunCodeOpts.md)

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`runCode`](../interfaces/EVMInterface.md#runcode)

***

### shallowCopy()

> **shallowCopy**(): `SAVM`

Defined in: [savm.ts:1620](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/savm.ts#L1620)

This method copies the SAVM, current HF and SIP settings
and returns a new SAVM instance.

Note: this is only a shallow copy and both SAVM instances
will point to the same underlying state DB.

#### Returns

`SAVM`

SAVM
