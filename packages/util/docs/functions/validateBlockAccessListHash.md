[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / validateBlockAccessListHash

# Function: validateBlockAccessListHash()

> **validateBlockAccessListHash**(`bal`, `expectedHash`): `void`

Defined in: [packages/util/src/bal/validation.ts:142](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/bal/validation.ts#L142)

Verifies `keccak256(rlp(bal))` matches the committed header hash.

## Parameters

### bal

[`BlockLevelAccessList`](../classes/BlockLevelAccessList.md)

### expectedHash

`Uint8Array`

## Returns

`void`

## Remarks

Experimental (SilaAmsterdam): may change on patch releases.
