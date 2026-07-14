[**@silajs/block**](../README.md)

***

[@silajs/block](../README.md) / cliqueVerifySignature

# Function: cliqueVerifySignature()

> **cliqueVerifySignature**(`header`, `signerList`): `boolean`

Defined in: [consensus/clique.ts:125](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/block/src/consensus/clique.ts#L125)

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

## Parameters

### header

[`BlockHeader`](../classes/BlockHeader.md)

### signerList

`Address`[]

## Returns

`boolean`
