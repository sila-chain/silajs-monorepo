[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / Units

# Class: Units

Defined in: [packages/util/src/units.ts:25](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/units.ts#L25)

## Constructors

### Constructor

> **new Units**(): `Units`

#### Returns

`Units`

## Methods

### sila()

> `static` **sila**(`amount`): `bigint`

Defined in: [packages/util/src/units.ts:41](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/units.ts#L41)

Convert a number or bigint input of sila to wei

#### Parameters

##### amount

amount of units of sila to convert to wei

`number` | `bigint`

#### Returns

`bigint`

amount of units in wei

***

### gwei()

> `static` **gwei**(`amount`): `bigint`

Defined in: [packages/util/src/units.ts:52](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/units.ts#L52)

Convert a number or bigint input of gwei to wei

#### Parameters

##### amount

amount of units of gwei to convert to wei

`number` | `bigint`

#### Returns

`bigint`

amount of units in wei

***

### validateInput()

> `static` **validateInput**(`amount`): `void`

Defined in: [packages/util/src/units.ts:26](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/units.ts#L26)

#### Parameters

##### amount

`number` | `bigint`

#### Returns

`void`
