[**@silajs/block**](../README.md)

***

[@silajs/block](../README.md) / createBlockFromRPC

# Function: createBlockFromRPC()

> **createBlockFromRPC**(`blockParams`, `uncles`, `options?`): [`Block`](../classes/Block.md)

Defined in: [block/constructors.ts:216](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/block/src/block/constructors.ts#L216)

Creates a new block object from Sila JSON RPC.

## Parameters

### blockParams

[`JSONRPCBlock`](../interfaces/JSONRPCBlock.md)

Sila JSON RPC of block (eth_getBlockByNumber)

### uncles

`any`[] = `[]`

Optional list of Sila JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

### options?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

[`Block`](../classes/Block.md)

a new [Block](../classes/Block.md) object
