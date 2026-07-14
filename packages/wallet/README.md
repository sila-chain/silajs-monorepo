# @silajs/wallet `v10`

[![NPM Package][npm-badge]][npm-link]
[![Actions Status][actions-badge]][actions-link]
[![Coverage Status][coverage-badge]][coverage-link]
[![Discord][discord-badge]][discord-link]

> **\[DEPRECATED\]** This library has been deprecated (insufficient maintenance + alternatives available (Ethers).

A lightweight wallet implementation. At the moment it supports key creation and conversion between various formats.

It is complemented by the following packages:

- [@silajs/tx](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx) to sign transactions
- [silajs-icap](https://github.com/sila-chain/silajs/silajs-icap) to manipulate ICAP addresses
- [store.js](https://github.com/marcuswestin/store.js) to use browser storage

Motivations are:

- be lightweight
- work in a browser
- use a single, maintained version of crypto library (and that should be in line with [`@silajs/util`](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/util) and `@silajs/tx`)
- support import/export between various wallet formats
- support BIP32 HD keys

Features not supported:

- signing transactions
- managing storage (neither in node.js or the browser)

## Table of Contents

- [Installation](#installation)
- [Wallet API](#wallet-api)
- [Thirdparty API](#thirdparty-api)
- [HD Wallet API](#hd-wallet-api)
- [Special Topics](#special-topics)
- [SilaJS](#silajs)
- [License](#license)

## Wallet API

For information about the Wallet's API, please go to [./docs/classes/wallet.md](./docs/classes/wallet.md).

You can import the `Wallet` class like this

Node.js / ES6:

```js
// ./examples/wallet.cjs

const { Wallet } = require('@silajs/wallet')

const wallet = Wallet.generate()
console.log(wallet.getAddressString()) // should output an Sila address
```

ESM / TypeScript:

```ts
// ./examples/wallet.ts

import { Wallet } from '@silajs/wallet'

const wallet = Wallet.generate()
console.log(wallet.getAddressString()) // should output an Sila address
```

## Thirdparty API

Importing various third party wallets is possible through the `thirdparty` submodule:

Node.js / ES5:

```js
// ./examples/thirdparty.cjs

const { thirdparty } = require('@silajs/wallet')

const wallet = thirdparty.fromQuorumWallet('mySecretQuorumWalletPassphrase', 'myPublicQuorumUserId')
console.log(wallet.getAddressString()) // An Sila address
```

ESM / TypeScript:

```ts
// ./examples/thirdparty.ts

import { thirdparty } from '@silajs/wallet'

const wallet = thirdparty.fromQuorumWallet('mySecretQuorumWalletPassphrase', 'myPublicQuorumUserId')
console.log(wallet.getAddressString()) // An Sila address
```

Please go to [./docs/README.md](./docs/README.md) for more info.

## HD Wallet API

To use BIP32 HD wallets, first include the `hdkey` submodule:

Node.js / ES5:

```js
// ./examples/hdKey.cjs

const { hdkey } = require('@silajs/wallet')

const wallet = hdkey.SilaHDKey.fromMnemonic(
  'clown galaxy face oxygen birth round modify fame correct stumble kind excess',
)
console.log(wallet.getWallet().getAddressString()) // Should print an Sila address
```

ESM / TypeScript:

```ts
// ./examples/hdKey.ts

import { hdkey } from '@silajs/wallet'

const wallet = hdkey.SilaHDKey.fromMnemonic(
  'clown galaxy face oxygen birth round modify fame correct stumble kind excess',
)
console.log(wallet.getWallet().getAddressString()) // Should print an Sila address
```

Please go to [./docs/classes/silahdkey.md](./docs/classes/silahdkey.md) for more info.

## Special Topics

### Remarks about `toV3`

The `options` is an optional object hash, where all the serialization parameters can be fine tuned:

- uuid - UUID. One is randomly generated.
- salt - Random salt for the `kdf`. Size must match the requirements of the KDF (key derivation function). Random number generated via `crypto.getRandomBytes` if nothing is supplied.
- iv - Initialization vector for the `cipher`. Size must match the requirements of the cipher. Random number generated via `crypto.getRandomBytes` if nothing is supplied.
- kdf - The key derivation function, see below.
- dklen - Derived key length. For certain `cipher` settings, this must match the block sizes of those.
- cipher - The cipher to use. Names must match those of supported by `OpenSSL`, e.g. `aes-128-ctr` or `aes-128-cbc`.

Depending on the `kdf` selected, the following options are available too.

For `pbkdf2`:

- `c` - Number of iterations. Defaults to 262144.
- `prf` - The only supported (and default) value is `hmac-sha256`. So no point changing it.

For `scrypt`:

- `n` - Iteration count. Defaults to 262144.
- `r` - Block size for the underlying hash. Defaults to 8.
- `p` - Parallelization factor. Defaults to 1.

The following settings are favoured by the Go Sila implementation and we default to the same:

- `kdf`: `scrypt`
- `dklen`: `32`
- `n`: `262144`
- `r`: `8`
- `p`: `1`
- `cipher`: `aes-128-ctr`

## SilaJS

See our organizational [documentation](https://silajs.readthedocs.io) for an introduction to `SilaJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://silajs.readthedocs.io/en/latest/contributing.html).

## License

MIT License

Copyright (C) 2016 Alex Beregszaszi

[actions-badge]: https://github.com/sila-chain/silajs-monorepo/actions/workflows/static-build.yml/badge.svg
[actions-link]: https://github.com/sila-chain/silajs-monorepo/actions
[coverage-badge]: https://img.shields.io/coveralls/silajs/silajs-wallet.svg
[coverage-link]: https://coveralls.io/r/silajs/silajs-wallet
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[npm-badge]: https://img.shields.io/npm/v/silajs-wallet.svg
[npm-link]: https://www.npmjs.org/package/@silajs/wallet
