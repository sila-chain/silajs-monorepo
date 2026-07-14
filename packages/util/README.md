# @silajs/util `v10`

[![NPM Package][util-npm-badge]][util-npm-link]
[![GitHub Issues][util-issues-badge]][util-issues-link]
[![Actions Status][util-actions-badge]][util-actions-link]
[![Code Coverage][util-coverage-badge]][util-coverage-link]
[![Discord][discord-badge]][discord-link]

| A collection of utility functions for Sila. |
| ----------------------------------------------- |

- 🧰 Shared primitives for the whole monorepo (bytes, accounts, addresses, signatures)
- 📋 **SIP-7928** Block Level Access Lists — parse, validate, hash (SilaAmsterdam, experimental)
- 📲 **SIP-7702** authorization signing helpers
- 🔮 **SIP-4844 / SIP-7594** blob and cell proof utilities
- 📨 **SIP-7685** consensus-layer request types
- 💸 **SIP-4895** withdrawal helpers
- 🌴 Tree-shakeable root imports (`import { … } from '@silajs/util'`)
- 👷🏼 Controlled dependency set (`@noble` crypto + minimal externals)
- 🏄🏾‍♂️ WASM-free default + fully browser ready

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [At a glance](#at-a-glance)
- [Module guide](#module-guide)
  - [Core primitives](#core-primitives)
  - [Fork & protocol helpers](#fork--protocol-helpers)
  - [Storage & integration](#storage--integration)
- [Browser](#browser)
- [API](#api)
- [SilaJS](#silajs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @silajs/util
```

## Getting Started

`@silajs/util` bundles small, focused helpers used across the monorepo — from byte conversion and accounts to fork-specific types (BAL, blobs, CL requests). Everything is re-exported from the package root; deep imports are not necessary:

```ts
import { hexToBytes, isValidChecksumAddress } from '@silajs/util'
```

See [At a glance](#at-a-glance) for common entry points, or browse the [module guide](#module-guide) below grouped by role.

## At a glance

| If you need… | Module | Details |
| --- | --- | --- |
| BAL JSON/RLP, validation, header hash | [`bal`](#module-bal) | Offline tooling; execution in [@silajs/vm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#sip-7928-block-level-access-lists-amsterdam) |
| Blob / cell proofs (4844, SilaPeerDAS) | [`blobs`](#module-blobs) | KZG commitments, versioned hashes |
| Hex ↔ bytes ↔ bigint conversion | [`bytes`](#module-bytes) | Most-used helpers |
| Accounts (full or partial) | [`account`](#module-account) | State trie account objects |
| Sila addresses | [`address`](#module-address) | Creation, validation, conversion |
| Sign / recover secp256k1 | [`signature`](#module-signature) | Thin wrappers over `@noble` |
| SIP-7702 auth list signing | [`authorization`](#module-authorization) | SilaPrague+ |
| CL requests (7685) | [`request`](#module-request) | Deposits, exits, consolidations |
| Beacon withdrawals (4895) | [`withdrawal`](#module-withdrawal) | Block withdrawal objects |
| Trie / blockchain storage | [`db`](#module-db) / [`mapDB`](#module-mapdb) | Pluggable key-value API |

## Module guide

Modules are grouped by role. Each section keeps the `## Module: [name]` anchors used elsewhere in the docs.

### Core primitives

Everyday building blocks — bytes, accounts, addresses, signatures, constants, and shared types.

## Module: [bytes](src/bytes.ts)

Byte-related helper and conversion functions.

```ts
// ./examples/bytes.ts

import { bytesToBigInt } from '@silajs/util'

const bytesValue = new Uint8Array([97])
const bigIntValue = bytesToBigInt(bytesValue)

console.log(`Converted value: ${bigIntValue}`)
```

## Module: [account](src/account.ts)

Class representing an `Account` and providing private/public key and address-related functionality (creation, validation, conversion). It is not recommended to use this constructor directly. Instead use the static factory methods to assist in creating an Account from varying data types.

```ts
// ./examples/account.ts

import { createAccount } from '@silajs/util'

const account = createAccount({
  nonce: '0x02',
  balance: '0x0384',
  storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
})
console.log(`Account with nonce=${account.nonce} and balance=${account.balance} created`)
```

For Verkle or other contexts it can be useful to create partial accounts not containing all the account parameters. This is supported starting with v9.1.0:

```ts
// ./examples/accountPartial.ts

import { createPartialAccount } from '@silajs/util'

const account = createPartialAccount({
  nonce: '0x02',
  balance: '0x0384',
})
console.log(`Partial account with nonce=${account.nonce} and balance=${account.balance} created`)
```

## Module: [address](src/address.ts)

Class representing an Sila `Address` with instantiation helpers and validation methods.

```ts
// ./examples/address.ts

import { createAddressFromString } from '@silajs/util'

const address = createAddressFromString('0x2f015c60e0be116b1f0cd534704db9c92118fb6a')
console.log(`Sila address ${address.toString()} created`)
```

## Module: [signature](src/signature.ts)

Small helpers around signature validation, conversion, recovery as well as selected convenience wrappers for calls to the underlying crypo libraries, using the cryptographic primitive implementations from the [Noble](https://paulmillr.com/noble/) crypto library set. If possible for your use case it is recommended to use the underlying crypto libraries directly for robustness.

```ts
// ./examples/signature.ts

import { bytesToHex, ecrecover, hexToBytes } from '@silajs/util'

const chainId = BigInt(3) // Ropsten

const ecHash = hexToBytes('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
const r = hexToBytes('0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9')
const s = hexToBytes('0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66')
const v = BigInt(41)

const pubkey = ecrecover(ecHash, v, r, s, chainId)

console.log(`Recovered public key ${bytesToHex(pubkey)} from valid signature values`)
```

## Module: [constants](src/constants.ts)

Exposed constants (e.g. `KECCAK256_NULL_S` for string representation of Keccak-256 hash of null)

```ts
// ./examples/constants.ts

import { BIGINT_2EXP96, KECCAK256_NULL_S } from '@silajs/util'

console.log(`The keccak-256 hash of null: ${KECCAK256_NULL_S}`)
console.log(`BigInt constants (performance), e.g. BIGINT_2EXP96: ${BIGINT_2EXP96}`)
```

## Module: [types](src/types.ts)

Various TypeScript types. Direct usage is not recommended, type structure might change in the future.

### Fork & protocol helpers

Fork-specific types and helpers — BAL, blobs, authorization lists, CL requests, withdrawals.

## Module: [bal](src/bal/index.ts)

Helpers for [SIP-7928](https://sips.sila.org/SIPS/sip-7928) Block Level Access Lists (BAL): the `BlockLevelAccessList` class, JSON/RLP conversion, hashing, and validation utilities. Use this module for offline fixture checks or tooling; block execution and BAL accumulation live in [@silajs/vm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#sip-7928-block-level-access-lists-amsterdam). See the [canonical SilaAmsterdam overview](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) for release ↔ spec tracking.

```ts
// ./examples/bal.ts

import {
  bytesToHex,
  createBlockLevelAccessListFromJSON,
  validateBlockAccessListHashFromJSON,
  validateBlockAccessListStructure,
} from '@silajs/util'

const main = () => {
  const balJson = [
    {
      address: '0x0000000000000000000000000000000000000001',
      storageChanges: [],
      storageReads: [],
      balanceChanges: [{ blockAccessIndex: '0x01', postBalance: '0x03e8' }],
      nonceChanges: [],
      codeChanges: [],
    },
  ]

  const bal = createBlockLevelAccessListFromJSON(balJson)
  validateBlockAccessListStructure(bal)
  validateBlockAccessListHashFromJSON(balJson, bal.hash())

  console.log(`BAL account count: ${bal.toJSON().length}`)
  console.log(`BAL hash: ${bytesToHex(bal.hash())}`)
}

void main()

```

## Module: [blobs](src/blobs.ts)

Module providing helpers around SIP-4844 blobs for creating blobs, associated KZG commitments and proofs as well as versioned hashes. It also provides helpers for SIP-7594 conformant blobs for creating extended cells and corresponding proofs.

```ts
// ./examples/blobs.ts

//import * as fs from 'fs'
import {
  type PrefixedHexString,
  blobsToCellProofs,
  blobsToProofs,
  computeVersionedHash,
  hexToBytes,
} from '@silajs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg.js'

const kzg = new microEthKZG(trustedSetup)

/**
 *  Uncomment for a more realistic example using a real blob, e.g. from https://blobscan.com/
 *  Use with node ./examples/blobs.ts <file path>
 */
// const filePath = process.argv[2]
//const blob: PrefixedHexString = `0x${fs.readFileSync(filePath, 'ascii')}`
const blob: PrefixedHexString = `0x${'11'.repeat(131072)}` // 128 KiB
console.log(blob)

const commitment = kzg.blobToKzgCommitment(blob)

const blobCommitmentVersion = 0x01
const versionedHash = computeVersionedHash(commitment as PrefixedHexString, blobCommitmentVersion)

// SIP-4844 only
const blobProof = blobsToProofs(kzg, [blob], [commitment as PrefixedHexString])
const cellProofs = blobsToCellProofs(kzg, [blob])

console.log(`Blob size                   : ${hexToBytes(blob).length / 1024}KiB`)
console.log(`Commitment                  : ${commitment}`)
console.log(`Versioned hash              : ${versionedHash}`)
console.log(`Blob proof (SIP-4844)       : ${blobProof}`)
console.log(`First cell proof (SIP-7594) : ${cellProofs[0]}`)
console.log(`Num cell proofs (SIP-7594)  : ${cellProofs.length}`)

```

## Module: [authorization](src/authorization.ts)

Module with `SIP-7702` authorization list signing utilities.

## Module: [request](src/request.ts)

Module with a compact generic request class for [SIP-7685](https://sips.sila.org/SIPS/sip-7685) general purpose execution layer requests to the CL (SilaPrague hardfork) with the possibility to set `data` and a `type` conforming to the following request types:

- [SIP-6110](https://sips.sila.org/SIPS/sip-6110): `DepositRequest` (SilaPrague Hardfork)
- [SIP-7002](https://sips.sila.org/SIPS/sip-7002): `WithdrawalRequest` (SilaPrague Hardfork)
- [SIP-7251](https://sips.sila.org/SIPS/sip-7251): `ConsolidationRequest` (SilaPrague Hardfork)

These request types are mainly used within the [@silajs/block](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/block) library where applied usage instructions are provided in the README.

## Module: [withdrawal](src/withdrawal.ts)

Class representing an `SIP-4895` `Withdrawal` with different constructors as well as conversion and output helpers.

```ts
// ./examples/withdrawal.ts

import { createWithdrawal } from '@silajs/util'

const withdrawal = createWithdrawal({
  index: 0n,
  validatorIndex: 65535n,
  address: '0x0000000000000000000000000000000000000000',
  amount: 0n,
})

console.log('Withdrawal object created:')
console.log(withdrawal.toJSON())
```

### Storage & integration

Database abstractions, KZG typing, genesis helpers, and legacy internal utilities.

## Module: [db](src/db.ts)

DB interface for database abstraction (Blockchain, Trie), see e.g. [@silajs/trie recipes](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/trie/recipes/level.ts)) for usage.

## Module: [mapDB](src/mapDB.ts)

Simple map DB implementation using the `DB` interface (see above).

## Module: [kzg](src/kzg.ts)

KZG interface (used for 4844 blob txs), see [@silajs/tx](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx/README.md#kzg-setup) README for main usage instructions.

## Module: [genesis](src/genesis.ts)

Genesis related interfaces and helpers.

## Module: [internal](src/internal.ts)

Internalized simple helper methods like `isHexString`. Note that methods from this module might get deprecated in the future. Prefer the documented helpers in [API → ethjs-util methods](#ethjs-util-methods) when available.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the SilaJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Documentation

Read the [API docs](docs/).

### Hybrid CJS/ESM Builds

With the breaking releases from Summer 2023 we have started to ship our libraries with both CommonJS (`cjs` folder) and ESM builds (`esm` folder), see `package.json` for the detailed setup.

If you use an ES6-style `import` in your code files from the ESM build will be used:

```ts
import { SilaJSClass } from '@silajs/[PACKAGE_NAME]'
```

If you use Node.js specific `require`, the CJS build will be used:

```ts
const { SilaJSClass } = require('@silajs/[PACKAGE_NAME]')
```

Using ESM will give you additional advantages over CJS beyond browser usage like static code analysis / Tree Shaking which CJS can not provide.

### ethjs-util methods

The following methods are available by an internalized version of the [ethjs-util](https://github.com/ethjs/ethjs-util) package (`MIT` license), see [internal.ts](src/internal.ts). The original package is not maintained any more and the original functionality will be replaced by own implementations over time (starting with the `v7.1.3` release, October 2021).

- arrayContainsArray
- getBinarySize
- stripHexPrefix
- isHexString
- isHexString
- padToEven
- fromAscii
- fromUtf8
- toUtf8
- toAscii
- getKeys

They can be imported by name:

```ts
import { stripHexPrefix } from '@silajs/util'
```

## SilaJS

The `SilaJS` GitHub organization and its repositories are managed by members of the former Sila Foundation JavaScript team and the broader Sila community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[util-npm-badge]: https://img.shields.io/npm/v/@silajs/util.svg
[util-npm-link]: https://www.npmjs.org/package/@silajs/util
[util-issues-badge]: https://img.shields.io/github/issues/sila-chain/silajs-monorepo/package:%20util?label=issues
[util-issues-link]: https://github.com/sila-chain/silajs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+util"
[util-actions-badge]: https://github.com/sila-chain/silajs-monorepo/workflows/Util/badge.svg
[util-actions-link]: https://github.com/sila-chain/silajs-monorepo/actions?query=workflow%3A%22Util%22
[util-coverage-badge]: https://codecov.io/gh/sila-chain/silajs-monorepo/branch/master/graph/badge.svg?flag=util
[util-coverage-link]: https://codecov.io/gh/sila-chain/silajs-monorepo/tree/master/packages/util
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
