[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / publicToAddress

# Variable: publicToAddress()

> `const` **publicToAddress**: (`pubKey`, `sanitize`) => `Uint8Array` = `pubToAddress`

Defined in: [packages/util/src/account.ts:549](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/account.ts#L549)

Returns the sila address of a given public key.
Accepts "Sila public keys" and SEC1 encoded keys.

## Parameters

### pubKey

`Uint8Array`

The two points of an uncompressed key, unless sanitize is enabled

### sanitize

`boolean` = `false`

Accept public keys in other formats

## Returns

`Uint8Array`
