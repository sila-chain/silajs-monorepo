[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / concatBytes

# Function: concatBytes()

> **concatBytes**(...`arrays`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/util/src/bytes.ts:457](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/bytes.ts#L457)

This mirrors the functionality of the `sila-cryptography` export except
it skips the check to validate that every element of `arrays` is indeed a `uint8Array`
Can give small performance gains on large arrays

## Parameters

### arrays

...`Uint8Array`\<`ArrayBufferLike`\>[]

an array of Uint8Arrays

## Returns

`Uint8Array`\<`ArrayBuffer`\>

one Uint8Array with all the elements of the original set
works like `Buffer.concat`
