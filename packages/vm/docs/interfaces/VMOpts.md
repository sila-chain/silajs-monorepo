[**@silajs/vm**](../README.md)

***

[@silajs/vm](../README.md) / VMOpts

# Interface: VMOpts

Defined in: [vm/src/types.ts:101](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L101)

Options for instantiating a [VM](../classes/VM.md).

## Properties

### activatePrecompiles?

> `optional` **activatePrecompiles**: `boolean`

Defined in: [vm/src/types.ts:145](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L145)

If true, create entries in the state tree for the precompiled contracts, saving some gas the
first time each of them is called.

If this parameter is false, each call to each of them has to pay an extra 25000 gas
for creating the account. If the account is still empty after this call, it will be deleted,
such that this extra cost has to be paid again.

Setting this to true has the effect of precompiled contracts' gas costs matching sila-mainnet's from
the very first call, which is intended for testing networks.

Default: `false`

***

### blockchain?

> `optional` **blockchain**: `EVMMockBlockchainInterface`

Defined in: [vm/src/types.ts:131](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L131)

A Blockchain object for storing/retrieving blocks

***

### common?

> `optional` **common**: `Common`

Defined in: [vm/src/types.ts:123](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L123)

Use a Common instance
if you want to change the chain setup.

### Possible Values

- `chain`: all chains supported by `Common` or a custom chain
- `hardfork`: `sila-mainnet` hardforks up to the `SilaParis` hardfork
- `sips`: `2537` (usage e.g. `sips: [ 2537, ]`)

Note: check the associated `@silajs/savm` instance options
documentation for supported SIPs.

### Default Setup

Default setup if no `Common` instance is provided:

- `chain`: `sila-mainnet`
- `hardfork`: `paris`
- `sips`: `[]`

***

### savm?

> `optional` **savm**: `EVMInterface`

Defined in: [vm/src/types.ts:178](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L178)

Use a custom SAVM to run Messages on. If this is not present, use the default SAVM.

***

### evmOpts?

> `optional` **evmOpts**: `EVMOpts`

Defined in: [vm/src/types.ts:186](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L186)

Often there is no need to provide a full custom SAVM but only a few options need to be
adopted. This option allows to provide a custom set of SAVM options to be passed.

Note: This option will throw if used in conjunction with a full custom SAVM passed.

***

### params?

> `optional` **params**: `ParamsDict`

Defined in: [vm/src/types.ts:173](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L173)

VM parameters sorted by SIP can be found in the exported `paramsVM` dictionary,
which is internally passed to the associated `@silajs/common` instance which
manages parameter selection based on the hardfork and SIP settings.

This option allows providing a custom set of parameters. Note that parameters
get fully overwritten, so you need to extend the default parameter dict
to provide the full parameter set.

It is recommended to deep-clone the params object for this to avoid side effects:

```ts
const params = JSON.parse(JSON.stringify(paramsVM))
params['1559']['elasticityMultiplier'] = 10 // 2
```

***

### profilerOpts?

> `optional` **profilerOpts**: [`VMProfilerOpts`](../type-aliases/VMProfilerOpts.md)

Defined in: [vm/src/types.ts:188](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L188)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| `BigIntLike`

Defined in: [vm/src/types.ts:156](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L156)

Set the hardfork either by timestamp (for HFs from SilaShanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### stateManager?

> `optional` **stateManager**: `StateManagerInterface`

Defined in: [vm/src/types.ts:127](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/src/types.ts#L127)

A StateManager instance to use as the state store
