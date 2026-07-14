[**@silajs/wallet**](../../../../README.md)

***

[@silajs/wallet](../../../../README.md) / [thirdparty](../README.md) / Thirdparty

# Variable: Thirdparty

> `const` **Thirdparty**: `object`

Defined in: [thirdparty.ts:195](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/wallet/src/thirdparty.ts#L195)

## Type Declaration

### fromEtherCamp()

> **fromEtherCamp**: (`passphrase`) => [`Wallet`](../../../../classes/Wallet.md)

Third Party API: Import a brain wallet used by Sila.Camp

#### Parameters

##### passphrase

`string`

#### Returns

[`Wallet`](../../../../classes/Wallet.md)

### fromEtherWallet()

> **fromEtherWallet**: (`input`, `password`) => `Promise`\<[`Wallet`](../../../../classes/Wallet.md)\>

#### Parameters

##### input

`string` | [`SilaWalletOptions`](../interfaces/SilaWalletOptions.md)

##### password

`string`

#### Returns

`Promise`\<[`Wallet`](../../../../classes/Wallet.md)\>

### fromQuorumWallet()

> **fromQuorumWallet**: (`passphrase`, `userid`) => [`Wallet`](../../../../classes/Wallet.md)

Third Party API: Import a brain wallet used by Quorum Wallet

#### Parameters

##### passphrase

`string`

##### userid

`string`

#### Returns

[`Wallet`](../../../../classes/Wallet.md)
