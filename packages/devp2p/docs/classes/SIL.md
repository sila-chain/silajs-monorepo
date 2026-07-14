[**@silajs/devp2p**](../README.md)

***

[@silajs/devp2p](../README.md) / SIL

# Class: SIL

Defined in: [packages/devp2p/src/protocol/sil.ts:70](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L70)

## Extends

- `Protocol`

## Constructors

### Constructor

> **new SIL**(`version`, `peer`, `send`): `SIL`

Defined in: [packages/devp2p/src/protocol/sil.ts:81](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L81)

#### Parameters

##### version

`number`

##### peer

[`Peer`](Peer.md)

##### send

[`SendMethod`](../type-aliases/SendMethod.md)

#### Returns

`SIL`

#### Overrides

`Protocol.constructor`

## Properties

### eth62

> `static` **eth62**: `object`

Defined in: [packages/devp2p/src/protocol/sil.ts:100](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L100)

#### constructor

> **constructor**: *typeof* `SIL` = `SIL`

#### length

> **length**: `number` = `8`

#### name

> **name**: `string` = `'sil'`

#### version

> **version**: `number` = `62`

***

### eth63

> `static` **eth63**: `object`

Defined in: [packages/devp2p/src/protocol/sil.ts:101](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L101)

#### constructor

> **constructor**: *typeof* `SIL` = `SIL`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'sil'`

#### version

> **version**: `number` = `63`

***

### eth64

> `static` **eth64**: `object`

Defined in: [packages/devp2p/src/protocol/sil.ts:102](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L102)

#### constructor

> **constructor**: *typeof* `SIL` = `SIL`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'sil'`

#### version

> **version**: `number` = `64`

***

### eth65

> `static` **eth65**: `object`

Defined in: [packages/devp2p/src/protocol/sil.ts:103](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L103)

#### constructor

> **constructor**: *typeof* `SIL` = `SIL`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'sil'`

#### version

> **version**: `number` = `65`

***

### eth66

> `static` **eth66**: `object`

Defined in: [packages/devp2p/src/protocol/sil.ts:104](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L104)

#### constructor

> **constructor**: *typeof* `SIL` = `SIL`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'sil'`

#### version

> **version**: `number` = `66`

***

### eth67

> `static` **eth67**: `object`

Defined in: [packages/devp2p/src/protocol/sil.ts:105](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L105)

#### constructor

> **constructor**: *typeof* `SIL` = `SIL`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'sil'`

#### version

> **version**: `number` = `67`

***

### eth68

> `static` **eth68**: `object`

Defined in: [packages/devp2p/src/protocol/sil.ts:106](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L106)

#### constructor

> **constructor**: *typeof* `SIL` = `SIL`

#### length

> **length**: `number` = `17`

#### name

> **name**: `string` = `'sil'`

#### version

> **version**: `number` = `68`

## Methods

### \_forkHashFromForkId()

> **\_forkHashFromForkId**(`forkId`): `string`

Defined in: [packages/devp2p/src/protocol/sil.ts:288](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L288)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`string`

***

### \_getStatusString()

> **\_getStatusString**(`status`): `string`

Defined in: [packages/devp2p/src/protocol/sil.ts:296](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L296)

#### Parameters

##### status

[`SilStatusMsg`](../interfaces/SilStatusMsg.md)

#### Returns

`string`

***

### \_handleMessage()

> **\_handleMessage**(`code`, `data`): `void`

Defined in: [packages/devp2p/src/protocol/sil.ts:108](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L108)

Abstract method to handle incoming messages

#### Parameters

##### code

[`SilMessageCodes`](../type-aliases/SilMessageCodes.md)

##### data

`Uint8Array`

#### Returns

`void`

#### Overrides

`Protocol._handleMessage`

***

### \_handleStatus()

> **\_handleStatus**(): `void`

Defined in: [packages/devp2p/src/protocol/sil.ts:226](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L226)

#### Returns

`void`

***

### \_nextForkFromForkId()

> **\_nextForkFromForkId**(`forkId`): `number`

Defined in: [packages/devp2p/src/protocol/sil.ts:292](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L292)

#### Parameters

##### forkId

`Uint8Array`

#### Returns

`number`

***

### \_validateForkId()

> **\_validateForkId**(`forkId`): `void`

Defined in: [packages/devp2p/src/protocol/sil.ts:182](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L182)

Sil 64 Fork ID validation (SIP-2124)

#### Parameters

##### forkId

`Uint8Array`\<`ArrayBufferLike`\>[]

Remote fork ID

#### Returns

`void`

***

### getMsgPrefix()

> **getMsgPrefix**(`msgCode`): `string`

Defined in: [packages/devp2p/src/protocol/sil.ts:419](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L419)

#### Parameters

##### msgCode

[`SilMessageCodes`](../type-aliases/SilMessageCodes.md)

#### Returns

`string`

***

### getVersion()

> **getVersion**(): `number`

Defined in: [packages/devp2p/src/protocol/sil.ts:284](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L284)

#### Returns

`number`

***

### sendMessage()

> **sendMessage**(`code`, `payload`): `void`

Defined in: [packages/devp2p/src/protocol/sil.ts:366](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L366)

#### Parameters

##### code

[`SilMessageCodes`](../type-aliases/SilMessageCodes.md)

##### payload

`Input`

#### Returns

`void`

***

### sendStatus()

> **sendStatus**(`status`): `void`

Defined in: [packages/devp2p/src/protocol/sil.ts:316](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/devp2p/src/protocol/sil.ts#L316)

#### Parameters

##### status

[`SilStatusOpts`](../type-aliases/SilStatusOpts.md)

#### Returns

`void`
