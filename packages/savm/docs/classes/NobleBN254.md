[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / NobleBN254

# Class: NobleBN254

Defined in: [precompiles/bn254/noble.ts:111](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bn254/noble.ts#L111)

Implementation of the `EVMBN254Interface` using the `sila-cryptography (`@noble/curves`)
JS library, see https://github.com/sila-chain/js-sila-cryptography.

This is the SAVM default implementation.

## Implements

- [`EVMBN254Interface`](../type-aliases/EVMBN254Interface.md)

## Constructors

### Constructor

> **new NobleBN254**(): `NobleBN254`

#### Returns

`NobleBN254`

## Methods

### add()

> **add**(`input`): `Uint8Array`

Defined in: [precompiles/bn254/noble.ts:112](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bn254/noble.ts#L112)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBN254Interface.add`

***

### mul()

> **mul**(`input`): `Uint8Array`

Defined in: [precompiles/bn254/noble.ts:120](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bn254/noble.ts#L120)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBN254Interface.mul`

***

### pairing()

> **pairing**(`input`): `Uint8Array`

Defined in: [precompiles/bn254/noble.ts:131](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bn254/noble.ts#L131)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBN254Interface.pairing`
