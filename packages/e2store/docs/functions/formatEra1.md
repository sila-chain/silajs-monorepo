[**@silajs/e2store**](../README.md)

***

[@silajs/e2store](../README.md) / formatEra1

# Function: formatEra1()

> **formatEra1**(`blockTuples`, `headerRecords`, `epoch`): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [packages/e2store/src/era1/era1.ts:23](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/e2store/src/era1/era1.ts#L23)

Format era1 from epoch of history data

## Parameters

### blockTuples

`object`[]

header, body, receipts, totalDifficulty

### headerRecords

`object`[]

array of Header Records { blockHash: Uint8Array, totalDifficulty: bigint }

### epoch

`number`

epoch index

## Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

serialized era1 file
