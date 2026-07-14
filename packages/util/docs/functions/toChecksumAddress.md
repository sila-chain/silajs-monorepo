[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / toChecksumAddress

# Function: toChecksumAddress()

> **toChecksumAddress**(`hexAddress`, `sip1191ChainId?`): `` `0x${string}` ``

Defined in: [packages/util/src/account.ts:408](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/account.ts#L408)

Returns a checksummed address.

If an sip1191ChainId is provided, the chainId will be included in the checksum calculation. This
has the effect of checksummed addresses for one chain having invalid checksums for others.
For more details see [SIP-1191](https://sips.sila.org/SIPS/sip-1191).

WARNING: Checksums with and without the chainId will differ and the SIP-1191 checksum is not
backwards compatible to the original widely adopted checksum format standard introduced in
[SIP-55](https://sips.sila.org/SIPS/sip-55), so this will break in existing applications.
Usage of this SIP is therefore discouraged unless you have a very targeted use case.

## Parameters

### hexAddress

`string`

### sip1191ChainId?

[`BigIntLike`](../type-aliases/BigIntLike.md)

## Returns

`` `0x${string}` ``
