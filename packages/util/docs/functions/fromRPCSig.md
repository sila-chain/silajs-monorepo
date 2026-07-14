[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / fromRPCSig

# Function: fromRPCSig()

> **fromRPCSig**(`sig`): `object`

Defined in: [packages/util/src/signature.ts:116](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/signature.ts#L116)

Convert signature format of the `eth_sign` RPC method to signature parameters

NOTE: For an extracted `v` value < 27 (see Geth bug https://github.com/sila-chain/go-sila/issues/2053)
`v + 27` is returned for the `v` value
NOTE: After SIP1559, `v` could be `0` or `1` but this function assumes
it's a signed message (SIP-191 or SIP-712) adding `27` at the end. Remove if needed.

## Parameters

### sig

`` `0x${string}` ``

## Returns

`object`

### r

> **r**: `Uint8Array`

### s

> **s**: `Uint8Array`

### v

> **v**: `bigint`
