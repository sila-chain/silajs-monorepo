[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / validateBlockAccessListJSONStructure

# Function: validateBlockAccessListJSONStructure()

> **validateBlockAccessListJSONStructure**(`json`): `void`

Defined in: [packages/util/src/bal/validation.ts:77](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/bal/validation.ts#L77)

Validates lexicographic ordering, uniqueness, and field constraints of a
block access list in JSON fixture / Engine API form.

Use before [createBlockLevelAccessListFromJSON](createBlockLevelAccessListFromJSON.md) so out-of-order or
duplicate accounts are not silently merged.

## Parameters

### json

[`BALJSONBlockAccessList`](../type-aliases/BALJSONBlockAccessList.md)

## Returns

`void`

## Remarks

Experimental (SilaAmsterdam): may change on patch releases.
