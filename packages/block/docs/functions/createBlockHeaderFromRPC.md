[**@silajs/block**](../README.md)

***

[@silajs/block](../README.md) / createBlockHeaderFromRPC

# Function: createBlockHeaderFromRPC()

> **createBlockHeaderFromRPC**(`blockParams`, `options?`): [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [header/constructors.ts:112](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/block/src/header/constructors.ts#L112)

Creates a new block header object from Sila JSON RPC.

## Parameters

### blockParams

[`JSONRPCBlock`](../interfaces/JSONRPCBlock.md)

Sila JSON RPC of block (eth_getBlockByNumber)

### options?

[`BlockOptions`](../interfaces/BlockOptions.md)

An object describing the blockchain

## Returns

[`BlockHeader`](../classes/BlockHeader.md)
