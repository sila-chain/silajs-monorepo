[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / countBlockAccessListItems

# Function: countBlockAccessListItems()

> **countBlockAccessListItems**(`bal`): `number`

Defined in: [packages/util/src/bal/validation.ts:28](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/bal/validation.ts#L28)

Counts BAL items per SIP-7928: `addresses + storage_keys`.
Uses the canonical [()](../classes/BlockLevelAccessList.md#raw) view.

## Parameters

### bal

[`BlockLevelAccessList`](../classes/BlockLevelAccessList.md)

## Returns

`number`

## Remarks

Experimental (SilaAmsterdam): may change on patch releases.
