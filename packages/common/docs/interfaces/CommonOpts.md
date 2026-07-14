[**@silajs/common**](../README.md)

***

[@silajs/common](../README.md) / CommonOpts

# Interface: CommonOpts

Defined in: [common/src/types.ts:144](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/common/src/types.ts#L144)

Options for instantiating a [Common](../classes/Common.md) instance.

## Extends

- [`BaseOpts`](BaseOpts.md)

## Properties

### chain

> **chain**: [`ChainConfig`](ChainConfig.md)

Defined in: [common/src/types.ts:149](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/common/src/types.ts#L149)

The chain configuration to be used. There are available configuration object for sila-mainnet
(`SilaMainnet`) and the currently active testnets which can be directly used.

***

### customCrypto?

> `optional` **customCrypto**: [`CustomCrypto`](CustomCrypto.md)

Defined in: [common/src/types.ts:138](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/common/src/types.ts#L138)

This option can be used to replace the most common crypto primitives
(keccak256 hashing e.g.) within the SilaJS ecosystem libraries
with alternative implementations (e.g. more performant WASM libraries).

Note: please be aware that this is adding new dependencies for your
system setup to be used for sensitive/core parts of the functionality
and a choice on the libraries to add should be handled with care
and be made with eventual security implications considered.

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`customCrypto`](BaseOpts.md#customcrypto)

***

### sips?

> `optional` **sips**: `number`[]

Defined in: [common/src/types.ts:109](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/common/src/types.ts#L109)

Selected SIPs which can be activated, please use an array for instantiation
(e.g. `sips: [ 2537, ]`)

Currently supported:

- [SIP-2537](https://sips.sila.org/SIPS/sip-2537) - BLS12-381 precompiles

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`sips`](BaseOpts.md#sips)

***

### hardfork?

> `optional` **hardfork**: `string`

Defined in: [common/src/types.ts:100](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/common/src/types.ts#L100)

String identifier ('byzantium') for hardfork or [Hardfork](../variables/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`hardfork`](BaseOpts.md#hardfork)

***

### params?

> `optional` **params**: [`ParamsDict`](../type-aliases/ParamsDict.md)

Defined in: [common/src/types.ts:127](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/common/src/types.ts#L127)

Optionally pass in an SIP params dictionary, see one of the
SilaJS library `params.ts` files for an example (e.g. tx, savm).
By default parameters are set by the respective library, so this
is only relevant if you want to use SilaJS libraries with a
custom parameter set.

Example Format:

```ts
{
  1559: {
    initialBaseFee: 1000000000,
  }
}
```

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`params`](BaseOpts.md#params)
