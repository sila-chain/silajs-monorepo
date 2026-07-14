[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / NobleBLS

# Class: NobleBLS

Defined in: [precompiles/bls12\_381/noble.ts:158](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L158)

Implementation of the `EVMBLSInterface` using the `sila-cryptography (`@noble/curves`)
JS library, see https://github.com/sila-chain/js-sila-cryptography.

This is the SAVM default implementation.

## Implements

- [`EVMBLSInterface`](../type-aliases/EVMBLSInterface.md)

## Constructors

### Constructor

> **new NobleBLS**(): `NobleBLS`

#### Returns

`NobleBLS`

## Methods

### addG1()

> **addG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:159](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L159)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.addG1`

***

### addG2()

> **addG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:172](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L172)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.addG2`

***

### mapFP2toG2()

> **mapFP2toG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:194](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L194)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.mapFP2toG2`

***

### mapFPtoG1()

> **mapFPtoG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:184](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L184)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.mapFPtoG1`

***

### msmG1()

> **msmG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:204](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L204)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.msmG1`

***

### msmG2()

> **msmG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:236](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L236)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.msmG2`

***

### pairingCheck()

> **pairingCheck**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:268](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/precompiles/bls12_381/noble.ts#L268)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.pairingCheck`
