[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / toCompactSig

# Function: toCompactSig()

> **toCompactSig**(`v`, `r`, `s`, `chainId?`): `string`

Defined in: [packages/util/src/signature.ts:89](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/signature.ts#L89)

Convert signature parameters into the format of Compact Signature Representation (SIP-2098).
NOTE: Accepts `v === 0 | v === 1` for SIP1559 transactions

## Parameters

### v

`bigint`

### r

`Uint8Array`

### s

`Uint8Array`

### chainId?

`bigint`

## Returns

`string`

Signature
