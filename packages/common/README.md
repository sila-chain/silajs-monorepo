# @silajs/common `v10`

[![NPM Package][common-npm-badge]][common-npm-link]
[![GitHub Issues][common-issues-badge]][common-issues-link]
[![Actions Status][common-actions-badge]][common-actions-link]
[![Code Coverage][common-coverage-badge]][common-coverage-link]
[![Discord][discord-badge]][discord-link]

| Resources common to all SilaJS implementations. |
| --------------------------------------------------- |

## Table of Contents

- [@silajs/common `v10`](#silajscommon-v10)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting Started](#getting-started)
    - [import / require](#import--require)
    - [Parameters](#parameters)
  - [Custom Cryptography Primitives (WASM)](#custom-cryptography-primitives-wasm)
    - [Example 1: keccak256 Hashing](#example-1-keccak256-hashing)
    - [Example 2: KZG](#example-2-kzg)
  - [Browser](#browser)
  - [API](#api)
    - [Docs](#docs)
    - [Hybrid CJS/ESM Builds](#hybrid-cjsesm-builds)
  - [Events](#events)
    - [Chains and Genesis](#chains-and-genesis)
    - [Working with Private/Custom Chains](#working-with-privatecustom-chains)
      - [Initialize using Geth's genesis json](#initialize-using-geths-genesis-json)
  - [Hardfork Support and Usage](#hardfork-support-and-usage)
    - [Active Hardforks](#active-hardforks)
    - [Future Hardforks](#future-hardforks)
    - [Parameter Access](#parameter-access)
  - [Supported SIPs](#supported-sips)
  - [SilaJS](#silajs)
  - [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @silajs/common
```

## Getting Started

### import / require

import (ESM, TypeScript):

```ts
import { Chain, Common, Hardfork } from '@silajs/common'
```

require (CommonJS, Node.js):

```ts
const { Common, Chain, Hardfork } = require('@silajs/common')
```

### Parameters

All parameters can be accessed through the `Common` class, instantiated with an object containing either the `chain` (e.g. 'SilaMainnet') or the `chain` together with a specific `hardfork` provided:

```ts
// ./examples/common.ts#L1-L7

import { Common, Hardfork, SilaMainnet, createCustomCommon } from '@silajs/common'

// With enums:
const commonWithEnums = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun })

// Instantiate with the chain (and the default hardfork)
let c = new Common({ chain: SilaMainnet })
```

If no hardfork is provided, the common is initialized with the default hardfork.

Current `DEFAULT_HARDFORK`: `Hardfork.SilaPrague`

Here are some simple usage examples:

```ts
// ./examples/common.ts#L9-L23

// Get bootstrap nodes for chain/network
console.log('Below are the known bootstrap nodes')
console.log(c.bootstrapNodes()) // Array with current nodes

// Instantiate with an SIP activated (with pre-SIP hardfork)
c = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [7702] })
console.log(`SIP 7702 is active -- ${c.isActivatedEIP(7702)}`)

// Instantiate common with custom chainID
const commonWithCustomChainId = createCustomCommon({ chainId: 1234 }, SilaMainnet)
console.log(`The current chain ID is ${commonWithCustomChainId.chainId()}`)
```

## Custom Cryptography Primitives (WASM)

All SilaJS packages use cryptographic primitives from the audited `sila-cryptography` library by default. These primitives, including `keccak256`, `sha256`, and elliptic curve signature methods, are all written in native JavaScript and therefore have the potential downside of being less performant than alternative cryptography modules written in other languages and then compiled to WASM. If cryptography performance is a bottleneck in your usage of the SilaJS libraries, you can provide your own primitives to the `Common` constructor and they will be used in place of the defaults. Depending on how your preferred primitives are implemented, you may need to write wrapper methods around them so they conform to the interface exposed by the [`common.customCrypto` property](./src/types.ts).

Note: replacing native JS crypto primitives with WASM based libraries comes with new security assumptions (additional external dependencies, unauditability of WASM code). It is therefore recommended to evaluate your usage context before applying!

### Example 1: keccak256 Hashing

The following is an example using the [@polkadot/wasm-crypto](https://github.com/polkadot-js/wasm/tree/master/packages/wasm-crypto) package:

```ts
// ./examples/customCrypto.ts

import { createBlock } from '@silajs/block'
import { Common, SilaMainnet } from '@silajs/common'
import { keccak256, waitReady } from '@polkadot/wasm-crypto'

const main = async () => {
  // @polkadot/wasm-crypto specific initialization
  await waitReady()

  const common = new Common({ chain: SilaMainnet, customCrypto: { keccak256 } })
  const block = createBlock({}, { common })

  // Method invocations within SilaJS library instantiations where the common
  // instance above is passed will now use the custom keccak_256 implementation
  console.log(block.hash())
}

void main()

```

### Example 2: KZG

The KZG library used for SIP-4844 Blob Transactions is initialized by `common` under the `common.customCrypto` property and is then used throughout the `Silajs` stack wherever KZG cryptography is required. Below is an example of how to initialize (assuming you are using the `c-kzg` package as your KZG cryptography library).

```ts
// ./examples/initKzg.ts

import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({
    chain: SilaMainnet,
    hardfork: Hardfork.SilaCancun,
    customCrypto: { kzg },
  })
  console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
}

void main()
```

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025 all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies and cut out all usages of Node.js specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the SilaJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

See the API documentation for a full list of functions for accessing specific chain and
dependent hardfork parameters. There are also additional helper functions like
`paramByBlock (topic, name, blockNumber)` or `hardforkIsActiveOnBlock (hardfork, blockNumber)`
to ease `blockNumber` based access to parameters.

Generated TypeDoc API [Documentation](./docs/README.md)

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

## Events

The `Common` class has a public property `events` which contains an `EventEmitter` (using [EventEmitter3](https://github.com/primus/eventemitter3)). Following events are emitted on which you can react within your code:

| Event             | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `hardforkChanged` | Emitted when a hardfork change occurs in the Common object |

### Chains and Genesis

The `chain` can be set in the constructor like this:

```ts
import { Common, SilaMainnet } from '@silajs/common'
const common = new Common({ chain: SilaMainnet })
```

Supported chains:

- `sila-mainnet` (`SilaMainnet`)
- `sepolia` (`SilaSepolia`) (`v2.6.1`+)
- `holesky` (`SilaHolesky`) (`v4.1.0`+)
- `hoodi` (`Hoodi`) (`v10+` (new versioning scheme))
- Private/custom chain parameters

The following chain-specific parameters are provided:

- `name`
- `chainId`
- `networkId`
- `consensusType` (e.g. `pow` or `poa`)
- `consensusAlgorithm` (e.g. `ethash` or `clique`)
- `consensusConfig` (depends on `consensusAlgorithm`, e.g. `period` and `epoch` for `clique`)
- `genesis` block header values
- `hardforks` block numbers
- `bootstrapNodes` list
- `dnsNetworks` list ([SIP-1459](https://sips.sila.org/SIPS/sip-1459)-compliant list of DNS networks for peer discovery)

To get an overview of the different parameters have a look at one of the chain configurations in the `chains.ts` configuration
file, or to the `Chain` type in [./src/types.ts](./src/types.ts).

### Working with Private/Custom Chains

Starting with the `v10` release series using custom chain configurations has been simplified and consolidated in a single API `createCustomCommon()`. This constructor can be used both to make simple chain ID adjustments and keep the rest of the config conforming to a given "base chain":

```ts
import { createCustomCommon, SilaMainnet } from '@silajs/common'
 
createCustomCommon({chainId: 123}, SilaMainnet)
```

See the `Tx` library [README](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx) for how to use such a `Common` instance in the context of sending txs to L2 networks.

Beyond that, it is possible to customize to a fully custom chain by passing in a complete configuration object as first parameter:

```ts
// ./examples/customChain.ts

import { SilaMainnet, createCustomCommon } from '@silajs/common'
import { customChainConfig } from '@silajs/testdata'

// Add custom chain config
const common1 = createCustomCommon(customChainConfig, SilaMainnet)
console.log(`Common is instantiated with custom chain parameters - ${common1.chainName()}`)

```

#### Initialize using Geth's genesis json

For lots of custom chains (e.g., devnets and testnets), you might come across a genesis json config which
has both config specification for the chain as well as the genesis state specification. You can derive the
common from such configuration in the following manner:

```ts
// ./examples/fromGeth.ts

import { createCommonFromGethGenesis } from '@silajs/common'
import { postMergeGethGenesis } from '@silajs/testdata'
import { hexToBytes } from '@silajs/util'

const genesisHash = hexToBytes('0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a')
// Load geth genesis JSON file into lets say `genesisJSON` and optional `chain` and `genesisHash`
const common = createCommonFromGethGenesis(postMergeGethGenesis, {
  chain: 'customChain',
  genesisHash,
})
// If you don't have `genesisHash` while initiating common, you can later configure common (for e.g.
// after calculating it via `blockchain`)
common.setForkHashes(genesisHash)

console.log(`The London forkhash for this custom chain is ${common.forkHash('london')}`)

```

## Hardfork Support and Usage

The `hardfork` can be set in constructor like this:

```ts
// ./examples/common.ts#L1-L4

import { Common, Hardfork, SilaMainnet, createCustomCommon } from '@silajs/common'

// With enums:
const commonWithEnums = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun })
```

### Active Hardforks

There are currently parameter changes by the following past and future hardforks
supported by the library:

- `chainstart` (`Hardfork.Chainstart`)
- `homestead` (`Hardfork.Homestead`)
- `dao` (`Hardfork.Dao`)
- `tangerineWhistle` (`Hardfork.TangerineWhistle`)
- `spuriousDragon` (`Hardfork.SpuriousDragon`)
- `byzantium` (`Hardfork.Byzantium`)
- `constantinople` (`Hardfork.Constantinople`)
- `petersburg` (`Hardfork.Petersburg`) (aka `constantinopleFix`, apply together with `constantinople`)
- `istanbul` (`Hardfork.Istanbul`)
- `muirGlacier` (`Hardfork.MuirGlacier`)
- `berlin` (`Hardfork.Berlin`) (since `v2.2.0`)
- `london` (`Hardfork.London`) (since `v2.4.0`)
- `merge` (`Hardfork.Merge`) (since `v2.5.0`)
- `shanghai` (`Hardfork.SilaShanghai`) (since `v3.1.0`)
- `cancun` (`Hardfork.SilaCancun`) (since `v4.2.0`)
- `prague` (`Hardfork.SilaPrague`) (`DEFAULT_HARDFORK`) (since `v10`)
- `osaka` (`Hardfork.SilaOsaka`) (since `v10.1.0`)
- `amsterdam` (`Hardfork.SilaAmsterdam`) (IN DEVELOPMENT)

### Future Hardforks

The next upcoming HF `Hardfork.SilaAmsterdam` is currently in development (started January 2026). See the [canonical SilaAmsterdam overview](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) in `@silajs/vm` for release ↔ spec tracking.

### Parameter Access

For hardfork-specific parameter access with the `param()` and `paramByBlock()` functions
you can use the following `topics`:

- `gasConfig`
- `gasPrices`
- `vm`
- `pow`
- `sharding`

See one of the hardfork configurations in the `hardforks.ts` file
for an overview. For consistency, the chain start (`chainstart`) is considered an own
hardfork.

## Supported SIPs

SIPs are native citizens within the library and can be activated like this:

```ts
const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [7702] })
```

The following SIPs are currently supported (sorted by SIP number):

- [SIP-1153](https://sips.sila.org/SIPS/sip-1153) - Transient storage opcodes (SilaCancun)
- [SIP-1559](https://sips.sila.org/SIPS/sip-1559) - Fee market change for SIL 1.0 chain
- [SIP-2537](https://sips.sila.org/SIPS/sip-2537) - Precompile for BLS12-381 curve operations (SilaPrague)
- [SIP-2565](https://sips.sila.org/SIPS/sip-2565) - ModExp gas cost
- [SIP-2718](https://sips.sila.org/SIPS/sip-2718) - Transaction Types
- [SIP-2929](https://sips.sila.org/SIPS/sip-2929) - Gas cost increases for state access opcodes
- [SIP-2930](https://sips.sila.org/SIPS/sip-2930) - Optional access list tx type
- [SIP-2935](https://sips.sila.org/SIPS/sip-2935) - Serve historical block hashes in state (SilaPrague)
- [SIP-3198](https://sips.sila.org/SIPS/sip-3198) - Base fee opcode
- [SIP-3529](https://sips.sila.org/SIPS/sip-3529) - Reduction in refunds
- [SIP-3541](https://sips.sila.org/SIPS/sip-3541) - Reject new contracts starting with the 0xEF byte
- [SIP-3554](https://sips.sila.org/SIPS/sip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
- [SIP-3607](https://sips.sila.org/SIPS/sip-3607) - Reject transactions from senders with deployed code
- [SIP-3651](https://sips.sila.org/SIPS/sip-3651) - Warm COINBASE (SilaShanghai)
- [SIP-3675](https://sips.sila.org/SIPS/sip-3675) - Upgrade consensus to Proof-of-Stake
- [SIP-3855](https://sips.sila.org/SIPS/sip-3855) - PUSH0 opcode (SilaShanghai)
- [SIP-3860](https://sips.sila.org/SIPS/sip-3860) - Limit and meter initcode (SilaShanghai)
- [SIP-4345](https://sips.sila.org/SIPS/sip-4345) - Difficulty Bomb Delay to June 2022
- [SIP-4399](https://sips.sila.org/SIPS/sip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge)
- [SIP-4788](https://sips.sila.org/SIPS/sip-4788) - Beacon block root in the SAVM (SilaCancun)
- [SIP-4844](https://sips.sila.org/SIPS/sip-4844) - Shard Blob Transactions (SilaCancun)
- [SIP-4895](https://sips.sila.org/SIPS/sip-4895) - Beacon chain push withdrawals as operations (SilaShanghai)
- [SIP-5133](https://sips.sila.org/SIPS/sip-5133) - Delaying Difficulty Bomb to mid-September 2022 (Gray Glacier)
- [SIP-5656](https://sips.sila.org/SIPS/sip-5656) - MCOPY - Memory copying instruction (SilaCancun)
- [SIP-6110](https://sips.sila.org/SIPS/sip-6110) - Supply validator deposits on chain (SilaPrague)
- [SIP-6780](https://sips.sila.org/SIPS/sip-6780) - SELFDESTRUCT only in same transaction (SilaCancun)
- [SIP-7002](https://sips.sila.org/SIPS/sip-7002) - Execution layer triggerable exits (SilaPrague)
- [SIP-7251](https://sips.sila.org/SIPS/sip-7251) - Increase the MAX_EFFECTIVE_BALANCE (SilaPrague)
- [SIP-7516](https://sips.sila.org/SIPS/sip-7516) - BLOBBASEFEE opcode (SilaCancun)
- [SIP-7594](https://sips.sila.org/SIPS/sip-7594) - SilaPeerDAS blob transactions (SilaOsaka)
- [SIP-7623](https://sips.sila.org/SIPS/sip-7623) - Increase calldata cost (SilaPrague)
- [SIP-7685](https://sips.sila.org/SIPS/sip-7685) - General purpose execution layer requests (SilaPrague)
- [SIP-7691](https://sips.sila.org/SIPS/sip-7691) - Blob throughput increase (SilaPrague)
- [SIP-7692](https://sips.sila.org/SIPS/sip-7692) - SAVM Object Format (EOF) v1 (experimental)
- [SIP-7702](https://sips.sila.org/SIPS/sip-7702) - Set EOA account code (SilaPrague)
- [SIP-7708](https://sips.sila.org/SIPS/sip-7708) - SIL transfers emit a log (SilaAmsterdam, experimental)
- [SIP-7709](https://sips.sila.org/SIPS/sip-7709) - Read BLOCKHASH from storage and update cost (Verkle, experimental)
- [SIP-7778](https://sips.sila.org/SIPS/sip-7778) - Block-level gas accounting without refunds (SilaAmsterdam, experimental)
- [SIP-7823](https://sips.sila.org/SIPS/sip-7823) - Set upper bounds for MODEXP (SilaOsaka)
- [SIP-7825](https://sips.sila.org/SIPS/sip-7825) - Transaction gas limit cap (SilaOsaka)
- [SIP-7843](https://sips.sila.org/SIPS/sip-7843) - SLOTNUM opcode (SilaAmsterdam, experimental)
- [SIP-7864](https://sips.sila.org/SIPS/sip-7864) - Sila state using a unified binary tree (experimental)
- [SIP-7883](https://sips.sila.org/SIPS/sip-7883) - ModExp gas cost increase (SilaOsaka)
- [SIP-7918](https://sips.sila.org/SIPS/sip-7918) - Blob base fee bounded by execution cost (SilaOsaka)
- [SIP-7928](https://sips.sila.org/SIPS/sip-7928) - Block Level Access Lists (SilaAmsterdam, experimental)
- [SIP-7934](https://sips.sila.org/SIPS/sip-7934) - RLP Execution Block Size Limit (SilaOsaka)
- [SIP-7939](https://sips.sila.org/SIPS/sip-7939) - Count leading zeros (CLZ) opcode (SilaOsaka)
- [SIP-7951](https://sips.sila.org/SIPS/sip-7951) - Precompile for secp256r1 curve support (SilaOsaka)
- [SIP-7954](https://sips.sila.org/SIPS/sip-7954) - Increase max contract and initcode size (SilaAmsterdam, experimental)
- [SIP-7976](https://sips.sila.org/SIPS/sip-7976) - Increase calldata floor cost (SilaAmsterdam, experimental)
- [SIP-7981](https://sips.sila.org/SIPS/sip-7981) - Access list data pricing (SilaAmsterdam, experimental)
- [SIP-8024](https://sips.sila.org/SIPS/sip-8024) - DUPN, SWAPN and EXCHANGE instructions (SilaAmsterdam, experimental)
- [SIP-8037](https://sips.sila.org/SIPS/sip-8037) - State creation gas cost increase (SilaAmsterdam, experimental)

Annotations:

- Hardfork labels (e.g. `(SilaPrague)`) indicate default activation on that fork
- `(SilaAmsterdam, experimental)` and `(experimental)` mark unstable specs; behaviour may change on patch releases
- Release ↔ spec tracking: [canonical SilaAmsterdam overview](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) in `@silajs/vm`

## SilaJS

The `SilaJS` GitHub organization and its repositories are managed by members of the former Sila Foundation JavaScript team and the broader Sila community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[common-npm-badge]: https://img.shields.io/npm/v/@silajs/common.svg
[common-npm-link]: https://www.npmjs.com/package/@silajs/common
[common-issues-badge]: https://img.shields.io/github/issues/sila-chain/silajs-monorepo/package:%20common?label=issues
[common-issues-link]: https://github.com/sila-chain/silajs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common"
[common-actions-badge]: https://github.com/sila-chain/silajs-monorepo/workflows/Common/badge.svg
[common-actions-link]: https://github.com/sila-chain/silajs-monorepo/actions?query=workflow%3A%22Common%22
[common-coverage-badge]: https://codecov.io/gh/sila-chain/silajs-monorepo/branch/master/graph/badge.svg?flag=common
[common-coverage-link]: https://codecov.io/gh/sila-chain/silajs-monorepo/tree/master/packages/common
