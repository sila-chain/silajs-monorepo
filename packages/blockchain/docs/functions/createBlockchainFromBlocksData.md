[**@silajs/blockchain**](../README.md)

***

[@silajs/blockchain](../README.md) / createBlockchainFromBlocksData

# Function: createBlockchainFromBlocksData()

> **createBlockchainFromBlocksData**(`blocksData`, `opts`): `Promise`\<[`Blockchain`](../classes/Blockchain.md)\>

Defined in: [constructors.ts:106](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/blockchain/src/constructors.ts#L106)

Creates a blockchain from a list of block objects,
objects must be readable by createBlock

## Parameters

### blocksData

`BlockData`[]

### opts

[`BlockchainOptions`](../interfaces/BlockchainOptions.md) = `{}`

Constructor options, see [BlockchainOptions](../interfaces/BlockchainOptions.md)

## Returns

`Promise`\<[`Blockchain`](../classes/Blockchain.md)\>
