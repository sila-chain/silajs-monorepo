# @silajs/vm `v10`

[![NPM Package][vm-npm-badge]][vm-npm-link]
[![GitHub Issues][vm-issues-badge]][vm-issues-link]
[![Actions Status][vm-actions-badge]][vm-actions-link]
[![Code Coverage][vm-coverage-badge]][vm-coverage-link]
[![Discord][discord-badge]][discord-link]

| Execution Context for the Sila SAVM Implementation. |
| ------------------------------------------------------ |

Sila `sila-mainnet` compatible execution context for
[@silajs/savm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm)
to build and run blocks and txs and update state.

- 🦄 All hardforks up till **SilaOsaka** (**SilaAmsterdam** in development)
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (7 external + `@Noble` crypto)
- 🧩 Flexible SIP on/off engine
- 📲 **SIP-7702** ready
- 📋 **SIP-7928** Block Level Access Lists (SilaAmsterdam, experimental)
- 📬 Flexible state retrieval (Merkle, RPC,...)
- 🔎 Passes official #Sila tests
- 🛵 668KB bundle size (170KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Running a Transaction](#running-a-transaction)
  - [Running an RPC SilaMainnet Block](#running-an-rpc-sila-mainnet-block)
  - [Building a Block](#building-a-block)
  - [WASM Crypto Support](#wasm-crypto-support)
- [Examples](#examples)
- [Browser](#browser)
- [API](#api)
  - [Docs](#docs)
  - [Hybrid CJS/ESM Builds](#hybrid-cjsesm-builds)
- [Architecture](#architecture)
  - [VM/SAVM Relation](#vmevm-relation)
  - [State and Blockchain Information](#state-and-blockchain-information)
- [Setup](#setup)
  - [Chains](#chains)
  - [Hardforks](#hardforks)
  - [Custom Genesis State](#custom-genesis-state)
- [Supported SIPs](#supported-sips)
  - [SIP-4844 Shard Blob Transactions Support (SilaCancun)](#sip-4844-shard-blob-transactions-support-cancun)
  - [SIP-7702 EAO Code Transactions Support (SilaPrague)](#sip-7702-eao-code-transactions-support-prague)
  - [SIP-7685 Requests Support (SilaPrague)](#sip-7685-requests-support-prague)
  - [SIP-2935 Serve Historical Block Hashes from State (SilaPrague)](#sip-2935-serve-historical-block-hashes-from-state-prague)
  - [SilaAmsterdam hardfork (experimental)](#amsterdam-hardfork-experimental)
  - [SIP-7928 Block Level Access Lists (SilaAmsterdam)](#sip-7928-block-level-access-lists-amsterdam)
  - [SIP-8037 State creation gas cost increase (SilaAmsterdam)](#sip-8037-state-creation-gas-cost-increase-amsterdam)
- [Events](#events)
  - [Tracing Events](#tracing-events)
  - [Asynchronous event handlers](#asynchronous-event-handlers)
  - [Synchronous event handlers](#synchronous-event-handlers)
- [Understanding the VM](#understanding-the-vm)
- [Internal Structure](#internal-structure)
- [Development](#development)
- [SilaJS](#silajs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @silajs/vm
```

**Note:** Starting with the Dencun hardfork `SIP-4844` related functionality has become an integrated part of the SAVM functionality with the activation of the point evaluation precompile. For this precompile to work a separate installation of the KGZ library is necessary (we decided not to bundle due to large bundle sizes), see [KZG Setup](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

## Usage

### Running a Transaction

```ts
// ./examples/runTx.ts

import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createLegacyTx } from '@silajs/tx'
import { createAccount, createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@silajs/util'
import { createVM, runTx } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaShanghai })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 1_000_000_000n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const res = await runTx(vm, { tx })
  console.log(res.totalGasSpent) // 21000n - gas cost for simple SIL transfer
}

void main()
```

Additionally to the `VM.runTx()` method there is an API method `VM.runBlock()` which allows to run the whole block and execute all included transactions along.

### Receipts and event logs

`runTx()` and `runBlock()` surface logs through transaction receipts using the same [`Log`](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm#event-logs) tuple as `@silajs/savm`:

```ts
type Log = [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]
```

| API | Where to read logs |
| --- | --- |
| `runTx()` | `result.receipt.logs` (also `result.execResult.logs` before receipt assembly) |
| `runBlock()` | `result.results[i].receipt.logs` and `result.receipts[i].logs` |
| Block header bloom | `result.logsBloom` on `RunBlockResult`; `result.bloom` on each `RunTxResult` |

Logs from contract `LOG*` opcodes and fork-specific synthetic logs (e.g. [SIP-7708](#sip-7708-sil-transfer-and-burn-logs-amsterdam) transfer logs on SilaAmsterdam) share this path — no separate receipt field.

See [`examples/runTxTransferLogs.ts`](./examples/runTxTransferLogs.ts) for an SilaAmsterdam value transfer that decodes an SIP-7708 `Transfer` log from `receipt.logs`. For bytecode-level emission see [`@silajs/savm` Event logs](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm#event-logs) and [`examples/emitLogs.ts`](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm/examples/emitLogs.ts).

**Notes:**

- Reverted transactions produce receipts with **empty** `logs` (Byzantium+ `status: 0`).
- The debug logger sections below (`DEBUG=ethjs,...`) refer to **development tracing**, not SAVM event logs.

### Running an RPC SilaMainnet Block

It is possible to fetch a real sila-mainnet block via JSON-RPC and execute it locally using the VM together with the `RPCStateManager` from the `@silajs/statemanager` package, which fetches account and storage data on demand from a remote provider.

> **Note:** Running recent sila-mainnet blocks will generate **thousands of RPC requests** (one for each account/storage access during SAVM execution). Make sure your RPC provider can handle the load and be mindful of rate limits and quotas.

```ts
// ./examples/runBlockWithRPC.ts

import { createBlockFromJSONRPCProvider } from '@silajs/block'
import { Common, SilaMainnet } from '@silajs/common'
import { RPCStateManager } from '@silajs/statemanager'
import { bytesToHex } from '@silajs/util'
import { createVM, runBlock } from '@silajs/vm'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg.js'

const main = async () => {
  const providerUrl = process.argv[2]
  let blockNumber: bigint | undefined
  try {
    blockNumber = process.argv[3] !== undefined ? BigInt(process.argv[3]) : undefined
  } catch {
    // argument is not a valid block number
  }

  if (providerUrl === undefined || blockNumber === undefined) {
    console.log('Example skipped (real-world RPC scenario)')
    console.log('Usage: npx tsx runBlockWithRPC.ts <providerUrl> <blockNumber>')
    return
  }

  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({ chain: SilaMainnet, customCrypto: { kzg } })

  // 1. Fetch block from RPC
  console.log(`Fetching block ${blockNumber} from ${providerUrl}...`)
  const block = await createBlockFromJSONRPCProvider(providerUrl, blockNumber, {
    common,
    setHardfork: true,
  })

  console.log(`Block ${block.header.number} fetched successfully`)
  console.log(`  Hash:         ${bytesToHex(block.hash())}`)
  console.log(`  Parent hash:  ${bytesToHex(block.header.parentHash)}`)
  console.log(`  State root:   ${bytesToHex(block.header.stateRoot)}`)
  console.log(`  Transactions: ${block.transactions.length}`)
  console.log(`  Gas used:     ${block.header.gasUsed}`)
  console.log(`  Hardfork:     ${block.common.hardfork()}`)

  // 2. Set up RPC state manager pointing to the parent block (pre-state)
  const stateManager = new RPCStateManager({
    provider: providerUrl,
    blockTag: blockNumber - 1n,
    common,
  })

  // 3. Create VM with the RPC state manager
  const vm = await createVM({ common, stateManager, setHardfork: true })

  // 4. Run the block
  console.log(`\nRunning block ${blockNumber} (${block.transactions.length} txs)...`)
  const startTime = performance.now()

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipHeaderValidation: true,
    skipBlockValidation: true,
  })

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1)

  // 5. Display results
  console.log(`\nBlock execution completed in ${elapsed}s`)
  console.log(`  Tx results:     ${result.results.length}`)
  console.log(`  Receipts root:  ${bytesToHex(result.receiptsRoot)}`)

  console.log(`\n  Gas used:       ${result.gasUsed} (expected: ${block.header.gasUsed})`)
  if (result.gasUsed === block.header.gasUsed) {
    console.log(`  Gas used MATCHES expected block header value`)
  } else {
    console.log(`  Gas used MISMATCH`)
  }

  // Note: State root comparison is informational only.
  // RPCStateManager cannot produce valid Merkle state roots since it
  // doesn't maintain a local trie -- it fetches state on demand via RPC.
  console.log(`\n  Computed state root: ${bytesToHex(result.stateRoot)}`)
  console.log(`  Expected state root: ${bytesToHex(block.header.stateRoot)}`)
  console.log(`  (State root comparison is not meaningful with RPCStateManager,`)
  console.log(`   which does not maintain a local Merkle trie)`)
}

void main()

```

Run with:

```sh
npx tsx examples/runBlockWithRPC.ts <providerUrl> <blockNumber>
```

### Building a Block

The VM package can also be used to construct a new valid block by executing and then integrating txs one-by-one.

The following non-complete example gives some illustration on how to use the Block Builder API:

```ts
// ./examples/buildBlock.ts

import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createLegacyTx } from '@silajs/tx'
import { Account, bytesToHex, createAddressFromPrivateKey, hexToBytes } from '@silajs/util'
import { buildBlock, createVM } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaPrague })
  const vm = await createVM({ common })

  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
  const headerData = {
    number: 2n,
  }
  const blockBuilder = await buildBlock(vm, {
    parentBlock, // the parent @silajs/block Block
    headerData, // header values for the new block
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      freeze: false,
      skipConsensusFormatValidation: true,
      putBlockIntoBlockchain: false,
    },
  })

  const pk = hexToBytes('0x26f81cbcffd3d23eace0bb4eac5274bb2f576d310ee85318b5428bf9a71fc89a')
  const address = createAddressFromPrivateKey(pk)
  const account = new Account(0n, 0xfffffffffn)
  await vm.stateManager.putAccount(address, account) // create a sending account and give it a big balance
  const tx = createLegacyTx({ gasLimit: 0xffffff, gasPrice: 75n }).sign(pk)
  await blockBuilder.addTransaction(tx)

  // Add more transactions

  const { block } = await blockBuilder.build()
  console.log(`Built a block with hash ${bytesToHex(block.hash())}`)
}

void main()

```

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing or signature verification (for included txs). See `@silajs/common` [README](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

## Examples

See the [examples](./examples/) folder for different meaningful examples on how to use the VM package and invoke certain aspects of it, e.g. running a complete block, a certain tx or using event listeners, among others. Some noteworthy examples to point out:

1. [./examples/run-blockchain](./examples/run-blockchain.ts): Loads tests data, including accounts and blocks, and runs all of them in the VM.
2. [./examples/run-solidity-contract](./examples/run-solidity-contract.ts): Compiles a Solidity contract, and calls constant and non-constant functions.
3. [./examples/runBlockBalGenerate.ts](./examples/runBlockBalGenerate.ts): Runs an SilaAmsterdam block and reads the generated Block Level Access List (BAL).
4. [./examples/runBlockBalValidate.ts](./examples/runBlockBalValidate.ts): Validates a block against a provided BAL from an execution payload.
5. [./examples/runPoABlockFromTestdata.ts](./examples/runPoABlockFromTestdata.ts): Replays a bundled PoA block fixture offline (no RPC).
6. [./examples/runTxTransferLogs.ts](./examples/runTxTransferLogs.ts): Reads SIP-7708 `Transfer` logs from a transaction receipt on SilaAmsterdam.
7. [./examples/emitLogs.ts](../savm/examples/emitLogs.ts) (`@silajs/savm`): Emits a `LOG1` from bytecode via `runCode()`.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the SilaJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

For documentation on `VM` instantiation, exposed API and emitted `events` see generated [API docs](./docs/README.md).

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

## Architecture

### VM/SAVM Relation

Starting with the `VM` v6 version the inner Sila Virtual Machine core previously included in this library has been extracted to an own package [@silajs/savm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm).

It is still possible to access all `SAVM` functionality through the `savm` property of the initialized `vm` object, e.g.:

```ts
vm.savm.runCode()
vm.savm.events.on('step', function (data) {
  console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
})
```

Note that it's now also possible to pass in an own or customized `SAVM` instance by using the optional `savm` constructor option.

### State and Blockchain Information

With `VM` v7 a previously needed EEI interface for SAVM/VM communication is not needed any more and the API has been simplified, also see the respective SAVM README section. Most of the EEI related logic is now either handled internally or more generic functionality being taken over by the `@silajs/statemanager` package, with the `SAVM` now taking in both an (optional) `stateManager` and `blockchain` argument for the constructor (which the `VM` passes over by default).

With `VM` v6 the previously included `StateManager` has been extracted to its own package [@silajs/statemanager](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/statemanager). The `StateManager` package provides a unified state interface and it is now also possible to provide a modified or custom `StateManager` to the VM via the optional `stateManager` constructor option.

### Internal Module Map

The VM is a thin orchestration layer that drives the `SAVM` at the transaction and block level. Its core processing functions are free-standing (`runX(vm, opts)`), not methods:

- **`vm.ts`** — the `VM` class: holds the `savm`, `stateManager`, `blockchain`, `common` and `events`, and merges `paramsVM` into `Common`.
- **`runBlock.ts`** — `runBlock`: block-level processing (pre-state setup, transaction loop via `runTx`, withdrawals, requests, rewards, post-state validation). See [Internal Structure](#internal-structure) below for the step-by-step flow.
- **`runTx.ts`** — `runTx`: transaction-level rules (nonce/balance/intrinsic-gas checks, SIP-1559/4844/7702 handling, access-list warming), the call into `vm.savm.runCall`, refund/coinbase accounting and receipt generation (`generateTxReceipt`).
- **`buildBlock.ts`** — `buildBlock` / `BlockBuilder`: incremental block construction for block producers.
- **`consumeBal.ts`** — SIP-7928 block-level access list consumption.
- **`requests.ts`** — consensus-layer request (SIP-7685) extraction.
- **`bloom/`** — logs-bloom computation.
- **`params.ts`** — `paramsVM`, merged into `Common` at construction.
- **`types.ts`** / **`constructors.ts`** — public types/option objects and the `createVM` factory.

### Extension Points

The `VM` is customized through `createVM` / `VMOpts` (`src/types.ts:101`); most of its behavior is delegated to injectable collaborators:

- **Custom `SAVM`** — `savm?` (or `evmOpts?`): pass an `SAVM` you configured (e.g. with custom opcodes/precompiles — see the [SAVM extension points](../savm/README.md#extension-points)). If omitted, the VM creates one.
- **Custom state manager** — `stateManager?: StateManagerInterface` (`src/types.ts:27`): any `@silajs/statemanager` implementation or your own.
- **Custom blockchain** — `blockchain?` (`src/types.ts:31`): supplies block-hash lookups for the `BLOCKHASH`/`BLOBHASH` family; defaults to a minimal mock.
- **Custom `Common`** — `common?` (`src/types.ts:23`): chain/hardfork/SIP configuration, shared with the inner `SAVM`.
- **Custom parameters** — `params?: ParamsDict`: override `paramsVM` values.
- **Lifecycle hooks** — subscribe to `vm.events` (`beforeBlock`, `afterBlock`, `beforeTx`, `afterTx`) and `vm.savm.events` (`step`, `beforeMessage`, …) for tracing and instrumentation.

## Setup

### Chains
Beside the default Proof-of-Stake setup coming with the `Common` library default, the VM also support the execution of  both `Ethash/PoW` and `Clique/PoA` blocks and transactions to allow to re-execute blocks from older hardforks or testnets.

### Hardforks

For hardfork support see the [Hardfork Support](../savm#hardfork-support) section from the underlying `@silajs/savm` instance.

An explicit HF in the `VM` - which is then passed on to the inner `SAVM` - can be set with:

```ts
// ./examples/runTx.ts#L1-L8

import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createLegacyTx } from '@silajs/tx'
import { createAccount, createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@silajs/util'
import { createVM, runTx } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaShanghai })
  const vm = await createVM({ common })
```

### Custom Genesis State

For initializing a custom genesis state you can use the `genesisState` constructor option in the `Blockchain` and `VM` library in a similar way this had been done in the `Common` library before.

```ts
// ./examples/vmWithGenesisState.ts

import { Chain } from '@silajs/common'
import { getGenesis } from '@silajs/genesis'
import { createAddressFromString } from '@silajs/util'
import { createVM } from '@silajs/vm'

const main = async () => {
  const genesisState = getGenesis(Chain.SilaMainnet)

  const vm = await createVM()
  await vm.stateManager.generateCanonicalGenesis!(genesisState)
  const accountAddress = '0x000d836201318ec6899a67540690382780743280'
  const account = await vm.stateManager.getAccount(createAddressFromString(accountAddress))

  if (account === undefined) {
    throw new Error('Account does not exist: failed to import genesis state')
  }

  console.log(
    `This balance for account ${accountAddress} in this chain's genesis state is ${Number(
      account?.balance,
    )}`,
  )
}
void main()

```

Genesis state can be configured to contain both EOAs as well as (system) contracts with initial storage values set.

## Supported SIPs

It is possible to individually activate SIP support in the VM by instantiate the `Common` instance passed
with the respective SIPs, e.g.:

```ts
// ./examples/vmWithEIPs.ts

import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createVM } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [7702] })
  const vm = await createVM({ common })
  console.log(
    `SIP 7702 is active in isolation on top of the SilaCancun HF - ${vm.common.isActivatedEIP(7702)}`,
  )
}
void main()

```

For a list with supported SIPs see the [@silajs/savm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm) documentation.

### SIP-4844 Shard Blob Transactions Support (SilaCancun)

This library supports the blob transaction type introduced with [SIP-4844](https://sips.sila.org/SIPS/sip-4844). SIP-4844 comes with a dedicated opcode `BLOBHASH` and has added a new point evaluation precompile at address `0x0a`.

**Note:** Usage of the point evaluation precompile needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

### SIP-7702 EAO Code Transactions Support (SilaPrague)

This library support the execution of [SIP-7702](https://sips.sila.org/SIPS/sip-7702) EOA code transactions (see tx library for full documentation) with `runTx()` or the wrapping `runBlock()` execution methods, see [this test setup](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/test/api/SIPs/sip-7702.spec.ts) for a more complete example setup on how to run code from an EOA.

### SIP-7685 Requests Support (SilaPrague)

This library supports blocks including [SIP-7685](https://sips.sila.org/SIPS/sip-7685) requests to the consensus layer.

### SIP-2935 Serve Historical Block Hashes from State (SilaPrague)

Starting with `v8.1.0` the VM supports [SIP-2935](https://sips.sila.org/SIPS/sip-2935) which stores the latest 8192 block hashes in the storage of a system contract.

Note that this SIP has no effect on the resolution of the `BLOCKHASH` opcode, which will be a separate activation taking place by the integration of [SIP-7709](https://sips.sila.org/SIPS/sip-7709) in a respective Verkle/Stateless hardfork.

### SilaAmsterdam hardfork (experimental)

This section is the **canonical overview** for experimental SilaAmsterdam support: which library release maps to which spec snapshot, and where to read more. SilaAmsterdam remains unstable — expect further `10.1.x` releases as the spec and testnets evolve.

**Release ↔ spec tracking**

| Release | Summary | EST fixtures | Testnet |
| --- | --- | --- | --- |
| `v10.1.2` | First experimental SilaAmsterdam release: full 9-SIP `Hardfork.SilaAmsterdam` bundle, BAL builder/validator APIs (7928), two-dimensional block gas (8037); passes v700 mixed EST slice. | [tests-bal@v7.1.0](https://github.com/sila-chain/execution-specs/releases/tag/tests-bal@v7.1.0) | [BAL devnet-7](https://notes.sila.org/@ethpandaops/bal-devnet-7) |

The `Hardfork.SilaAmsterdam` bundle activates the following SIPs. SilaAmsterdam test fixtures and execution-spec tests typically enable the full set together rather than individual SIPs in isolation.

| SIP | Summary | Documentation |
| --- | --- | --- |
| [7708](https://sips.sila.org/SIPS/sip-7708) | SIL transfers and burns emit logs | [SAVM](#sip-7708-sil-transfer-and-burn-logs-amsterdam) (below), receipts from `runTx()` / `runBlock()` |
| [7843](https://sips.sila.org/SIPS/sip-7843) | `SLOTNUM` opcode + `slotNumber` header field | [@silajs/block](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/block#blocks-with-sip-7843-slot-number) |
| [7778](https://sips.sila.org/SIPS/sip-7778) | Block gas accounting without refund subtraction | [SIP-7778 note](#sip-7778-block-gas-accounting-amsterdam) (below) |
| [7928](https://sips.sila.org/SIPS/sip-7928) | Block Level Access Lists | [SIP-7928 section](#sip-7928-block-level-access-lists-amsterdam) (below) |
| [7954](https://sips.sila.org/SIPS/sip-7954) | Raised max contract / initcode size | [@silajs/savm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm#sip-7954-contract-and-initcode-size-limits-amsterdam) |
| [7976](https://sips.sila.org/SIPS/sip-7976) | Uniform calldata floor pricing | [@silajs/tx](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx#amsterdam-transaction-validation-sip-7976-sip-7981) |
| [7981](https://sips.sila.org/SIPS/sip-7981) | Access-list byte floor pricing | [@silajs/tx](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx#amsterdam-transaction-validation-sip-7976-sip-7981) |
| [8024](https://sips.sila.org/SIPS/sip-8024) | `DUPN`, `SWAPN`, `EXCHANGE` stack opcodes | [@silajs/savm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm#sip-8024-stack-opcodes-amsterdam) |
| [8037](https://sips.sila.org/SIPS/sip-8037) | Two-dimensional block gas + state-gas reservoir | [SIP-8037 section](#sip-8037-state-creation-gas-cost-increase-amsterdam) (below) |

**Activation:** `new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })`. See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for supported spec snapshots; behaviour may change on patch releases.

### SIP-7928 Block Level Access Lists (SilaAmsterdam)

[SIP-7928](https://sips.sila.org/SIPS/sip-7928) adds a block-level access list (BAL) committed via `blockAccessListHash` in the block header. When SIP-7928 is active, the VM accumulates state accesses automatically during `runBlock()` / `runTx()` — no extra opt-in flag is required. See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the EST / testnet snapshot this release targets.

**Activation:** use `Hardfork.SilaAmsterdam` (experimental).

**Block builder flow (`generate: true`):** execute the block, read `RunBlockResult.blockLevelAccessList`, and use the returned block from the `afterBlock` event — its header includes `blockAccessListHash` (set from `bal.hash()`).

```ts
// ./examples/runBlockBalGenerate.ts

import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createLegacyTx } from '@silajs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@silajs/util'
import { createVM, runBlock } from '@silajs/vm'

import type { AfterBlockEvent } from '@silajs/vm'

const main = async () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))

  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 10n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const block = createBlock(
    {
      header: { number: 2n, gasLimit: 30_000_000n, baseFeePerGas: 1n },
      transactions: [tx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
      calcDifficultyFromHeader: parentBlock.header,
    },
  )

  let afterBlock: AfterBlockEvent | undefined
  vm.events.once('afterBlock', (event) => {
    afterBlock = event
  })

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipBlockValidation: true,
  })

  const bal = result.blockLevelAccessList!
  console.log(`BAL accounts: ${bal.toJSON().length}`)
  console.log(`blockAccessListHash: ${bytesToHex(afterBlock!.block.header.blockAccessListHash!)}`)
  console.log(`hash matches result: ${bytesToHex(bal.hash())}`)
}

void main()

```

**Block validator flow:** pass the BAL from an execution payload via `RunBlockOpts.blockAccessList` (JSON, RLP bytes, or a `BlockLevelAccessList` instance). `runBlock()` validates structure and header hash before execution and checks equality against the generated list afterward.

```ts
// ./examples/runBlockBalValidate.ts

import { createBlock } from '@silajs/block'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createLegacyTx } from '@silajs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@silajs/util'
import { createVM, runBlock } from '@silajs/vm'

import type { Block } from '@silajs/block'

const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)

async function fundSender(vm: Awaited<ReturnType<typeof createVM>>) {
  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))
}

function createTransferBlock() {
  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 10n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  return createBlock(
    {
      header: { number: 2n, gasLimit: 30_000_000n, baseFeePerGas: 1n },
      transactions: [tx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
      calcDifficultyFromHeader: parentBlock.header,
    },
  )
}

const main = async () => {
  const vm = await createVM({ common })
  await fundSender(vm)

  let sealedBlock: Block | undefined
  vm.events.once('afterBlock', (event) => {
    sealedBlock = event.block
  })

  const generated = await runBlock(vm, {
    block: createTransferBlock(),
    generate: true,
    skipBlockValidation: true,
  })

  const balJson = generated.blockLevelAccessList!.toJSON()
  console.log(`Generated BAL with ${balJson.length} account(s)`)
  console.log(`blockAccessListHash: ${bytesToHex(sealedBlock!.header.blockAccessListHash!)}`)

  const vm2 = await createVM({ common })
  await fundSender(vm2)

  await runBlock(vm2, {
    block: sealedBlock!,
    blockAccessList: balJson,
    skipBlockValidation: true,
  })

  console.log('Provided blockAccessList validated successfully against execution')
}

void main()

```

**Offline parsing / validation:** see the [@silajs/util BAL module](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/util#module-bal) for `BlockLevelAccessList`, JSON/RLP helpers, and validation utilities.

**Notes:**

- SilaAmsterdam test fixtures often bundle additional SIPs (e.g. SIP-8037); use `Hardfork.SilaAmsterdam` rather than activating SIP-7928 in isolation.
- `buildBlock()` does not yet populate `blockAccessListHash` automatically — use `runBlock({ generate: true })` for now.

### SIP-8037 State creation gas cost increase (SilaAmsterdam)

See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the supported SilaAmsterdam spec snapshot.

[SIP-8037](https://sips.sila.org/SIPS/sip-8037) splits block gas into two independent dimensions — **regular** and **state** — and introduces a per-transaction **state-gas reservoir** for state-touching operations. When active, `runBlock()` and `runTx()` handle this automatically; no extra opt-in is required.

**Block-level gas used:** instead of summing a single `gasUsed`, the block header field becomes `max(block_regular_gas_used, block_state_gas_used)`. Each transaction contributes to both dimensions via `RunTxResult.txRegularGas` and `RunTxResult.txStateGas` (undefined when SIP-8037 is inactive).

**Pre-execution checks:** before running each tx, `runBlock()` verifies that the tx's regular and state gas contributions fit within the remaining capacity of each dimension (see `computeIntrinsicGasDimensions8037()` in `@silajs/savm` for the intrinsic split).

**`RunTxResult` fields (SIP-8037 active):**

| Field | Meaning |
| --- | --- |
| `txRegularGas` | Regular-dimension total for this tx (`max(raw_regular, calldata_floor)` per SIP-7623/SIP-7976) |
| `txStateGas` | State-dimension total (intrinsic state + execution state gas, net of create/selfdestruct refunds) |
| `blockGasSpent` | Amount counted toward block gas (see SIP-7778 below) |
| `totalGasSpent` | Amount actually paid by the sender (includes refund subtraction) |

**State-gas reservoir:** during execution the SAVM maintains `savm.stateGasReservoir`, initialized from the tx's state-gas budget. State-touching opcodes draw from the reservoir first; overflow spills into `gas_left`. The delta is reflected in `txStateGas`.

**Dependency:** SIP-8037 requires [SIP-7825](https://sips.sila.org/SIPS/sip-7825) (`maxTransactionGasLimit`) — both are active on `Hardfork.SilaAmsterdam`.

### SIP-7778 Block gas accounting (SilaAmsterdam)

See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the supported SilaAmsterdam spec snapshot.

[SIP-7778](https://sips.sila.org/SIPS/sip-7778) changes how gas refunds affect block-level accounting. `RunTxResult.totalGasSpent` is what the sender pays (refunds subtracted). `RunTxResult.blockGasSpent` is what counts toward the block header's `gasUsed` — under SIP-7778 this **does not** subtract tx-level refunds (`blockGasSpent = max(totalGasSpent, floorCost)`). Receipt `cumulativeGasUsed` still uses the pre-7778 refund semantics via a separate accumulator inside `runBlock()`.

### SIP-7708 SIL transfer and burn logs (SilaAmsterdam)

See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the supported SilaAmsterdam spec snapshot.

[SIP-7708](https://sips.sila.org/SIPS/sip-7708) adds synthetic logs for native SIL transfers and balance burns. When active, value-bearing `CALL`/`CREATE` paths and certain `SELFDESTRUCT`/account-removal flows append logs from the system address (`0xfff…fff`) with `Transfer(address,address,uint256)` or `Burn(address,uint256)` topics. These appear in `RunTxResult.receipt.logs` like any other log — no VM API changes are needed beyond using `Hardfork.SilaAmsterdam`. See [`examples/runTxTransferLogs.ts`](./examples/runTxTransferLogs.ts).

## Events

### Tracing Events

Our `TypeScript` VM emits events that support async listeners (using [EventEmitter3](https://github.com/primus/eventemitter3)).

You can subscribe to the following events:

- `beforeBlock`: Emits a `Block` right before running it.
- `afterBlock`: Emits `AfterBlockEvent` right after running a block.
- `beforeTx`: Emits a `Transaction` right before running it.
- `afterTx`: Emits a `AfterTxEvent` right after running a transaction.

Note, if subscribing to events with an async listener, specify the second parameter of your listener as a `resolve` function that must be called once your listener code has finished.

```ts
// ./examples/eventListener.ts#L10-L19

// Setup an event listener on the `afterTx` event
vm.events.on('afterTx', (event, resolve) => {
  console.log('asynchronous listener to afterTx', bytesToHex(event.transaction.hash()))
  // we need to call resolve() to avoid the event listener hanging
  resolve?.()
})

vm.events.on('afterTx', (event) => {
  console.log('synchronous listener to afterTx', bytesToHex(event.transaction.hash()))
})
```

Please note that there are additional SAVM-specific events in the [@silajs/savm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm) package.

### Asynchronous event handlers

You can perform asynchronous operations from within an event handler
and prevent the VM to keep running until they finish.

In order to do that, your event handler has to accept two arguments.
The first one will be the event object, and the second one a function.
The VM won't continue until you call this function.

If an exception is passed to that function, or thrown from within the
handler or a function called by it, the exception will bubble into the
VM and interrupt it, possibly corrupting its state. It's strongly
recommended not to do that.

### Synchronous event handlers

If you want to perform synchronous operations, you don't need
to receive a function as the handler's second argument, nor call it.

Note that if your event handler receives multiple arguments, the second
one will be the continuation function, and it must be called.

If an exception is thrown from within the handler or a function called
by it, the exception will bubble into the VM and interrupt it, possibly
corrupting its state. It's strongly recommended not to throw from within
event handlers.

## Understanding the VM

If you want to understand your VM runs we have added a hierarchically structured list of debug loggers for your convenience which can be activated in arbitrary combinations. We also use these loggers internally for development and testing. These loggers use the [debug](https://github.com/visionmedia/debug) library and can be activated on the CL with `DEBUG=ethjs,[Logger Selection] node [Your Script to Run].js` and produce output like the following:

![SilaJS VM Debug Logger](./debug.png?raw=true)

The following loggers are currently available:

| Logger      | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| `vm:block`  | Block operations (run txs, generating receipts, block rewards,...) |
| `vm:tx`     |  Transaction operations (account updates, checkpointing,...)       |
| `vm:tx:gas` |  Transaction gas logger                                            |
| `vm:state`  | StateManager logger                                                |

Note that there are additional SAVM-specific loggers in the [@silajs/savm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm) package.

Here are some examples for useful logger combinations.

Run one specific logger:

```shell
DEBUG=ethjs,vm:tx tsx test.ts
```

Run all loggers currently available:

```shell
DEBUG=ethjs,vm:*,vm:*:* tsx test.ts
```

Run only the gas loggers:

```shell
DEBUG=ethjs,vm:*:gas tsx test.ts
```

Excluding the state logger:

```shell
DEBUG=ethjs,vm:*,vm:*:*,-vm:state tsx test.ts
```

Run some specific loggers including a logger specifically logging the `SSTORE` executions from the VM (this is from the screenshot above):

```shell
DEBUG=ethjs,vm:tx,vm:savm,vm:ops:sstore,vm:*:gas tsx test.ts
```

## Internal Structure

The VM processes state changes at several levels:

- **[`runBlock`](./src/runBlock.ts)**: Processes a single block.
  - Performs initial setup: Validates hardfork compatibility, sets the state root (if provided), applies DAO fork logic if necessary.
  - Manages state checkpoints before and after processing.
  - Iterates through transactions within the block:
    - For each transaction, calls `runTx`.
  - Processes withdrawals (post-SilaShanghai/SIP-4895).
  - Calculates and assigns block rewards to the miner (and uncles, pre-Merge).
  - Finalizes the block state (state root, receipts root, logs bloom).
  - Commits or reverts state changes based on success.
- **[`runTx`](./src/runTx.ts)**: Processes a single transaction.
  - Performs pre-execution checks: Sender balance sufficient for gas+value, sender nonce validity, transaction gas limit against block gas limit, SIP activations (e.g., 2930 Access Lists, 1559 Fee Market, 4844 Blobs).
  - Warms up state access based on Access Lists (SIP-2929/2930).
  - Pays intrinsic gas cost.
  - Executes the transaction code using `vm.savm.runCall` (or specific logic for contract creation).
  - Calculates gas used and refunds remaining gas.
  - Transfers gas fees to the fee recipient (recipient receives all pre SIP-1559, base fee is burned post SIP-1559).
  - Generates a transaction receipt.
  - Manages state checkpoints and commits/reverts changes for the transaction.
- **[`vm.savm.runCall`](../savm/src/savm.ts)** (within `@silajs/savm`): Executes the SAVM code for a transaction (message call or contract creation).
  - Steps through SAVM opcodes.
  - Manages memory, stack, and storage changes.
  - Handles exceptions and gas consumption during execution.

Note: The process of iterating through the blockchain (block by block) is typically managed by components outside the core VM package, such as `@silajs/blockchain` or a full client implementation, which then utilize the VM's `runBlock` method.

## Development

Developer documentation - currently mainly with information on testing and debugging - can be found [here](./DEVELOPER.md).

## SilaJS

The `SilaJS` GitHub organization and its repositories are managed by members of the former Sila Foundation JavaScript team and the broader Sila community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[vm-npm-badge]: https://img.shields.io/npm/v/@silajs/vm.svg
[vm-npm-link]: https://www.npmjs.com/package/@silajs/vm
[vm-issues-badge]: https://img.shields.io/github/issues/sila-chain/silajs-monorepo/package:%20vm?label=issues
[vm-issues-link]: https://github.com/sila-chain/silajs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+vm"
[vm-actions-badge]: https://github.com/sila-chain/silajs-monorepo/workflows/VM/badge.svg
[vm-actions-link]: https://github.com/sila-chain/silajs-monorepo/actions?query=workflow%3A%22VM%22
[vm-coverage-badge]: https://codecov.io/gh/sila-chain/silajs-monorepo/branch/master/graph/badge.svg?flag=vm
[vm-coverage-link]: https://codecov.io/gh/sila-chain/silajs-monorepo/tree/master/packages/vm
