# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 10.1.2 - 2026-05-29

### Release round overview

Welcome to **`10.1.2`** — a coordinated release across all active `@silajs/*` libraries on the **`10.1.x`** line. If you have been following the upcoming SilaAmsterdam hardfork, this is our **first experimental preview** ready to try out: a largely complete **nine-SIP `Hardfork.SilaAmsterdam` bundle**, currently aligned with [tests-bal@v7.1.0](https://github.com/sila-chain/execution-specs/releases/tag/tests-bal@v7.1.0) and [BAL devnet-7](https://notes.sila.org/@ethpandaops/bal-devnet-7).

SilaAmsterdam is still in flux — **please do not use this in production yet** — and we expect further **`10.1.x`** releases as the spec and official tests evolve. The sections below cover **this package only**; for the full fork picture (SIP list, examples, release ↔ spec tracking), see the [@silajs/vm SilaAmsterdam overview](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental). On SilaOsaka or earlier hardforks? Nothing changes unless you explicitly select `Hardfork.SilaAmsterdam`.

### `@silajs/savm`

`@silajs/savm` is the low-level SAVM interpreter: opcodes, precompiles, gas metering, and message-call semantics. Within the `10.1.2` round, SilaAmsterdam changes land here first — new instructions, revised size limits, state-gas accounting inside the interpreter, and BAL footprint recording on `savm.blockLevelAccessList`. The VM wraps these details into `runBlock()` / `runTx()`; use the SAVM directly when building tracers, custom runners, or `runCall()`-style tools.

### At a glance

- **SIP-8024** stack opcodes `DUPN`, `SWAPN`, `EXCHANGE` with immediate validation at decode time.
- **SIP-7954** raised max contract code and initcode size (via `common.param('maxCodeSize')`).
- **SIP-8037** state-gas reservoir on the SAVM instance — state-touching ops draw from `savm.stateGasReservoir` before spilling into regular gas.
- **SIP-7708** synthetic `Transfer` / `Burn` logs on value-moving paths; **SIP-7843** `SLOTNUM` opcode.
- **SIP-7928** automatic state-access recording on `savm.blockLevelAccessList` when active.
- Custom precompile API improvements (`PrefixedHexString`, `getPrecompile`, exported types), see PR [#4261](https://github.com/sila-chain/silajs-monorepo/pull/4261).

### SilaAmsterdam (experimental)

> Behaviour may change in subsequent `10.1.x` patch releases.
> **Spec snapshot:** [tests-bal@v7.1.0](https://github.com/sila-chain/execution-specs/releases/tag/tests-bal@v7.1.0) · **Testnet:** [BAL devnet-7](https://notes.sila.org/@ethpandaops/bal-devnet-7)
> Fork overview: [SilaAmsterdam hardfork (experimental)](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental)

**SIP-8024** adds three stack-manipulation opcodes, each with a single-byte immediate (validated at decode — invalid immediates trap):

```ts
import { SAVM } from '@silajs/savm'
import { Common, Hardfork, SilaMainnet } from '@silajs/common'

const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaAmsterdam })
const savm = await SAVM.create({ common })

// DUPN/SWAPN/EXCHANGE behave like extended DUP/SWAP variants;
// gas: dupnGas / swapnGas / exchangeGas (default 3 each)
```

When **SIP-7928** is active, every state-touching operation appends to `savm.blockLevelAccessList` during `runCall()` / internal message execution. The VM reads this object after each transaction to build the block-level list. For BAL builder/validator flows see [@silajs/vm](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#sip-7928-block-level-access-lists-amsterdam).

Further SilaAmsterdam notes: [SIP-8024](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm#sip-8024-stack-opcodes-amsterdam), [SIP-7954](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm#sip-7954-contract-and-initcode-size-limits-amsterdam), [SIP-8037 / SIP-7708](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm#sip-8037-and-sip-7708-amsterdam).

### Changes

- SIP-8024 stack opcodes, see PR [#4248](https://github.com/sila-chain/silajs-monorepo/pull/4248), [#4302](https://github.com/sila-chain/silajs-monorepo/pull/4302)
- SIP-7954 max contract and initcode size, see PR [#4299](https://github.com/sila-chain/silajs-monorepo/pull/4299)
- SIP-8037 state-gas accounting and reservoir logic, see PR [#4285](https://github.com/sila-chain/silajs-monorepo/pull/4285), [#4293](https://github.com/sila-chain/silajs-monorepo/pull/4293), [#4301](https://github.com/sila-chain/silajs-monorepo/pull/4301), [#4304](https://github.com/sila-chain/silajs-monorepo/pull/4304)
- SIP-7708 / SIP-7843 execution changes, see PR [#4239](https://github.com/sila-chain/silajs-monorepo/pull/4239), [#4251](https://github.com/sila-chain/silajs-monorepo/pull/4251), [#4263](https://github.com/sila-chain/silajs-monorepo/pull/4263), [#4301](https://github.com/sila-chain/silajs-monorepo/pull/4301)
- SIP-7928 BAL accumulation during message execution, see PR [#4233](https://github.com/sila-chain/silajs-monorepo/pull/4233), [#4304](https://github.com/sila-chain/silajs-monorepo/pull/4304)

## 10.1.1 - 2025-01-28

- Ensure `codeAddress` in step event is correctly set, see PR [#4189](https://github.com/sila-chain/silajs-monorepo/pull/4189)
- BLS precompile optimizations and cleanup of unused operations, see PR [#4201](https://github.com/sila-chain/silajs-monorepo/pull/4201)
- Deprecate Node.js 18 support, minimum Node.js version is now 20, see PR [#4180](https://github.com/sila-chain/silajs-monorepo/pull/4180)
- Add Node.js 24 support, see PR [#4194](https://github.com/sila-chain/silajs-monorepo/pull/4194)
- Dependency update: `@noble/curves` to v2, see PR [#4179](https://github.com/sila-chain/silajs-monorepo/pull/4179)

## 10.1.0 - 2025-11-06

- Extended modexp precompile debug messages, PR [#4124](https://github.com/sila-chain/silajs-monorepo/pull/4124)
- More ArrayBuffer type assignment fixes, PR [#4109](https://github.com/sila-chain/silajs-monorepo/pull/4109)
- Cleanup unused dependencies and fix dependency categorization, PR [#4146](https://github.com/sila-chain/silajs-monorepo/pull/4146)
- Remove Verkle package support, PR [#4145](https://github.com/sila-chain/silajs-monorepo/pull/4145)

### SIP-7823 - Set upper bounds for MODEXP

The MODEXP precompile (address `0x05`) now enforces an upper bound of 8192 bits (1024 bytes) on each input field (base, exponent, modulus). If any input exceeds this limit, the precompile execution stops, returns an error, and consumes all gas. This change improves security and makes the precompile more suitable for future EVMMAX replacement.

```typescript
import { SAVM } from '@silajs/savm'
import { Common, Hardfork } from '@silajs/common'

const common = new Common({ chain: 'sila-mainnet', hardfork: Hardfork.SilaOsaka })
const savm = await SAVM.create({ common })

// MODEXP call with inputs exceeding 1024 bytes will now fail
// Inputs within the limit continue to work as before
```

### SIP-7883 - ModExp Gas Cost Increase

The MODEXP precompile gas cost calculation has been updated according to SIP-7883. The minimum gas cost has been increased from 200 to 500, and the pricing algorithm has been adjusted with increased complexity calculations for larger inputs. The multiplier for exponents larger than 32 bytes has been doubled from 8 to 16.

```typescript
import { SAVM } from '@silajs/savm'
import { Common, Hardfork } from '@silajs/common'

const common = new Common({ chain: 'sila-mainnet', hardfork: Hardfork.SilaOsaka })
const savm = await SAVM.create({ common })

// MODEXP calls will now consume more gas according to the new pricing formula
// The minimum cost is now 500 gas (previously 200)
```

### SIP-7939 - Count leading zeros (CLZ) opcode

A new opcode `CLZ` (0x1e) has been added that counts the number of leading zero bits in a 256-bit word. If the input is zero, it returns 256. The opcode has a gas cost of 5 gas.

```typescript
import { SAVM } from '@silajs/savm'
import { Common, Hardfork } from '@silajs/common'

const common = new Common({ chain: 'sila-mainnet', hardfork: Hardfork.SilaOsaka })
const savm = await SAVM.create({ common })

// CLZ opcode can be used in SAVM bytecode:
// PUSH1 0x01  // Push 1 to stack
// CLZ         // Count leading zeros: returns 255
// PUSH1 0x00  // Push 0 to stack  
// CLZ         // Returns 256
```

### SIP-7951 - Precompile for secp256r1 Curve Support

A new precompile `P256VERIFY` has been added at address `0x100` for ECDSA signature verification over the secp256r1 curve (also known as P-256 or prime256v1). This enables native support for signatures from modern secure hardware including Apple Secure Enclave, Android Keystore, and FIDO2/WebAuthn devices. The precompile costs 6900 gas and expects 160 bytes of input (32 bytes each for message hash, r, s, public key x, and public key y).

```typescript
import { SAVM } from '@silajs/savm'
import { Common, Hardfork } from '@silajs/common'
import { hexToBytes } from '@silajs/util'

const common = new Common({ chain: 'sila-mainnet', hardfork: Hardfork.SilaOsaka })
const savm = await SAVM.create({ common })

// P256VERIFY precompile usage:
// Input: 160 bytes = [msgHash (32) | r (32) | s (32) | qx (32) | qy (32)]
// Output: 32 bytes with 0x00...01 for valid signature, empty for invalid
const input = hexToBytes('0x...') // 160 bytes
const result = await savm.runCall({
  to: '0x0000000000000000000000000000000000000100',
  data: input,
  gasLimit: 10000n
})
```

## 10.0.0 - 2025-04-29

### Overview

This release is part of the `v10` breaking release round making the `SilaJS` libraries compatible with the [Pectra](https://sips.sila.org/SIPS/sip-7600) hardfork going live on Sila `sila-mainnet` on May 7 2025. Beside the hardfork update these releases mark a milestone in our release history since they - for the first time ever - bring the full `Sila` protocol stack - including the `SAVM` - to the browser without any restrictions anymore, coming along with other substantial updates regarding library security and functionality.

Some highlights:

- 🌴 Introduction of a tree-shakeable API
- 👷🏼 Substantial dependency reduction to a "controlled dependency set" (no more than 10 + `@Noble` crypto)
- 📲 **SIP-7702** readiness
- 🛵 Substantial bundle size reductions for all libraries
- 🏄🏾‍♂️ All libraries now pure JS being WASM-free by default
- 🦋 No more propriatary `Node.js` primitives

So: **All libraries now work in the browser "out of the box"**.

### Release Notes

Major release notes for this release can be found in the `alpha.1` release notes [here](https://github.com/sila-chain/silajs-monorepo/pull/3722#issuecomment-2792400268), with some additions along with the `RC.1` releases, see [here](https://github.com/sila-chain/silajs-monorepo/pull/3886#issuecomment-2748966923).

### Changes since `RC.1`

- Fix inconsistent memory expansion behavior along `step` event, PR [#3953](https://github.com/sila-chain/silajs-monorepo/pull/3953)
- Error related renamings for consistency reasons, PRs [#3968](https://github.com/sila-chain/silajs-monorepo/pull/3968), [#3994](https://github.com/sila-chain/silajs-monorepo/pull/3994) and [#4033](https://github.com/sila-chain/silajs-monorepo/pull/4033):
  - `ERROR` -> `EVMErrorMessage` (Error messages)
  - `SavmError` -> `EVMError` (Error class)
  - EOF related error renamings
- Upgrade `@noble/curves` to `1.9.0`, PR [#4018](https://github.com/sila-chain/silajs-monorepo/pull/4018)
- Add JSON tracing to `t8n` in compliance with `SIP-7756`, PRs [#3953](https://github.com/sila-chain/silajs-monorepo/pull/3953) and [#4027](https://github.com/sila-chain/silajs-monorepo/pull/4027)

## 10.0.0-rc.1 - 2025-03-24

This is the first (and likely the last) round of `RC` releases for the upcoming breaking releases, following the `alpha` releases from October 2024 (see `alpha` release release notes for full/main change description). The releases are somewhat delayed (sorry for that), but final releases can now be expected very very soon, to be released once the Sila [Pectra](https://sips.sila.org/SIPS/sip-7600) hardfork is scheduled for sila-mainnet and all SIPs are fully finalized. Pectra will then also be the default hardfork setting for all SilaJS libraries.

### New Versioning Scheme

This breaking release round will come with a new versioning scheme (thanks to paulmillr for the [suggestion](https://github.com/sila-chain/silajs-monorepo/issues/3748)), aligning the package numbers on breaking releases for all SilaJS packages. This will make it easier to report bugs ("bug happened on SilaJS version 10 releases"), reason about release series and make library compatibility more transparent and easier to grasp.

As a start we bump all major release versions to version 10, these `RC` releases are the first to be released with the new versioning scheme.

### Native Node.js EventEmitter Replacement

We removed the last remaining internal Node.js utility dependency to make the packages more browser friendly and replace the native Node.js `EventEmitter` by using the [eventemitter3](https://github.com/primus/eventemitter3) package as a replacement, see PR [#3746](https://github.com/sila-chain/silajs-monorepo/pull/3746).

The new package is meant to be more performant while remaining almost entirely API compatible with native Node.js event emitters.

If you directly import the Node.js event emitter, you need to switch your imports to:

```ts
import { EventEmitter } from 'events' // old
import { EventEmitter } from 'eventemitter3' // new
```

The new event emitter package also made it possible to remove/replace the separate async event emitter custom integration and use the new package here as well.

For listening to async SAVM events like `step` or VM events like `newContract` or `afterTx` API slightly changed and it is now needed to take the `resolve` parameter in on listening and explicitly call at the end of the event handling:

```ts
savm.events.on('beforeMessage', (event) => {
  console.log('synchronous listener to beforeMessage', event)
})
savm.events.on('afterMessage', (event, resolve) => {
  console.log('asynchronous listener to beforeMessage', event)
  // we need to call resolve() to avoid the event listener hanging
  resolve?.()
})
```

### SilaJS-wide Error Objects

We have done preparations to allow for handling specific error sub types in the future by introducing a monorepo-wide `SilaJSError` error class in the `@silajs/util` package, see PR [#3879](https://github.com/sila-chain/silajs-monorepo/pull/3879). This error is thrown for all error cases within the monorepo and can be specifically handled by comparing with `instanceof SilaJSError`.

We will introduce a set of more specific sub error classes inheriting from this generic type in upcoming minor releases, and so keeping things fully backwards compatible. This will allow for a more specific and robust handling of errors thrown by SilaJS libraries.

### Verkle Updates (experimental)

- New method to generate a verkle execution witness, PR [#3864](https://github.com/sila-chain/silajs-monorepo/pull/3864)
- Migrate verkle `AccessWitness` from StateManager to SAVM (experimental), PR [#3770](https://github.com/sila-chain/silajs-monorepo/pull/3770)
- Simplify/rename verkle access witness methods, PR [#3830](https://github.com/sila-chain/silajs-monorepo/pull/3830)
- Verkle updates, PR [#3832](https://github.com/sila-chain/silajs-monorepo/pull/3832)

### Other Changes

- Various EOF fixes and spec updates, PR [#3568](https://github.com/sila-chain/silajs-monorepo/pull/3568)
- Fix `PUSHN` non-compliance issue, PR [#3863](https://github.com/sila-chain/silajs-monorepo/pull/3863)
- Remove unused params from common, PR [#3836](https://github.com/sila-chain/silajs-monorepo/pull/3836)
- Update `sila-cryptography` from `3.0.0` -> `3.1.0` (also for other packages), PR [#3859](https://github.com/sila-chain/silajs-monorepo/pull/3859)

## 4.0.0-alpha.1 - 2024-10-17

This is a first round of `alpha` releases for our upcoming breaking release round with a focus on bundle size (tree shaking) and security (dependencies down + no WASM (by default)). Note that `alpha` releases are not meant to be fully API-stable yet and are for early testing only. This release series will be then followed by a `beta` release round where APIs are expected to be mostly stable. Final releases can then be expected for late October/early November 2024.

### Renamings

#### Static Constructors

The static constructors for our library classes have been reworked to now be standalone methods (with a similar naming scheme). This allows for better tree shaking of unused constructor code (see PR [#3516](https://github.com/sila-chain/silajs-monorepo/pull/3516)):

- `SAVM.create()` -> `createEVM`

### Pure JavaScript SAVM (no default WASM)

This is the first SilaJS SAVM release where we could realize a fully WASM-free SAVM by default! 🤩 We were finally able to replace all crypto primitives which still relied on Web Assembly code with pure JavaScript/TypeScript pendants, thanks a lot to @paulmillr from Noble for the cooperation on this! ❤️

Together with a strong dependency reduction being accomplished along this release this opens up for new use cases for the JavaScript SAVM in more security sensitive contexts. The code of the SAVM is now compact enough that it gets fully auditable (and we plan an SAVM audit for 2025), see e.g. [here](https://gist.github.com/holgerd77/2c032488196b4afee5d976dc85ee70eb) for an SAVM bundle snapshot including _all_ dependencies!

So, what changed?

#### Generic BN254 (alt_BN128) Interface for Precompiles

The previously WASM-backed `BN254` (or previously called `alt_BN128`) precompile implementations have first decoupled from the WASM-backend by introducing a generic interface `EVMBN254Interface`, see PR [#3564](https://github.com/sila-chain/silajs-monorepo/pull/3564). Then the WASM version - using the [rustbn-wasm](https://github.com/sila-chain/silajs/rustbn-wasm) binding library to the [BN](https://github.com/paritytech/bn) Rust library - has been replaced by using the corresponding JS functionality from [noble-curves](https://github.com/paulmillr/noble-curves).

It is still possible to use the WASM version (if more performance is needed) like this using the `bn254` constructor option:

```ts
import { initRustBN } from 'rustbn-wasm'

const bn254 = await initRustBN()
const savm = await createEVM({ bn254: new RustBN254(bn254) })
```

#### JavaScript KZG Support

The WASM based KZG integration for 4844 support and usage for the SAVM KZG point evaluation precompile has been replaced with a pure JS-based solution ([micro-sil-singer](https://github.com/paulmillr/micro-sil-signer), see PR [#3674](https://github.com/sila-chain/silajs-monorepo/pull/3674). The JS version is indeed even faster then the WASM one (we benchmarked), so we recommend to just switch over!

KZG is one-time initialized by providing to `Common`, in the updated version now like this:

```ts
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg'

const kzg = new microEthKZG(trustedSetup)
// Pass the following Common to the SilaJS library
const common = new Common({
  chain: SilaMainnet,
  customCrypto: {
    kzg,
  },
})
```

Note that you _need_ to provide this if you want to have a fully `SilaShanghai/SilaCancun` compliant SAVM (otherwise the KZG precompile will not work if called)!

#### Own SAVM Parameter Set

HF-sensitive parameters like `maxInitCodeSize` were previously by design all provided by the `@silajs/common` library. This meant that all parameter sets were shared among the libraries and libraries carried around a lot of unnecessary parameters.

With the `Common` refactoring from PR [#3537](https://github.com/sila-chain/silajs-monorepo/pull/3537) parameters now moved over to a dedicated `params.ts` file (exposed as e.g. `paramsEVM`) within the parameter-using library and the library sets its own parameter set by internally calling a new `Common` method `updateParams()`. For shared `Common` instances parameter sets then accumulate as needed.

Beside having a lighter footprint this additionally allows for easier parameter customization. There is a new `params` constructor option which leverages this new possibility and where it becomes possible to provide a fully customized set of core library parameters.

### New Common API

There is a new Common API for simplification and better tree shaking, see PR [#3545](https://github.com/sila-chain/silajs-monorepo/pull/3545). Change your `Common` initializations as follows (see `Common` release for more details):

```ts
// old
import { Chain, Common } from '@silajs/common'
const common = new Common({ chain: Chain.SilaMainnet })

// new
import { Common, SilaMainnet } from '@silajs/common'
const common = new Common({ chain: SilaMainnet })
```

### Mega EOF Support (Experimental)

This is one of the few big SIP additions within this breaking release series: Jochem has re-taken upon EOF and fully implemented the new Mega EOF specification, see [#3440](https://github.com/sila-chain/silajs-monorepo/pull/3440) and [#3553](https://github.com/sila-chain/silajs-monorepo/pull/3553)! ❤️ Note that - while most code should be there in its final form - the implementation is still marked as `experimental` - since there are still various moving parts within EOF.

It would get too extensive to fully recite the functional changes here. If you are interested in EOF please have a look at the above linked core implementation PR and see the SAVM [examples](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/savm/examples) folder for EOF usage examples.

### TypeScript: Use generic StateManagerInterface

The dedicated `EVMStateManagerInterface` has been removed and the SAVM now uses the generic `StateManagerInterface` (located in the `@silajs/util` package for re-usability reasons), see PR [#3543](https://github.com/sila-chain/silajs-monorepo/pull/3543). This comes along with some refactoring and adjustments on the interface itself (see `@silajs/statemanager` release notes for more details).

This simplifies the `StateManager` usage and allows for easier swapping between different state managers (stateful/stateless, Verkle/Merkle, RPC).

### Other Breaking Changes

- New `SimpleStateManager` as default state manager (reduces bundle size), PR [#3482](https://github.com/sila-chain/silajs-monorepo/pull/3482)
- New default hardfork: `SilaShanghai` -> `SilaCancun`, see PR [#3566](https://github.com/sila-chain/silajs-monorepo/pull/3566)
- Removed `SIP-3074` (AUTH / AUTHCALL opcodes) support, since superseded by `SIP-7702`, PR [#3582](https://github.com/sila-chain/silajs-monorepo/pull/3582)
- Rename `ec*` BN254 (aka alt_bn128) precompile parameters and names to `bn254*` (e.g. param `ecAddGas` -> `bn254AddGas`, name `ECMUL` -> `BN254MUL`), partly also BLS name alignment, PR [#3655](https://github.com/sila-chain/silajs-monorepo/pull/3655)

### Other Changes

- Upgrade to TypeScript 5, PR [#3607](https://github.com/sila-chain/silajs-monorepo/pull/3607)
- Node 22 support, PR [#3669](https://github.com/sila-chain/silajs-monorepo/pull/3669)
- Upgrade `sila-cryptography` to v3, PR [#3668](https://github.com/sila-chain/silajs-monorepo/pull/3668)
- Fix BLS usage for BLS12-381 precompiles, PR [#3623](https://github.com/sila-chain/silajs-monorepo/pull/3623)
- kaustinen7 verkle testnet preparation (update verkle leaf structure -> BASIC_DATA), PR [#3433](https://github.com/sila-chain/silajs-monorepo/pull/3433)

## 3.1.0 - 2024-08-15

### SIP-2537 BLS Precompiles (SilaPrague)

Starting with this release the SAVM support the BLS precompiles introduced with [SIP-2537](https://sips.sila.org/SIPS/sip-2537). These precompiles run natively using the [@noble/curves](https://github.com/paulmillr/noble-curves) library (❤️ to `@paulmillr`!), see PRs [#3350](https://github.com/sila-chain/silajs-monorepo/pull/3350) and [#3471](https://github.com/sila-chain/silajs-monorepo/pull/3471).

An alternative WASM implementation (using [bls-wasm](https://github.com/herumi/bls-wasm)) can be optionally used like this if needed for performance reasons:

```ts
import { SAVM, MCLBLS } from '@silajs/savm'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.SilaPrague })
await mcl.init(mcl.BLS12_381)
const mclbls = new MCLBLS(mcl)
const savm = await SAVM.create({ common, bls })
```

### Verkle Dependency Decoupling

We have relatively light-heartedly added a new `@silajs/verkle` main dependency to the VM/SAVM stack in the `v7.2.1` release, which added an additional burden to the bundle size by several hundred KB and additionally draws in unnecessary WASM code. Coupling with Verkle has been refactored in PR [#3462](https://github.com/sila-chain/silajs-monorepo/pull/3462) and the direct dependency has been removed again.

An update to this release is therefore strongly recommended even if other fixes or features are not that relevant for you right now.

### Verkle Updates

- Adds ability to run [SIP-7702](https://sips.sila.org/SIPS/sip-7702) EOA code transactions (see tx library for full documentation), see PR [#3470](https://github.com/sila-chain/silajs-monorepo/pull/3470)
- Fixes for Kaustinen4 support, PR [#3269](https://github.com/sila-chain/silajs-monorepo/pull/3269)
- Kaustinen5 related fixes, PR [#3343](https://github.com/sila-chain/silajs-monorepo/pull/3343)
- Kaustinen6 adjustments, `verkle-cryptography-wasm` migration, PRs [#3355](https://github.com/sila-chain/silajs-monorepo/pull/3355) and [#3356](https://github.com/sila-chain/silajs-monorepo/pull/3356)
- Update `kzg-wasm` to `0.4.0`, PR [#3358](https://github.com/sila-chain/silajs-monorepo/pull/3358)
- Shift Verkle to `osaka` hardfork, PR [#3371](https://github.com/sila-chain/silajs-monorepo/pull/3371)
- Fix `accessWitness` passing, PR [#3405](https://github.com/sila-chain/silajs-monorepo/pull/3405)
- Remove the hacks to prevent account cleanups of system contracts, PR [#3418](https://github.com/sila-chain/silajs-monorepo/pull/3418)
- Fix SIP-2935 address conversion issues, PR [#3447](https://github.com/sila-chain/silajs-monorepo/pull/3447)

### Other Features

- Add support for retroactive [SIP-7610](https://sips.sila.org/SIPS/sip-7610), PR [#3480](https://github.com/sila-chain/silajs-monorepo/pull/3480)
- Adds bundle visualizer (to be used with `npm run visualize:bundle`), PR [#3463](https://github.com/sila-chain/silajs-monorepo/pull/3463)
- Stricter prefixed hex typing, PRs [#3348](https://github.com/sila-chain/silajs-monorepo/pull/3348), [#3427](https://github.com/sila-chain/silajs-monorepo/pull/3427) and [#3357](https://github.com/sila-chain/silajs-monorepo/pull/3357) (some changes removed in PR [#3382](https://github.com/sila-chain/silajs-monorepo/pull/3382) for backwards compatibility reasons, will be reintroduced along upcoming breaking releases)

### Other Changes

- Removes support for [SIP-2315](https://sips.sila.org/SIPS/sip-2315) simple subroutines for SAVM (deprecated with an alternative version integrated into EOF), PR [#3342](https://github.com/sila-chain/silajs-monorepo/pull/3342)
- Update `mcl-wasm` Dependency (Esbuild Issue), PR [#3461](https://github.com/sila-chain/silajs-monorepo/pull/3461)

### Bugfixes

- BLS precompile fixes, PR [#3400](https://github.com/sila-chain/silajs-monorepo/pull/3400)
- Ignore precompile addresses for some target access events, PR [#3366](https://github.com/sila-chain/silajs-monorepo/pull/3366)

## 3.0.0 - 2024-03-18

### New SAVM.create() Async Static Constructor

This is an in-between breaking release on both the SAVM and VM packages due to a problematic top level await() discovery in the underlying `rustbn-wasm` library (see issue [#10](https://github.com/sila-chain/silajs/rustbn-wasm/issues/10)) generally affecting the compatibility of our libraries.

The `SAVM` direct constructor initialization with `new SAVM()` now has been deprecated and replaced by an async static `create()` constructor, as it is already done in various other libraries in the SilaJS monorepo, see PRs [#3304](https://github.com/sila-chain/silajs-monorepo/pull/3304/) and [#3315](https://github.com/sila-chain/silajs-monorepo/pull/3315).

An SAVM is now initialized like the following (from our `examples`):

```ts
import { hexToBytes } from '@silajs/util'
import { SAVM } from '@silajs/savm'

const savm = await SAVM.create()
const res = await savm.runCode({ code: hexToBytes('0x6001') })
```

Beyond solving this specific problem this generally allows for a cleaner and async-complete initialization of underlying libraries and is more future proof towards eventual upcoming async initialization additions.

Note that the direct usage of the main constructor is not possible anymore with these releases and **you need to update your constructor usages**!

### Full 4844 Browser Readiness

#### WASM KZG

Shortly following the "Dencun Hardfork Support" release round from last month, this is now the first round of releases where the SilaJS libraries are now fully browser compatible regarding the new 4844 functionality, see PRs [#3294](https://github.com/sila-chain/silajs-monorepo/pull/3294) and [#3296](https://github.com/sila-chain/silajs-monorepo/pull/3296)! 🎉

Our WASM wizard @acolytec3 has spent the last two weeks and created a WASM build of the [c-kzg](https://github.com/benjaminion/c-kzg) library which we have released under the `kzg-wasm` name on npm (and you can also use independently for other projects). See the newly created [GitHub repository](https://github.com/sila-chain/silajs/kzg-wasm) for some library-specific documentation.

This WASM KZG library can now be used for KZG initialization (replacing the old recommended `c-kzg` initialization), see the respective [README section](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/tx/README.md#kzg-initialization) from the tx library for usage instructions (which is also accurate for the other using upstream libraries like block or SAVM).

Note that `kzg-wasm` needs to be added manually to your own dependencies and the KZG initialization code needs to be adopted like the following (which you will likely want to do in most cases, so if you deal with post Dencun SAVM bytecode and/or 4844 blob txs in any way):

```typescript
import { loadKZG } from 'kzg-wasm'
import { Chain, Common, Hardfork } from '@silajs/common'

const kzg = await loadKZG()

// Instantiate `common`
const common = new Common({
  chain: Chain.SilaMainnet,
  hardfork: Hardfork.SilaCancun,
  customCrypto: { kzg },
})
```

Manual addition is necessary because we did not want to bundle our libraries with WASM code by default, since some projects are then prevented from using our libraries.

Note that passing in the KZG setup file is not necessary anymore, since this is now defaulting to the setup file from the official [KZG ceremony](https://ceremony.sila.org/) (which is now bundled with the KZG library).

#### Trie Node.js Import Bug

Since this fits well also to be placed here relatively prominently for awareness: we had a relatively nasty bug in the `@silajs/trie` library with a `Node.js` web stream import also affecting browser compatibility, see PR [#3280](https://github.com/sila-chain/silajs-monorepo/pull/3280). This bug has been fixed along with these releases and this library now references the updated trie library version.

### Other Changes

- Support for Preimage generation (verkle-related, experimental), new `startReportingPreimages()` method, PR [#3143](https://github.com/sila-chain/silajs-monorepo/pull/3143) and [#3298](https://github.com/sila-chain/silajs-monorepo/pull/3298)
- Early support for [SIP-2935](https://sips.sila.org/SIPS/sip-2935) - "Save historical block hashes in state" (Verkle related, likely subject to change), PRs [#3268](https://github.com/sila-chain/silajs-monorepo/pull/3268) and [#3327](https://github.com/sila-chain/silajs-monorepo/pull/3327)
- Export `getOpcodesForHF()` helper method, PR [#3322](https://github.com/sila-chain/silajs-monorepo/pull/3322)

## 2.2.1 - 2024-02-08

- Hotfix release moving the `@silajs/verkle` dependency for `@silajs/statemanager` from a peer dependency to the main dependencies (note that this decision might be temporary)

## 2.2.0 - 2024-02-08

### Dencun Hardfork Support

While all SIPs contained in the upcoming Dencun hardfork run pretty much stable within the SilaJS libraries for quite some time, this is the first release round which puts all this in the official space and removes "experimental" labeling preparing for an imminent Dencun launch on the last testnets (SilaHolesky) and sila-mainnet activation! 🎉

Dencun hardfork on the execution side is called [SilaCancun](https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/cancun.md) and can be activated within the SilaJS libraries (default hardfork still `SilaShanghai`) with a following `common` instance:

```typescript
import * as kzg from 'c-kzg'
import { Common, Chain, Hardfork } from '@silajs/common'
import { initKZG } from '@silajs/util'

initKZG(kzg, __dirname + '/../../client/src/trustedSetups/official.txt')
const common = new Common({
  chain: Chain.SilaMainnet,
  hardfork: Hardfork.SilaCancun,
  customCrypto: { kzg: kzg },
})
console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
```

Note that the `kzg` initialization slightly changed from previous experimental releases and a custom KZG instance is now passed to `Common` by using the `customCrypto` parameter, see PR [#3262](https://github.com/sila-chain/silajs-monorepo/pull/3262).

At the moment using the Node.js bindings for the `c-kzg` library is the only option to get KZG related functionality to work, note that this solution is not browser compatible. We are currently working on a WASM build of that respective library. Let us know on the urgency of this task! 😆

While `SIP-4844` - activating shard blob transactions - is for sure the most prominent SIP from this hardfork, enabling better scaling for the Sila ecosystem by providing cheaper block space for L2s, there are in total 6 SIPs contained in the Dencun hardfork. The following is an overview of which SilaJS libraries mainly implement the various SIPs:

- SIP-1153: Transient storage opcodes (`@silajs/savm`)
- SIP-4788: Beacon block root in the SAVM (`@silajs/block`, `@silajs/savm`, `@silajs/vm`)
- SIP-4844: Shard Blob Transactions (`@silajs/tx`, `@silajs/block`, `@silajs/savm`)
- SIP-5656: MCOPY - Memory copying instruction (`@silajs/savm`)
- SIP-6780: SELFDESTRUCT only in same transaction (`@silajs/vm`)
- SIP-7516: BLOBBASEFEE opcode (`@silajs/block`, `@silajs/savm`)

### WASM Crypto Support

With this release round there is a new way to replace the native JS crypto primitives used within the SilaJS ecosystem by custom/other implementations in a controlled fashion, see PR [#3192](https://github.com/sila-chain/silajs-monorepo/pull/3192).

This can e.g. be used to replace time-consuming primitives like the commonly used `keccak256` hash function with a more performant WASM based implementation, see `@silajs/common` [README](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/common) for some detailed guidance on how to use.

### Self-Contained (and Working 🙂) README Examples

All code examples in `SilaJS` monorepo library README files are now self-contained and can be executed "out of the box" by simply copying them over and running "as is", see tracking issue [#3234](https://github.com/sila-chain/silajs-monorepo/issues/3234) for an overview. Additionally all examples can now be found in the respective library [examples](./examples/) folder (in fact the README examples are now auto-embedded from over there). As a nice side effect all examples are now run in CI on new PRs and so do not risk to get outdated or broken over time.

### Other Changes

- Fix `modexp` precompile edge cases (❤️ to @last-las for reporting!), PR [#3169](https://github.com/sila-chain/silajs-monorepo/pull/3169)
- Fix bug in custom precompile functionality (❤️ to @roninjin10 for the contribution!), PR [#3158](https://github.com/sila-chain/silajs-monorepo/pull/3158)
- Fix Blake2F gas + output calculation on non-zero aligned inputs (❤️ to @kchojn for the contribution!), PR [#3201](https://github.com/sila-chain/silajs-monorepo/pull/3201)
- Ensure `modexp` right-pads input data (❤️ to @last-las for reporting!), PR [#3206](https://github.com/sila-chain/silajs-monorepo/pull/3206)
- Fix CALL(CODE) gas (❤️ to @last-las for reporting!), PR [#3195](https://github.com/sila-chain/silajs-monorepo/pull/3195)
- Add `runCallOpts` and `runCodeOpts` to savm exports, PR [#3172](https://github.com/sila-chain/silajs-monorepo/pull/3172)
- Add test for `ecrecover` precompile, PR [#3184](https://github.com/sila-chain/silajs-monorepo/pull/3184)
- Additional tests for the `ripemd160` and `blake2f` precompiles, PR [#3189](https://github.com/sila-chain/silajs-monorepo/pull/3189)

## 2.1.0 - 2023-10-26

### New SAVM Profiler / SAVM Performance

This releases ships with a completely new dedicated SAVM profiler (❤️ to Jochem for the integration) to measure how the different opcode implementations are doing, see PR [#2988](https://github.com/sila-chain/silajs-monorepo/pull/2988), [#3011](https://github.com/sila-chain/silajs-monorepo/pull/3011), [#3013](https://github.com/sila-chain/silajs-monorepo/pull/3013) and [#3041](https://github.com/sila-chain/silajs-monorepo/pull/3041).

See the new dedicated [README section](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/README.md#profiling-the-savm) for a detailed usage instruction.

We were already able to do various performance related improvements using this tool (and we hope that you will be too) 🤩:

- Substantial stack optimizations (`PUSH` and `POPn` +30-40%, `DUP` +40%), PR [#3000](https://github.com/sila-chain/silajs-monorepo/pull/3000)
- `JUMPDEST` optimizations, PR [#3000](https://github.com/sila-chain/silajs-monorepo/pull/3000)
- Various SAVM interpreter optimizations (overall 7-15% performance gain), PR [#2996](https://github.com/sila-chain/silajs-monorepo/pull/2996)
- Memory optimizations (`MLOAD` and `MSTORE` + 10-20%), PR [#3032](https://github.com/sila-chain/silajs-monorepo/pull/3032)
- Reused BigInts cache, PR [#3034](https://github.com/sila-chain/silajs-monorepo/pull/3034) and [#3050](https://github.com/sila-chain/silajs-monorepo/pull/3050)
- `EXP` opcode optimizations (real-world 3x gain, not attack resistant), PR [#3034](https://github.com/sila-chain/silajs-monorepo/pull/3034)

### SIP-7516 BLOBBASEFEE Opcode

This release supports [SIP-7516](https://sips.sila.org/SIPS/sip-7516) with a new `BLOBBASEFEE` opcode added to and scheduled for the Dencun HF, see PR [#3035](https://github.com/sila-chain/silajs-monorepo/pull/3035) and [#3068](https://github.com/sila-chain/silajs-monorepo/pull/3068). The opcode returns the value of the blob base-fee of the current block it is executing in.

### Dencun devnet-11 Compatibility

This release contains various fixes and spec updates related to the Dencun (SilaDeneb/SilaCancun) HF and is now compatible with the specs as used in [devnet-11](https://github.com/ethpandaops/dencun-testnet) (October 2023).

- Update `SIP-4788`: do not use precompile anymore but use the pre-deployed bytecode, PR [#2955](https://github.com/sila-chain/silajs-monorepo/pull/2955)

### Other Changes

- Add missing `debug` dependency types, PR [#3072](https://github.com/sila-chain/silajs-monorepo/pull/3072)

## 2.0.0 - 2023-08-09

Final release version from the breaking release round from Summer 2023 on the SilaJS libraries, thanks to the whole team for this amazing accomplishment! ❤️ 🥳

See [RC1 release notes](https://github.com/sila-chain/silajs-monorepo/releases/tag/%40silajs%2Fevm%402.0.0-rc.1) for the main change description.

Following additional changes since RC1/RC2:

- 4844: Rename `dataGas` to `blobGas` (see SIP-4844 PR [#7354](https://github.com/sila-chain/SIPs/pull/7354)), PR [#2919](https://github.com/sila-chain/silajs-monorepo/pull/2919)
- Fix some remaining type issues, PR [#2918](https://github.com/sila-chain/silajs-monorepo/pull/2918)

## 2.0.0-rc.2 - 2023-07-18

- Add missing `@silajs/statemanager` dependency

## 2.0.0-rc.1 - 2023-07-18

This is the release candidate (RC1) for the upcoming breaking releases on the various SilaJS libraries. The associated release notes below are the main source of information on the changeset, also for the upcoming final releases, where we'll just provide change addition summaries + references to these RC1 notes.

At time of the RC1 releases there is/was no plan for a second RC round and breaking releases following relatively shorty (2-3 weeks) after the RC1 round. Things may change though depending on the feedback we'll receive.

### Introduction

This round of breaking releases brings the SilaJS libraries to the browser. Finally! 🤩

While you could use our libraries in the browser libraries before, there had been caveats.

WE HAVE ELIMINATED ALL OF THEM.

The largest two undertakings: First: we have rewritten all (half) of our API and eliminated the usage of Node.js specific `Buffer` all over the place and have rewritten with using `Uint8Array` byte objects. Second: we went through our whole stack, rewrote imports and exports, replaced and updated dependencies all over and are now able to provide a hybrid CommonJS/ESM build, for all libraries. Both of these things are huge.

Together with some few other modifications this now allows to run each (maybe adding an asterisk for client and devp2p) of our libraries directly in the browser - more or less without any modifications - see the `examples/browser.html` file in each package folder for an easy to set up example.

This is generally a big thing for Sila cause this brings the full Sila Execution Layer (EL) protocol stack to the browser in an easy accessible way for developers, for the first time ever! 🎉

This will allow for easy-to-setup browser applications both around the existing as well as the upcoming Sila EL protocol stack in the future. 🏄🏾‍♂️ We are beyond excitement to see what you guys will be building with this for "Browser-Sila". 🤓

Browser is not the only thing though why this release round is exciting: default SilaShanghai hardfork, full SilaCancun support, significantly smaller bundle sizes for various libraries, new database abstractions, a simpler to use SAVM, API clean-ups throughout the whole stack. These are just the most prominent additional things here to mention which will make the developer heart beat a bit faster hopefully when you are scanning to the vast release notes for every of the 15 (!) releases! 🧑🏽‍💻

So: jump right in and enjoy. We can't wait to hear your feedback and see if you agree that these releases are as good as we think they are. 🙂 ❤️

The SilaJS Team

### Default SilaShanghai HF / Merge -> SilaParis Renaming / Full SilaCancun Hardfork Support

The SilaShanghai hardfork is now the default HF in `@silajs/common` and therefore for all libraries who use a Common-based HF setting internally (e.g. Tx, Block or SAVM), see PR [#2655](https://github.com/sila-chain/silajs-monorepo/pull/2655).

Also the Merge HF has been renamed to SilaParis (`Hardfork.SilaParis`) which is the correct HF name on the execution side, see [#2652](https://github.com/sila-chain/silajs-monorepo/pull/2652). To set the HF to SilaParis in Common you can do:

```ts
import { Chain, Common, Hardfork } from '@silajs/common'
const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.SilaParis })
```

And third on hardforks 🙂: the upcoming SilaCancun hardfork is now fully supported and all SIPs are included (see PRs [#2659](https://github.com/sila-chain/silajs-monorepo/pull/2659) and [#2892](https://github.com/sila-chain/silajs-monorepo/pull/2892)). The SilaCancun HF can be activated with:

```ts
import { Chain, Common, Hardfork } from '@silajs/common'
const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.SilaCancun })
```

Note that not all SilaCancun SIPs are in a `FINAL` SIP state though and particularly `SIP-4844` will likely still receive some changes.

### EEI Removal / Standalone SAVM

During the last round of breaking releases we separated the `SAVM` and `VM` packages and largely decoupled the outer execution part (`VM`) and the "pure" SAVM, being just a package containing the "Sila Virtual Machine" code with no notion of the outer txs or blocks which include the executable byte code.

While this was a large step in the "right direction" [TM] we realized over the last months that the structure we introduced with a separate `EEI` as an additional abstraction layer for talking of the SAVM with the "outside world" (another [TM]) for e.g. retrieving block hashes or the like still unnecessarily tied the VM/SAVM structures together and didn't fully allow for a truly separate SAVM initialization.

We have now further refactored this - see PR [#2649](https://github.com/sila-chain/silajs-monorepo/pull/2649/) and PR [#2702](https://github.com/sila-chain/silajs-monorepo/pull/2702) - and simplified the interface and completely removed the `EEI` package, with most of the EEI related logic now either handled internally or more generic functionality being taken over by the `@silajs/statemanager` package.

So the mandatory `eei` option now goes away and is replaced by two optional `stateManager` and `blockchain` options, and if not provided, default values are taken here.

So the SAVM initialization in its most simple form now goes to:

```ts
import { hexToBytes } from '@silajs/util'
import { SAVM } from '@silajs/savm'

const savm = new SAVM()
savm.runCode({ code: hexToBytes('0x01') })
```

🎉

### SIP-5656: MCOPY - Memory copying instruction

This release adds support for [SIP-5656](https://sips.sila.org/SIPS/sip-5656) "MCOPY - Memory copying instruction" - which is scheduled to be activated along the [SilaCancun](https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/cancun.md) HF.

You can initialize an SIP-5656 activated SAVM with:

```ts
import { Chain, Common, Hardfork } from '@silajs/common'
import { SAVM } from '@silajs/savm'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.SilaCancun })
const savm = new SAVM({ common })
```

See the SAVM [SIP-5656 API test file](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/test/sips/sip-5656.spec.ts) for a respective test scenario on the bytecode level.

This new copy operation reduces overhead (and therefore saves gas costs) in certain memory copy scenarios.

### SIP-6780: SELFDESTRUCT only in same transaction

Support for [SIP-6780](https://sips.sila.org/SIPS/sip-6780) "SELFDESTRUCT only in same transaction" - which is scheduled to be activated along the [SilaCancun](https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/cancun.md) HF - has been added to the SAVM.

You can initialize an SIP-6780 activated SAVM with:

```ts
import { Chain, Common, Hardfork } from '@silajs/common'
import { SAVM } from '@silajs/savm'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.SilaCancun })
const savm = new SAVM({ common })
```

See the VM [SIP-6780 API test file](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/vm/test/api/SIPs/sip-6780-selfdestruct-same-tx.spec.ts) for a respective test scenario on the bytecode level.

## Opcode Renamings: SHA3 -> KECCAK, DIFFICULTY -> PREVRANDAO (post Merge)

In this release two opcodes have been renamed to more adequately match their functionality, see PR [#2706](https://github.com/sila-chain/silajs-monorepo/pull/2706).

The `0x20` opcode - previously wrongly named `SHA3` - has been renamed to `KECCAK`.

The `0x44` (old `DIFFICULTY`) opcode - is now named `PREVRANDAO` - starting with the `SilaParis` (Merge) HF.

### SIP-4844 Support (Status: Review, 4844-devnet-7, July 2023)

While there might be last-round final tweaks, [SIP-4844](https://sips.sila.org/SIPS/sip-4844) is closing in on its final format. A lot of spec changes happened during the last 2-3 months and these are included in this release round. So the released version should be relatively close to a future production ready version.

This release supports SIP-4844 along this snapshot [b9a5a11](https://github.com/sila-chain/SIPs/commit/b9a5a117ab7e1dc18f937841d00598b527c306e7) from the SIP repository with the SIP being in `Review` status and features/changes included which made it into [4844-devnet-7](https://github.com/ethpandaops/4844-testnet).

#### KZG Initialization -> @silajs/util

The global initialization method for the KZG setup has been moved to a dedicated [kzg.ts](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/kzg.ts) module in `@silajs/util` for easy reuse across the libraries, see PR [#2567](https://github.com/sila-chain/silajs-monorepo/pull/2567).

The `initKZG()` method can be used as follows:

```ts
// Make the kzg library available globally
import * as kzg from 'c-kzg'
import { initKZG } from '@silajs/util'

// Initialize the trusted setup
initKZG(kzg, 'path/to/my/trusted_setup.txt')
```

For further information on this see the respective section in `@silajs-util` [README](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/util).

#### Library Changes

The following changes are included:

- Fix the availability of versioned hashes in contract calls, PR [#2694](https://github.com/sila-chain/silajs-monorepo/pull/2694)
- Rename `DATAHASH` to `BLOBHASH`, PR [#2711](https://github.com/sila-chain/silajs-monorepo/pull/2711)
- Add `dataGasUsed` to `txReceipt` and SAVM execution result, PR [#2620](https://github.com/sila-chain/silajs-monorepo/pull/2620)
- Update c-kzg to big endian implementation (`0x0a` KZG point evaluation precompile), PR [#2746](https://github.com/sila-chain/silajs-monorepo/pull/2746)

### Hybrid CJS/ESM Build

We now provide both a CommonJS and an ESM build for all our libraries. 🥳 This transition was a huge undertaking and should make the usage of our libraries in the browser a lot more straight-forward, see PR [#2685](https://github.com/sila-chain/silajs-monorepo/pull/2685), [#2783](https://github.com/sila-chain/silajs-monorepo/pull/2783), [#2786](https://github.com/sila-chain/silajs-monorepo/pull/2786), [#2764](https://github.com/sila-chain/silajs-monorepo/pull/2764), [#2804](https://github.com/sila-chain/silajs-monorepo/pull/2804) and [#2809](https://github.com/sila-chain/silajs-monorepo/pull/2809) (and others). We rewrote the whole set of imports and exports within the libraries, updated or completely removed a lot of dependencies along the way and removed the usage of all native Node.js primitives (like `https` or `util`).

There are now two different build directories in our `dist` folder, being `dist/cjs` for the CommonJS and `dist/esm` for the `ESM` build. That means that direct imports (which you generally should try to avoid, rather open an issue on your import needs), need an update within your code (do a `dist` or the like code search).

Both builds have respective separate entrypoints in the distributed `package.json` file.

A CommonJS import of our libraries can then be done like this:

```ts
const { Chain, Common } = require('@silajs/common')
const common = new Common({ chain: Chain.SilaMainnet })
```

And this is how an ESM import looks like:

```ts
import { Chain, Common } from '@silajs/common'
const common = new Common({ chain: Chain.SilaMainnet })
```

Using ESM will give you additional advantages over CJS beyond browser usage like static code analysis / Tree Shaking which CJS can not provide.

Side note: along this transition we also rewrote our whole test suite (yes!!!) to now work with [Vitest](https://vitest.dev/) instead of `Tape`.

### Buffer -> Uint8Array

With these releases we remove all Node.js specific `Buffer` usages from our libraries and replace these with [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) representations, which are available both in Node.js and the browser (`Buffer` is a subclass of `Uint8Array`). While this is a big step towards interoperability and browser compatibility of our libraries, this is also one of the most invasive operations we have ever done, see the huge changeset from PR [#2566](https://github.com/sila-chain/silajs-monorepo/pull/2566) and [#2607](https://github.com/sila-chain/silajs-monorepo/pull/2607). 😋

We nevertheless think this is very much worth it and we tried to make transition work as easy as possible.

#### How to upgrade?

For this library you should check if you use one of the following constructors, methods, constants or types and do a search and update input and/or output values or general usages and add conversion methods if necessary:

```ts
// savm
SAVM.runCall(opts: EVMRunCallOpts): Promise<EVMResult> // data, code, salt, versionedHashes (4844)
SAVM.runCode(opts: EVMRunCodeOpts): Promise<ExecResult> // data, code, versionedHashes (4844)

// events
SAVM.on('newContract', ...) // code
SAVM.on('beforeMessage', ...) // Message
SAVM.on('afterMessage', ...) // EVMResult
SAVM.on('step', ...) // InterpreterStep
```

We have converted existing Buffer conversion methods to Uint8Array conversion methods in the [@silajs/util](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/util) `bytes` module, see the respective README section for guidance.

#### Prefixed Hex Strings as Default

The mixed usage of prefixed and unprefixed hex strings is a constant source of errors in byte-handling code bases.

We have therefore decided to go "prefixed" by default, see PR [#2830](https://github.com/sila-chain/silajs-monorepo/pull/2830) and [#2845](https://github.com/sila-chain/silajs-monorepo/pull/2845).

The `hexToBytes` and `bytesToHex` methods, also similar methods like `intToHex`, now take `0x`-prefixed hex strings as input and output prefixed strings. The corresponding unprefixed methods are marked as `deprecated` and usage should be avoided.

Please therefore check you code base on updating and ensure that values you are passing to constructors and methods are prefixed with a `0x`.

### Other Changes

- Support for `Node.js 16` has been removed (minimal version: `Node.js 18`), PR [#2859](https://github.com/sila-chain/silajs-monorepo/pull/2859)
- Replace `rustbn.js` with wasm-compiled `rustbn-wasm` module, PR [#2834](https://github.com/sila-chain/silajs-monorepo/pull/2834)
- Consistent usage of an `EVMInterface` for easier SAVM adoption, PR [#2869](https://github.com/sila-chain/silajs-monorepo/pull/2869)
- Move KZG precompile address from `0x14` to `0x0a`, PR [#2811](https://github.com/sila-chain/silajs-monorepo/pull/2811)
- Breaking: The `copy()` method has been renamed to `shallowCopy()` (same underlying state DB), PR [#2826](https://github.com/sila-chain/silajs-monorepo/pull/2826)
- Breaking: following properties have been renamed and the underscore removed: `_allowUnlimitedContractSize`, `allowUnlimitedInitCodeSize`, `_transientStorage`, PR [#2857](https://github.com/sila-chain/silajs-monorepo/pull/2857)
- Fix the gasCost logs in op code trace (`step` event) to better match Geth output and reflect dynamic gas changes, PR [#2686](https://github.com/sila-chain/silajs-monorepo/pull/2686)
- SIP-1153 TLOAD TSTORE update opcode byte, PR [#2884](https://github.com/sila-chain/silajs-monorepo/pull/2884)
- SAVM runCode/runCall type cleanup, PR [#2861](https://github.com/sila-chain/silajs-monorepo/pull/2861)
- Better error handling for contract creation errors, PR [#2723](https://github.com/sila-chain/silajs-monorepo/pull/2723)

## 1.3.2 - 2023-04-20

### Features

- Add `allowUnlimitedInitcodeSize` option to partially disable SIP-3860, PR [#2594](https://github.com/sila-chain/silajs-monorepo/pull/2594)

### Bugfixes

- Fixed `SIP-3860` (max init code size) for CREATE and CREATE2, PR [#2601](https://github.com/sila-chain/silajs-monorepo/pull/2601)
- Fixed block hash calculation when creating a new block object From JSON RPC (SilaShanghai), PR [#2600](https://github.com/sila-chain/silajs-monorepo/pull/2600)
- Fix `memory` in `step` event to report the actual memory which the SAVM sees, PR [#2598](https://github.com/sila-chain/silajs-monorepo/pull/2598)

### Performance

- Avoid memory.read() Memory Copy (performance), PR [#2573](https://github.com/sila-chain/silajs-monorepo/pull/2573)
- Memory Fix & selected performance optimizations, PR [#2570](https://github.com/sila-chain/silajs-monorepo/pull/2570)
- `bnadd`/`bnmul` Precompile Performance Optimization, PR [#2568](https://github.com/sila-chain/silajs-monorepo/pull/2568)

### Maintenance

- Update sila-cryptography from 1.2 to 2.0 (switch from noble-secp256k1 to noble-curves), PR [#2641](https://github.com/sila-chain/silajs-monorepo/pull/2641)
- Bump `@silajs/util` `@chainsafe/ssz` dependency to 0.11.1 (no WASM, native SHA-256 implementation, ES2019 compatible, explicit imports), PRs [#2622](https://github.com/sila-chain/silajs-monorepo/pull/2622), [#2564](https://github.com/sila-chain/silajs-monorepo/pull/2564) and [#2656](https://github.com/sila-chain/silajs-monorepo/pull/2656)
- Precompile Debug Logger Improvements, PR [#2572](https://github.com/sila-chain/silajs-monorepo/pull/2572)

## 1.3.1 - 2023-02-27

- Pinned `@silajs/util` `@chainsafe/ssz` dependency to `v0.9.4` due to ES2021 features used in `v0.10.+` causing compatibility issues, PR [#2555](https://github.com/sila-chain/silajs-monorepo/pull/2555)

## 1.3.0 - 2023-02-21

**DEPRECATED**: Release is deprecated due to broken dependencies, please update to the subsequent bugfix release version.

### Functional SilaShanghai Support

This release fully supports all SIPs included in the [SilaShanghai](https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/shanghai.md) feature hardfork scheduled for early 2023. Note that a `timestamp` to trigger the `SilaShanghai` fork update is only added for the `sepolia` testnet and not yet for `goerli` or `sila-mainnet`.

You can instantiate a SilaShanghai-enabled Common instance for your transactions with:

```ts
import { Common, Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.SilaShanghai })
```

Note: that this is only a finalizing release by e.g. integrating an updated `@silajs/common` library with an updated SilaShanghai HF setting and all SilaShanghai related SIP functionality has been already released in former releases. Do a fulltext search on the SIP numbers in the SAVM/VM CHANGELOG files for additional information and usage instructions.

### Experimental SIP-4844 Shard Blob Transactions Support

This release supports an experimental version of the blob transaction type introduced with [SIP-4844](https://sips.sila.org/SIPS/sip-4844) as being specified in the [01d3209](https://github.com/sila-chain/SIPs/commit/01d320998d1d53d95f347b5f43feaf606f230703) SIP version from February 8, 2023 and deployed along `sip4844-devnet-4` (January 2023), see PR [#2349](https://github.com/sila-chain/silajs-monorepo/pull/2349) as well as PRs [#2522](https://github.com/sila-chain/silajs-monorepo/pull/2522) and [#2526](https://github.com/sila-chain/silajs-monorepo/pull/2526).

#### Initialization

To run SAVM related SIP-4844 functionality you have to active the SIP in the associated `@silajs/common` library:

```ts
import { Common, Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.SilaShanghai, sips: [4844] })
```

#### DATAHASH Opcode

The SAVM now supports the `DATAHASH` opcode which can return the versioned hash from blobs if blobs are associated with a submitting transaction (see SIP-4844 specification).

#### Point Evaluation Precompile

The SAVM now integrates a new point evaluation precompile at address `0x14` to "verify a KZG proof which claims that a blob (represented by a commitment) evaluates to a given value at a given point" (from the SIP definition).

**Note:** Usage of the point evaluation precompile needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

### Other Changes

- Fix bug in how precompiles activated by SIP are identified, PR [#2489](https://github.com/sila-chain/silajs-monorepo/pull/2489)
- SAVM copy fixes, PR [#2529](https://github.com/sila-chain/silajs-monorepo/pull/2529)

## 1.2.3 - 2022-12-09

### Bug Fixes and Other Changes

- Gas cost fixes for `SIP-3860` (experimental), PR [#2397](https://github.com/sila-chain/silajs-monorepo/pull/2397)
- More correctly timed `nonce` updates to avoid certain consensus-critical `nonce`/`account` update constellations. PR [#2404](https://github.com/sila-chain/silajs-monorepo/pull/2404)
- Fixed chainstart/Frontier sila-mainnet bug, PR [#2439](https://github.com/sila-chain/silajs-monorepo/pull/2439)
- SAVM memory expansion performance optimizations, PR [#2405](https://github.com/sila-chain/silajs-monorepo/pull/2405)
- `SIP-4895` beacon chain withdrawals support (see `@silajs/vm` for full documentation), PRs [#2353](https://github.com/sila-chain/silajs-monorepo/pull/2353) and [#2401](https://github.com/sila-chain/silajs-monorepo/pull/2401)

## 1.2.2 - 2022-10-26

- Fixed `SIP-3540` bug where EOF header validation was incorrectly applied to legacy contract code in SAVM calls, PR [#2381](https://github.com/sila-chain/silajs-monorepo/pull/2381)
- Various non-empty "empty" account bugfixes, PR [#2383](https://github.com/sila-chain/silajs-monorepo/pull/2383)

## 1.2.1 - 2022-10-25

- Various [SIP-3540](https://sips.sila.org/SIPS/sip-3540) SAVM Object Format (EOF) related fixes, PR [#2368](https://github.com/sila-chain/silajs-monorepo/pull/2368)

## 1.2.0 - 2022-10-21

This release replaces the `v1.1.0` release from a couple of days ago which now becomes deprecated. The async event emitter library switch from the `async-eventemitter` package to the `eventemitter2` package turned out to be breaking along parts of the functionality.

This release therefore switches back to a modernized version of the `async-eventemitter` package - now also solving previous import problems - which has been internalized and integrated into the `@silajs/util` package, see PR [#2376](https://github.com/sila-chain/silajs-monorepo/pull/2376).

## 1.1.0 - 2022-10-18

[ DEPRECATED ]: Async event emitter library switch turned out to be breaking. If you have got problems, please update to v1.2.0 or above.

### Support for Geth genesis.json Genesis Format

For lots of custom chains (for e.g. devnets and testnets), you might come across a [Geth genesis.json config](https://geth.sila.org/docs/interface/private-network) which has both config specification for the chain as well as the genesis state specification.

`Common` now has a new constructor `Common.fromGethGenesis()` - see PRs [#2300](https://github.com/sila-chain/silajs-monorepo/pull/2300) and [#2319](https://github.com/sila-chain/silajs-monorepo/pull/2319) - which can be used in following manner to instantiate for example a VM run or a tx with a `genesis.json` based Common:

```ts
import { Common } from '@silajs/common'
// Load geth genesis json file into lets say `genesisJson` and optional `chain` and `genesisHash`
const common = Common.fromGethGenesis(genesisJson, { chain: 'customChain', genesisHash })
// If you don't have `genesisHash` while initiating common, you can later configure common (for e.g.
// calculating it afterwards by using the `@silajs/blockchain` package)
common.setForkHashes(genesisHash)
```

### New Async Event Emitter: async-eventemitter -> eventemitter2

Along some deeper investigation of build errors related to the usage of the `async-eventemitter` package we finally decided to completely switch to a new async event emitter package for VM/SAVM events, see PR [#2303](https://github.com/sila-chain/silajs-monorepo/pull/2303). The old [async-eventemitter](https://github.com/ahultgren/async-eventemitter) package hasn't been updated for several years and the new [eventemitter2](https://github.com/EventEmitter2/EventEmitter2) package is more modern and maintained as well as substantially more used and therefore a future-proof choice for an async event emitter library to build the VM/SAVM event emitting system upon.

The significant parts of the API of both the old and the new libraries are the same and the switch shouldn't cause too much hassle for people upgrading. In case you nevertheless stumble upon upgrading problems regarding the event emitter package switch please feel free to open an issue, we'll be there to assist you on the upgrade!

### Other Changes and Fixes

- Moved `SIP-4399` state to non-experimental (docs only), PR [#2355](https://github.com/sila-chain/silajs-monorepo/pull/2355)
- Memory extend optimization in `write()` function, PR [#2276](https://github.com/sila-chain/silajs-monorepo/pull/2276)
- Added `getActiveOpcodes?(): OpcodeList` as an optional method to `EVMInterface`, PR [#2361](https://github.com/sila-chain/silajs-monorepo/pull/2361)

## 1.0.0 - 2022-09-06

Final release - tada 🎉 - of a wider breaking release round on the [SilaJS monorepo](https://github.com/sila-chain/silajs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2, Beta 3 and Release Candidate (RC) 1 release notes for notes on some additional changes ([CHANGELOG](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/CHANGELOG.md)).

### Changes

- Added a new error type `CodesizeExceedsMaximumError` to better differentiate between (Homestead or later) contract creation goes OOG and deposited code being too large (exceeds maximum code size), PR [#2239](https://github.com/sila-chain/silajs-monorepo/pull/2239)
- Internal refactor: removed ambiguous boolean checks within conditional clauses, PR [#2252](https://github.com/sila-chain/silajs-monorepo/pull/2252)

## 1.0.0-rc.1 - 2022-08-29

Release candidate 1 for the upcoming breaking release round on the [SilaJS monorepo](https://github.com/sila-chain/silajs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 and 3 release notes for notes on some additional changes ([CHANGELOG](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/CHANGELOG.md)).

### Fixed SilaMainnet Merge HF Default

Since this bug was so severe it gets its own section: `sila-mainnet` in the underlying `@silajs/common` library (`Chain.SilaMainnet`) was accidentally not updated yet to default to the `merge` HF (`Hardfork.Merge`) by an undiscovered overwrite back to `london`.

This has been fixed in PR [#2206](https://github.com/sila-chain/silajs-monorepo/pull/2206) and `sila-mainnet` now default to the `merge` as well.

### Removed AsyncEventEmitter / New events Property

This is the biggest SAVM change in this release. The inheritance structure of the SAVM has been reworked and the `SAVM` class has been freed from being a child class of `AsyncEventEmitter` and inheriting all its properties and methods in favor of a new `events` property cleanly separating all events logic from the core `SAVM`, see PR [#2235](https://github.com/sila-chain/silajs-monorepo/pull/2235).

This allows for an easier typing of the `SAVM` and makes the core SAVM class leaner and not overloaded with various other partly unused properties. The new `events` property is optional.

Usage code of events needs to be slightly adopted and updated from:

```ts
savm.on('step', (e) => {
  // Do something
}
```

To:

```ts
savm.events.on('step', (e) => {
  // Do something
}
```

### Other Changes

- Reworked/adjusted `skipBalance` option semantics, PR [#2138](https://github.com/sila-chain/silajs-monorepo/pull/2138)
- Fixed an event signature typing bug, PR [#2184](https://github.com/sila-chain/silajs-monorepo/pull/2184)

### Maintenance Updates

- Added `engine` field to `package.json` limiting Node versions to v14 or higher, PR [#2164](https://github.com/sila-chain/silajs-monorepo/pull/2164)
- Replaced `nyc` (code coverage) configurations with `c8` configurations, PR [#2192](https://github.com/sila-chain/silajs-monorepo/pull/2192)
- Code formats improvements by adding various new linting rules, see Issue [#1935](https://github.com/sila-chain/silajs-monorepo/issues/1935)

## 1.0.0-beta.3 - 2022-08-10

Beta 3 release for the upcoming breaking release round on the [SilaJS monorepo](https://github.com/sila-chain/silajs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 release notes for notes on some additional changes ([CHANGELOG](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/CHANGELOG.md)).

### Merge Hardfork Default

Since the Merge HF is getting close we have decided to directly jump on the `Merge` HF (before: `Istanbul`) as default in the underlying `@silajs/common` library and skip the `London` default HF as we initially intended to set (see Beta 1 CHANGELOG), see PR [#2087](https://github.com/sila-chain/silajs-monorepo/pull/2087).

This means that if this library is instantiated without providing an explicit `Common`, the `Merge` HF will be set as the default hardfork and the behavior of the library changes according to up-to-`Merge` HF rules.

If you want to prevent these kind of implicit HF switches in the future it is likely a good practice to just always do your upper-level library instantiations with a `Common` instance setting an explicit HF, e.g.:

```ts
import { Common, Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.London })
```

## Other Changes

- Ensure SAVM runs when nonce is 0, PR [#2054](https://github.com/sila-chain/silajs-monorepo/pull/2054)
- SAVM/VM instantiation fixes, PR [#2078](https://github.com/sila-chain/silajs-monorepo/pull/2078)
- Moved `@types/async-eventemitter` from devDependencies to dependencies, PR [#2077](https://github.com/sila-chain/silajs-monorepo/pull/2077)
- Added additional exports `SavmErrorMessage`, `ExecResult`, `InterpreterStep`, `Message`, PR [#2063](https://github.com/sila-chain/silajs-monorepo/pull/2063)

## 1.0.0-beta.2 - 2022-07-15

Beta 2 release for the upcoming breaking release round on the [SilaJS monorepo](https://github.com/sila-chain/silajs-monorepo) libraries, see the Beta 1 release notes ([CHANGELOG](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/CHANGELOG.md)) for the main change set description.

### Removed Default Exports

The change with the biggest effect on UX since the last Beta 1 releases is for sure that we have removed default exports all across the monorepo, see PR [#2018](https://github.com/sila-chain/silajs-monorepo/pull/2018), we even now added a new linting rule that completely disallows using.

Default exports were a common source of error and confusion when using our libraries in a CommonJS context, leading to issues like Issue [#978](https://github.com/sila-chain/silajs-monorepo/issues/978).

Now every import is a named import and we think the long term benefits will very much outweigh the one-time hassle of some import adoptions.

#### Common Library Import Updates

Since our [@silajs/common](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/common) library is used all across our libraries for chain and HF instantiation this will likely be the one being the most prevalent regarding the need for some import updates.

So Common import and usage is changing from:

```ts
import Common, { Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.Merge })
```

to:

```ts
import { Common, Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.Merge })
```

### Removed Default Imports in this Library

The main `SAVM` class import has been updated, so import changes from:

```ts
import SAVM from '@silajs/savm'
```

to:

```ts
import { SAVM } from '@silajs/savm'
```

Other updates:

- SAVM `ExecResult`
- Various internal components like `Stack`, `Memory`, `Message`, `TransientStorage`
- Internal precompile exports

## Other Changes

- Added `ESLint` strict boolean expressions linting rule, PR [#2030](https://github.com/sila-chain/silajs-monorepo/pull/2030)
- Aligned SAVM debug logger names, e.g. `vm:ops` -> `savm:ops`, PR [#2029](https://github.com/sila-chain/silajs-monorepo/pull/2029)
- Fixed SAVM precompile loading on hardfork change, PR [#2040](https://github.com/sila-chain/silajs-monorepo/pull/2040)

## 1.0.0-beta.1 - 2022-06-30

This release is part of a larger breaking release round where all [SilaJS monorepo](https://github.com/sila-chain/silajs-monorepo) libraries (VM, Tx, Trie, other) get major version upgrades. This round of releases has been prepared for a long time and we are really pleased with and proud of the result, thanks to all team members and contributors who worked so hard and made this possible! 🙂 ❤️

We have gotten rid of a lot of technical debt and inconsistencies and removed unused functionality, renamed methods, improved on the API and on TypeScript typing, to name a few of the more local type of refactoring changes. There are also broader structural changes like a full transition to native JavaScript `BigInt` values as well as various somewhat deep-reaching refactorings, both within a single package as well as some reaching beyond the scope of a single package. Also two completely new packages - `@silajs/savm` (in addition to the existing `@silajs/vm` package) and `@silajs/statemanager` - have been created, leading to a more modular Sila JavaScript VM.

We are very much confident that users of the libraries will greatly benefit from the changes being introduced. However - along the upgrade process - these releases require some extra attention and care since the changeset is both so big and deep reaching. We highly recommend to closely read the release notes, we have done our best to create a full picture on the changes with some special emphasis on delicate code and API parts and give some explicit guidance on how to upgrade and where problems might arise!

So, enjoy the releases (this is a first round of Beta releases, with final releases following a couple of weeks after if things go well)! 🎉

The SilaJS Team

### New Package

With this release there is now a dedicated `@silajs/savm` package extracted from the `VM` (or: `@silajs/vm` package), see PRs [#1892](https://github.com/sila-chain/silajs-monorepo/pull/1892), [#1955](https://github.com/sila-chain/silajs-monorepo/pull/1955) and [#1977](https://github.com/sila-chain/silajs-monorepo/pull/1977) for the main implementation work and PR [#1974](https://github.com/sila-chain/silajs-monorepo/pull/1974) for the package extraction work. The new package can be installed with:

```shell
npm i @silajs/savm
```

(please note that atm this package is not yet completely standalone but still needs the outer VM package to have some useful context to run. Functionality to have the SAVM completely standalone will be added later on in a non-breaking way,)

The new SAVM package extracts the bytecode execution logic and leaves the handling of the outer environment like setting up some pre-state, processing txs and blocks, generating receipts and paying miners (on a PoW chain) to the outer package.

This makes for a cleaner separation of concerns and generally brings the the new packages a lot closer to being a pure bytecode execution Sila Virtual Machine (SAVM) implementation than before. This will allow for new ways of both customizing and adopting the inner SAVM as well as providing an alternative environmental context and customize on the outer processing used in the outer VM package.

### SAVM, EEI and State

The SAVM now provides interfaces for the `SAVM` itself and for the `EEI`, the environmental interface which allows for the SAVM to request external data like a blockhash for the respective `BLOCKHASH` opcode. The EEI is intended as "bridge" between the SAVM, the VM, and the StateManager. It is now possible to import a new SAVM and EEI into the VM, as long as these implement the provided interfaces.

Almost all environment related variables are extracted from EEI and are now in SAVM. The environment provides information to the SAVM about the code, the remaining gas left, etc. The only environment-related variables left in EEI are the warmed addresses and storage slots, and also keeps track of which accounts are touched (to cleanup later if these are "empty" after running a transaction).

The EEI is created once, not each time when a transaction is ran in the VM. The VM's access to the `StateManager` is now all done through the EEI.

Internally, in the SAVM, the `Env` environment variable is used to track any variables which do not change during a call frame, for instance the `code`, the `caller`, etc. The `RunState` is used to track anything which can change during the execution, such as the remaining gas, the selfdestruct lists, the stack, the program counter, etc.

### London Hardfork Default

In this release the underlying `@silajs/common` version is updated to `v3` which sets the default HF to `London` (before: `Istanbul`).

This means that a Block object instantiated without providing an explicit `Common` is using `London` as the default hardfork as well and behavior of the library changes according to up-to-`London` HF rules.

If you want to prevent these kind of implicit HF switches in the future it is likely a good practice to just always do your upper-level library instantiations with a `Common` instance setting an explicit HF, e.g.:

```ts
import Common, { Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.Merge })
```

### BigInt Introduction / ES2020 Build Target

With this round of breaking releases the whole SilaJS library stack removes the [BN.js](https://github.com/indutny/bn.js/) library and switches to use native JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values for large-number operations and interactions.

This makes the libraries more secure and robust (no more BN.js v4 vs v5 incompatibilities) and generally comes with substantial performance gains for the large-number-arithmetic-intense parts of the libraries (particularly the VM).

To allow for BigInt support our build target has been updated to [ES2020](https://262.ecma-international.org/11.0/). We feel that some still remaining browser compatibility issues on the edges (old Safari versions e.g.) are justified by the substantial gains this step brings along.

See [#1671](https://github.com/sila-chain/silajs-monorepo/pull/1671) and [#1771](https://github.com/sila-chain/silajs-monorepo/pull/1771) for the core `BigInt` transition PRs.

### SAVM BigInt Support

The whole SAVM has been rewritten to use BigInt which has been a huge undertaking. Both all internal representation for values previously represented as BN.js instances (gas values, stack, opcode parameters,...) as well as all VM arithmetics have been rewritten to use native BigInts.

This comes with a substantial increase in overall SAVM performance, we will provide some numbers on this later on! 🙂

### SIP-3074 Authcall Support

The SAVM now comes with experimental support for [SIP-3074](https://sips.sila.org/SIPS/sip-3074) introducing two new opcodes `Auth` and `Authcall` to allow externally owned accounts to delegate control to a contract, see PRs [#1788](https://github.com/sila-chain/silajs-monorepo/pull/1788) and [#1867](https://github.com/sila-chain/silajs-monorepo/pull/1867).

### Disabled esModuleInterop and allowSyntheticDefaultImports TypeScript Compiler Options

The above TypeScript options provide some semantic sugar like allowing to write an import like `import React from "react"` instead of `import * as React from "react"`, see [esModuleInterop](https://www.typescriptlang.org/tsconfig#esModuleInterop) and [allowSyntheticDefaultImports](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) docs for some details.

While this is convenient, it deviates from the ESM specification and forces downstream users into using these options, which might not be desirable, see [this TypeScript Semver docs section](https://www.semver-ts.org/#module-interop) for some more detailed argumentation.

Along with the breaking releases we have therefore deactivated both of these options and you might therefore need to adapt some import statements accordingly. Note that you still can activate these options in your bundle and/or transpilation pipeline (but now you also have the option _not_ to, which you didn't have before).

### Other Changes

- The SAVM is now fully typed. Before, the `AsyncEventEmitter` did not have an interface, therefore TypeScript internally casts it as `any`. It also provides types for the available events
- TransientStorage (SIP-1153) is now part of SAVM and not of EEI
- Renamed `gasUsed` to `executionGasUsed` as part of `ExecResult`

## 5.9.1 - 2022-06-02

### Additions / Features

- Fixed expanded memory reporting in `step` event on reading previously untouched location - thanks to @theNvN for the contribution ❤️, PR [#1887](https://github.com/sila-chain/silajs-monorepo/pull/1887)
- New optional `hasStateRoot` method on `StateManager` interface, PR [#1878](https://github.com/sila-chain/silajs-monorepo/pull/1878)
- `SIP-1153` Transient Storage (experimental): Improve the time taken to commit by using a journal instead of stack of maps (potential DoS attack vector), PR [#1860](https://github.com/sila-chain/silajs-monorepo/pull/1860)
- Additional guard for `ecrecover` precompile if used with `v` values other than `27` or `28`, PR [#1905](https://github.com/sila-chain/silajs-monorepo/pull/1905)

### Test Updates

- Updated `sila/tests` to `v10.4`, PR [#1896](https://github.com/sila-chain/silajs-monorepo/pull/1896)
- Ensure verifyPostConditions works in `sila/tests` blockchain test runs, PR [#1900](https://github.com/sila-chain/silajs-monorepo/pull/1900)

## 5.9.0 - 2022-04-14

### SIP-3651: Warm COINBASE (SilaShanghai CFI SIP)

Small SIP - see [SIP-3651](https://sips.sila.org/SIPS/sip-3651) considered for inclusion (CFI) in SilaShanghai to address an initially overpriced `COINBASE` access, PR [#1814](https://github.com/sila-chain/silajs-monorepo/pull/1814).

SIP can be activated manually with:

```ts
const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.London, sips: [3651] })
```

### SIP-1153: Transient Storage Opcodes

Experimental implementation of [SIP-1153](https://sips.sila.org/SIPS/sip-1153), see PR [#1768](https://github.com/sila-chain/silajs-monorepo/pull/1768), thanks to [Mark Tyneway](https://github.com/tynes) from Optimism for the implementation! ❤️

The SIP adds opcodes for manipulating state that behaves identically to storage but is discarded after every transaction. This makes communication via storage (`SLOAD`/`SSTORE`) more efficient and would allow for significant gas cost reductions for various use cases.

Hardfork inclusion of the SIP was extensively discussed during [ACD 135, April 1 2022](https://github.com/sila-chain/pm/issues/500).

SIP can be activated manually with:

```ts
const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.London, sips: [1153] })
```

### Custom Precompiles (L2 Support)

It is now possible to add, override or delete precompiles in the VM with a new `customPrecompiles` option, see PR [#1813](https://github.com/sila-chain/silajs-monorepo/pull/1813). This allows for further customization of VM behavior in addition to the recently added `customOpcodes` option, which can be useful for L2 solutions, SAVM-based side chains, and other L1s.

An SAVM initialization with a custom precompile looks roughly like this where you can provide the intended precompile `address` and some precompile `function` which needs to adhere to some specific format to be internally readable and executable:

```ts
const vm = await VM.create({
  customPrecompiles: [
    {
      address: shaAddress,
      function: customPrecompile,
    },
  ],
})
```

### Other Changes

- Updated `sila/tests` to `10.3`, PR [#1826](https://github.com/sila-chain/silajs-monorepo/pull/1826)
- Set `caller` in `VM.runCall()` to zero address if not provided, PR [#1840](https://github.com/sila-chain/silajs-monorepo/pull/1840)

## 5.8.0 - 2022-03-15

### Merge Kiln v2 Testnet Support

This release fully supports the Merge [Kiln](https://kiln.themerge.dev/) testnet `v2` complying with the latest Merge [specs](https://hackmd.io/@n0ble/kiln-spec). The release is part of an [@silajs/client](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/client) `v0.4` release which can be used to sync with the testnet, combining with a suited consensus client (e.g. the Lodestar client). See [Kiln](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/client/kiln) instructions to get things going! 🚀

In the VM the `merge` HF is now activated as being supported and an (experimental) Merge-ready VM can be instantiated with:

```ts
import VM from '@silajs/vm'
import Common, { Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.Merge })
const vm = new VM({ common })
vm._common.isActivatedEIP(4399) // true
```

- [SIP-4399](https://sips.sila.org/SIPS/sip-4399) Support: Supplant DIFFICULTY opcode with PREVRANDAO, PR [#1565](https://
  github.com/sila-chain/silajs-monorepo/pull/1565)

### SIP-3540: SAVM Object Format (EOF) v1 / SIP-3670: EOF - Code Validation

This release supports [SIP-3540](https://sips.sila.org/SIPS/sip-3540) and [SIP-3670](https://sips.sila.org/SIPS/sip-3670) in an experimental state. Both SIPs together define a container format EOF for the VM in v1 which allows for more flexible SAVM updates in the future and allows for improved SAVM bytecode validation, see PR [#1719](https://github.com/sila-chain/silajs-monorepo/pull/1719).

Note that this SIP is not part of a specific hardfork yet and is considered `EXPERIMENTAL` (implementation can change along bugfix releases).

For now the SIP has to be activated manually which can be done by using a respective `Common` instance:

```ts
const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.London, sips: [3540, 3670] })
```

### SIP-3860 Support: Limit and Meter Initcode

Support for [SIP-3860](https://sips.sila.org/SIPS/sip-3860) has been added to the VM. This SIP limits the maximum size of initcode to 49152 and apply extra gas cost of 2 for every 32-byte chunk of initcode, see PR [#1619](https://github.com/sila-chain/silajs-monorepo/pull/1619).

Also here, implementation still `EXPERIMENTAL` and needs to be manually activated:

```ts
const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.London, sips: [3860] })
```

### L2 Support: Genesis State with Code and Storage

It is now possible within the VM to initialize with an extended genesis state not only containing account balances but also code and storage, see PR [#1757](https://github.com/sila-chain/silajs-monorepo/pull/1757). This is part of our emerging L2 support strategy to allow for a VM instantiation that closer resembles a specific L2 (or generally: custom chain) setup. Many L2 chains come with specific system contracts pre-initialized on genesis - see e.g. [Optimism](https://community.optimism.io/docs/protocol/protocol-2.0/#system-overview).

See `Common` [custom chain initialization API](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/common#initialize-using-customchains-array) on how to initialize a `Common` instance with a code-storage-containing custom genesis state.

Note that state in the VM is not activated by default (this also goes for account-only state). A state activation can now be explicitly triggered though by using the new `activateGenesisState` VM option.

### L2 Support: Custom Opcodes Option

There is now a new option `customOpcodes` for the VM which allows to add custom opcodes to the VM, see PR [#1705](https://github.com/sila-chain/silajs-monorepo/pull/1705). This should be useful for L2s and other SAVM based side chains if they come with a slightly different opcode set for bytecode execution.

New opcodes can be passed in with its own logic function and an additional function for gas calculation. Additionally the new option allows for overwriting and/or deleting existing opcodes.

### Features

- Added new `VM.runBlock()` option `hardforkByTD` for Merge transition support, PR [#1802](https://github.com/sila-chain/silajs-monorepo/pull/1802)

### Bug Fixes & Maintenance

- Fixed `REVERT` bug where under certain conditions (revert reason larger than max code size), too much (all) gas was consumed, PR [#1700](https://github.com/sila-chain/silajs-monorepo/pull/1700)
- Debug log improvements on `VM.runTx()` execution and in `SAVM`, PR [#1677](https://github.com/sila-chain/silajs-monorepo/pull/1677)

## 5.7.1 - 2022-02-04

This patch release adds a guard to not enable the recently added SIP-3607 by default. This helps downstream users who may emulate contract accounts as part of their testing strategies.

- Add guard to not enable SIP-3607 by default, PR [#1691](https://github.com/sila-chain/silajs-monorepo/pull/1691)

Also included is a performance enhancement to skip extra log processing when debug is not enabled:

- Skip `_runStepHook` method if no step event listener, PRs [#1676](https://github.com/sila-chain/silajs-monorepo/pull/1676) [#1681](https://github.com/sila-chain/silajs-monorepo/pull/1681)

## 5.7.0 - 2022-02-01

### Dynamic Gas Costs

Jochem from our team did a great refactoring how the VM handles gas costs in PR [#1364](https://github.com/sila-chain/silajs-monorepo/pull/1364) by splitting up the opcode gas cost calculation (new file: `savm/opcodes/gas.ts`) from their actual behavior (stack edits, getting block hashes, etc.).

This initial work was adopted a bit in PR [#1553](https://github.com/sila-chain/silajs-monorepo/pull/1553) to remain backwards-compatible and now allows to output the dynamic gas cost value in the VM `step` event (see `README`) now taking things like memory usage, address access or storage changes into account and therefore much better reflecting the real gas usage than only showing the (much lower) static part.

So along with the static `opcode.fee` output there is now a new event object property `opcode.dynamicFee`.

### StateManager Refactoring

The VM `StateManager` has been substantially refactored in PR [#1548](https://github.com/sila-chain/silajs-monorepo/pull/1548) and most of the generic functionality has been extracted to a super class `BaseStateManager`. This should make it substantially easier to do custom `StateManager` implementations with an alternative access to the state by inheriting from `BaseStateManager` and only adopting the methods which directly access the underlying data structure. Have a look at the existing `DefaultStateManager` implementation for some guidance.

### Other Features

- New `ProofStateManager` to get an [SIP-1186](https://sips.sila.org/SIPS/sip-1186)-compatible (respectively `eth_getProof rPC endpoint-compatible) proof for a specific address and associated storage slots, PR [#1590](https://github.com/sila-chain/silajs-monorepo/pull/1590) and PR [#1660](https://github.com/sila-chain/silajs-monorepo/pull/1660)
- VM JumpDest analysis refactor for better performance, PR [#1629](https://github.com/sila-chain/silajs-monorepo/pull/1629)
- [SIP-3607](https://sips.sila.org/SIPS/sip-3607): Reject transactions from senders with deployed code, PR [#1568](https://github.com/sila-chain/silajs-monorepo/pull/1568)
- Support for new [SilaSepolia](https://sepolia.ethdevops.io/) PoW test network (use `Chain.SilaSepolia` for `@silajs/common` instance passed in), PR [#1581](https://github.com/sila-chain/silajs-monorepo/pull/1581)
- [SIP-2681](https://sips.sila.org/SIPS/sip-2681): Limit account nonce to 2^64-1, PR [#1608](https://github.com/sila-chain/silajs-monorepo/pull/1608)
- [SIP-3855](https://sips.sila.org/SIPS/sip-3855): Push0 opcode, PR [#1616](https://github.com/sila-chain/silajs-monorepo/pull/1616)

### Bug Fixes & Maintenance

- Addressed consensus issue: tx goes OOG but refunds get applied anyways (thanks @LogvinovLeon for reporting! ❤️), PR [#1603](https://github.com/sila-chain/silajs-monorepo/pull/1603)
- VM now throws when a negative `Call` `value` is passed in, PR [#1606](https://github.com/sila-chain/silajs-monorepo/pull/1606)

## 5.6.0 - 2021-11-09

### ArrowGlacier HF Support

This release adds support for the upcoming [ArrowGlacier HF](https://github.com/sila-chain/execution-specs/blob/master/network-upgrades/sila-mainnet-upgrades/arrow-glacier.md) (see PR [#1527](https://github.com/sila-chain/silajs-monorepo/pull/1527)) targeted for December 2021. The only included SIP is [SIP-4345](https://sips.sila.org/SIPS/sip-4345) which delays the difficulty bomb to June/July 2022.

Please note that for backwards-compatibility reasons the associated Common is still instantiated with `istanbul` by default.

An ArrowGlacier VM can be instantiated with:

```ts
import VM from '@silajs/vm'
import Common, { Chain, Hardfork } from '@silajs/common'

const common = new Common({ chain: Chain.SilaMainnet, hardfork: Hardfork.ArrowGlacier })
const vm = new VM({ common })
```

### Additional Error Context for Error Messages

This release extends the text of the error messages in the library with some consistent context information (see PR [#1540](https://github.com/sila-chain/silajs-monorepo/pull/1540)), here an example for illustration:

Before:

```shell
invalid receiptTrie
```

New:

```
invalid receiptTrie (vm hf=berlin -> block number=1 hash=0x8e368301586b53e30c58dd4734de4b3d6e17db837eb3fbde8cc0036bc7752d9a hf=berlin baseFeePerGas=none txs=1 uncles=0)
```

The extended errors give substantial more object and chain context and should ease debugging.

**Potentially breaking**: Attention! If you do react on errors in your code and do exact error matching (`error.message === 'invalid transaction trie'`) things will break. Please make sure to do error comparisons with something like `error.message.includes('invalid transaction trie')` instead. This should generally be the pattern used for all error message comparisons and is assured to be future proof on all error messages (we won't change the core text in non-breaking releases).

### Other Changes

- Fixed accountExists bug in pre-Spurious Dragon HFs, PR [#1516](https://github.com/sila-chain/silajs-monorepo/pull/1516) and PR [#1524](https://github.com/sila-chain/silajs-monorepo/pull/1524)
- New `putBlockIntoBlockchain` option for `BlockBuilder` (default: `true`), PR [#1530](https://github.com/sila-chain/silajs-monorepo/pull/1530)
- Extended `StateManager.generateGenesis()` to also allow for creating genesis blocks with contract accounts, PR [#1530](https://github.com/sila-chain/silajs-monorepo/pull/1530) and PR [#1541](https://github.com/sila-chain/silajs-monorepo/pull/1541)
- Use `RLP` library exposed by `silajs-util` dependency (deduplication), PR [#1549](https://github.com/sila-chain/silajs-monorepo/pull/1549)

## 5.5.3 - 2021-09-24

- Fixed a consensus-relevant bug in the Blake2B precompile (see [SIP-152](https://sips.sila.org/SIPS/sip-152)) with messages with a length >= 5 (thanks @jochem-brouwer for the great analysis and quick fix on this! ❤️), PR [#1486](https://github.com/sila-chain/silajs-monorepo/pull/1486)
- Improved support for custom chain genesis states in `StateManager.generateCanonicalGenesis()` (see `Common` v2.5.0 release for the corresponding functionality), PR [#1409](https://github.com/sila-chain/silajs-monorepo/pull/1409)
- Fixed `VM.copy()` to also copy the `blockchain` and `common` objects, PR [#1444](https://github.com/sila-chain/silajs-monorepo/pull/1444)

And, also worth to note: we are not susceptible to the IDENTITY precompile bug which caused a minority fork in August 2021, see PR [#1436](https://github.com/sila-chain/silajs-monorepo/pull/1436) and - again - thanks @jochem-brouwer for the quick analysis! 😃

**New Features**

**Bug Fixes and Maintenance**

**Dependencies, CI and Docs**

## 5.5.2 - 2021-08-03

Bug fix release to reverse StateManager interface breaking change. The method `modifyAccountFields` will be re-added in v6 release ([#1024](https://github.com/sila-chain/silajs-monorepo/issues/1024))

## 5.5.1 - 2021-08-02 - deprecated

**New Features**

- StateManager: Added `modifyAccountFields` method to simplify the `getAccount` -> modify fields -> `putAccount` pattern, PR [#1369](https://github.com/sila-chain/silajs-monorepo/pull/1369)
- Report dynamic gas values in `fee` field of `step` event, PR [#1364](https://github.com/sila-chain/silajs-monorepo/pull/1364)

**Bug Fixes**

- Fix SIP1559 bug to include tx value in balance check, fix nonce check, PR [#1372](https://github.com/sila-chain/silajs-monorepo/pull/1372)
- Update `sila/tests` to v9.0.3 and fix for uncles at hardfork transition, PR [#1347](https://github.com/sila-chain/silajs-monorepo/pull/1347)

**Maintenance**

- Update internal `common` usage to new Chain & Hardfork enums, PR [#1363](https://github.com/sila-chain/silajs-monorepo/pull/1363)
- Add tests for wrong transactions, PR [#1374](https://github.com/sila-chain/silajs-monorepo/pull/1374)
- Fix several internal todos, PR [#1375](https://github.com/sila-chain/silajs-monorepo/pull/1375)

**Dependencies, CI and Docs**

- Add hardhat e2e test integration, PR [#1348](https://github.com/sila-chain/silajs-monorepo/pull/1348)

## 5.5.0 - 2021-07-08

### Finalized London HF Support

This release integrates a `Common` library version which provides the `london` HF blocks for all networks including `sila-mainnet` and is therefore the first release with finalized London HF support.

### Included Source Files

Source files from the `src` folder are now included in the distribution build, see PR [#1301](https://github.com/sila-chain/silajs-monorepo/pull/1301). This allows for a better debugging experience in debug tools like Chrome DevTools by having working source map references to the original sources available for inspection.

### Other Changes & Fixes

- Improved browser compatibility by replacing `instanceof` calls on tx objects with functionality checks, PR [#1315](https://github.com/sila-chain/silajs-monorepo/pull/1315)

## 5.4.2 - 2021-07-06

- BlockBuilder: allow customizable baseFeePerGas, PR [#1326](https://github.com/sila-chain/silajs-monorepo/pull/1326)

## 5.4.1 - 2021-06-11

This release comes with some additional `SIP-1559` checks and functionality:

- Additional 1559 check in `VM.runTx()` that the tx sender balance must be >= gas_limit \* max_fee_per_gas, PR [#1272](https://github.com/sila-chain/silajs-monorepo/pull/1272)
- Additional 1559 check in `VM.runTx()` to ensure that the user was willing to at least pay the base fee (`transaction.max_fee_per_gas >= block.base_fee_per_gas`), PR [#1276](https://github.com/sila-chain/silajs-monorepo/pull/1276)
- 1559 support for the BlockBuilder (`VM.buildBlock()`) by setting the new block's `baseFeePerGas` to `parentBlock.header.calcNextBaseFee()`, PR [#1280](https://github.com/sila-chain/silajs-monorepo/pull/1280)

## 5.4.0 - 2021-05-26

### Functional London HF Support (no finalized HF blocks yet)

This `VM` release comes with full functional support for the `london` hardfork (all SIPs are finalized and integrated and `london` HF can be activated, there are no final block numbers for the HF integrated though yet). Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `VM` with the `london` HF activated:

```ts
import VM from '@silajs/vm'
import Common from '@silajs/common'
const common = new Common({ chain: 'sila-mainnet', hardfork: 'london' })
const vm = new VM({ common })
```

Support for the following SIPs has been added:

- [SIP-1559](https://sips.sila.org/SIPS/sip-1559): Fee market change for SIL 1.0 chain, PR [#1148](https://github.com/sila-chain/silajs-monorepo/pull/1148)
- [SIP-3198](https://sips.sila.org/SIPS/sip-3198): BASEFEE opcode, PR [#1148](https://github.com/sila-chain/silajs-monorepo/pull/1148)
- [SIP-3529](https://sips.sila.org/SIPS/sip-3529): Reduction in refunds, PR [#1239](https://github.com/sila-chain/silajs-monorepo/pull/1239)
- [SIP-3541](https://sips.sila.org/SIPS/sip-3541): Reject new contracts starting with the 0xEF byte, PR [#1240](https://github.com/sila-chain/silajs-monorepo/pull/1240)

It is also possible to run these SIPs in isolation by instantiating a `berlin` common and activate selected SIPs with the `sips` option:

```ts
const common = new Common({ chain: 'sila-mainnet', hardfork: 'berlin', sips: [3529] })
```

#### SIP-1559: Gas Fee Market

The VM can now run `SIP-1559` compatible blocks (introduced with the `@silajs/block` `v3.3.0` release) with `VM.runBlock()` as well as `SIP-1559` txs with type `2` (introduced along the `@silajs/tx` `v3.2.0` release), which can now be passed to `VM.runTx()` as the tx to be executed. Block and tx validation is happening accordingly and the gas calculation takes the new gas fee market parameters from the block (`baseFeePerGas`) and the tx(s) (`maxFeePerGas` and `maxPriorityFeePerGas` instead of a `gasPrice`) into account.

#### SIP-3198: BASEFEE Opcode

There is a new opcode `BASEFEE` added to the VM, see PR [#1148](https://github.com/sila-chain/silajs-monorepo/pull/1148). This opcode is active starting with `london` and returns the base fee of the current executed upon block.

#### SIP-3529: Reduction in Refunds

`SIP-3529` removes gas refunds for `SELFDESTRUCT`, and reduces gas refunds for `SSTORE`, an implementation has been done in PR [#1239](https://github.com/sila-chain/silajs-monorepo/pull/1239).

#### SIP-3541: Reject new Contracts with the 0xEF Byte

There is a new SAVM Object Format (EOF) in preparation which will allow to validate contracts at deploy time. This SIP is a preparation for the introduction of this format and disallows contracts which start with the `0xEF` byte. Contracts created in the VM via create transaction, `CREATE` or `CREATE2` starting with this byte are now rejected when the SIP is activated and an `INVALID_BYTECODE_RESULT` is returned as an SAVM error with the result, see PR [#1240](https://github.com/sila-chain/silajs-monorepo/pull/1240).

### StateManager: Preserve State History

This VM release bumps the `merkle-patricia-tree` dependency to `v4.2.0`, which is used as a datastore for the default `StateManager` implementation. The new MPT version switches to a default behavior to not delete any trie nodes on checkpoint commits, which has implications on the `StateManager.commit()` function which internally calls the MPT commit. This allows to go back to older trie states by setting a new (old) state root with `StateManager.setStateRoot()`. The trie state is now guaranteed to still be consistent and complete, which has not been the case before and lead to erroneous behaviour in certain usage scenarios (e.g. reported by HardHat).

See PR [#1262](https://github.com/sila-chain/silajs-monorepo/pull/1262)

### Error Handling: Correct Non-VM Error Propagation

In former versions of the VM non-VM errors happing inside the VM have been (unintentionally) shielded by a `try / catch` clause in the VM `Interpreter` class. This lead to existing bugs being hidden and channeled through as VM errors, which made it extremely difficult to trace such bugs down to the root cause. These kind of errors are now properly propagated and therefore lead to a break of the VM control flow. Please note that this might lead to your code breaking _if_ you have got an error in your implementation (this should be a good this though since now this bug can finally be fixed 😀 ).

See PR [#1168](https://github.com/sila-chain/silajs-monorepo/pull/1168)

### Bug Fixes

- StateManager: fixed buffer comparison in `setStateRoot()`, PR [#1212](https://github.com/sila-chain/silajs-monorepo/pull/1212)

### Other Changes

- New `blockGasUsed` option for `VM.runTx()` allowing to provide the block gas used up until the tx to be executed to obtain an accurate tx receipt, PR [#1264](https://github.com/sila-chain/silajs-monorepo/pull/1264)
- `StateManager.getStateRoot()` is not throwing any more on uncommitted checkpoints, PR [#1216](https://github.com/sila-chain/silajs-monorepo/pull/1216)

## 5.3.2 - 2021-04-12

This is a hot-fix performance release, removing the `debug` functionality from PR [#1080](https://github.com/sila-chain/silajs-monorepo/pull/1080) and follow-up PRs. While highly useful for debugging, this feature side-introduced a significant reduction in VM performance which went along unnoticed. For now we will remove since upstream dependencies are awaiting a new release before the `Berlin` HF happening. We will try to re-introduce in a performance friendly manner in some subsequent release (we cannot promise on that though).

See PR [#1198](https://github.com/sila-chain/silajs-monorepo/pull/1198).

## 5.3.1 - 2021-04-09

**Features**

- Added `receipt` to `RunTxResult`, moved the tx receipt generation logic from `VM.runBlock()` to `VM.runTx()` (`generateTxReceipt()` and receipt exports in `runBlock` are now marked as _deprecated_), PR [#1185](https://github.com/sila-chain/silajs-monorepo/pull/1185)

**Bug Fixes**

- Fixed BlockBuilder (see `v5.3.0` release) to allow building a block with zero txs, PR [#1185](https://github.com/sila-chain/silajs-monorepo/pull/1185)
- BlockBuilder: Moves the `stateManager.commit` to after putting the block in blockchain in case it throws on validating, PR [#1185](https://github.com/sila-chain/silajs-monorepo/pull/1185)

**Testing**

- Added test cases for legacy and access list transactions to `VM.runBlock()` tests, PR [#1185](https://github.com/sila-chain/silajs-monorepo/pull/1185)
- Added type safety test (thanks to @alcuadrado from Hardhat for this code magic piece ❤️), PR [#1185](https://github.com/sila-chain/silajs-monorepo/pull/1185)

## 5.3.0 - 2021-03-31

### SIP-2930 Tx Access List Generation

This release adds the ability to generate access lists from tx runs with `VM.runTx()`, see PR [#1170](https://github.com/sila-chain/silajs-monorepo/pull/1170). There is a new option `reportAccessList` which can be used on all tx types to generate an access list as defined by [SIP-2930](https://sips.sila.org/SIPS/sip-2930) which is then returned along the `VM.runTx()` result adhering to the `@silajs/tx` `AccessList` TypeScript type definition.

Note that this functionality needs the new `StateManager.generateAccessList()` function which is not yet part of the `StateManager` interface for compatibility reasons. If you implement an own `StateManager` make sure that this function is present (e.g. by inheriting your `StateManager` from the `DefaultStateManager` implementation).

Another note: there is an edge case on accessList generation where an internal call might revert without an accessList but pass if the accessList is used for a tx run (so the subsequent behavior might change). This edge case is not covered by this implementation.

### New Block Builder

There is a new Block Builder API for creating new blocks on top of the current state by adding transactions one at a time, see PR [#1158](https://github.com/sila-chain/silajs-monorepo/pull/1158).

It can be used like the following:

```ts
const blockBuilder = await vm.buildBlock({ parentBlock, blockData, blockOpts })
const txResult = await blockBuilder.addTransaction(tx)
// reset the state with `blockBuilder.revert()`
const block = await blockBuilder.build()
```

When the block is built it becomes fully executed in the vm and its blockchain.

### Other Changes

- Fixed `VM.runBlock()` with `generate: true` by setting the header fields for `gasUsed`, `logsBloom`, `receiptTrie`, and `transactionsTrie`, PR [#1158](https://github.com/sila-chain/silajs-monorepo/pull/1158)
- Fixed a bug in `VM.runTx()` with `reportAccessList=true`returning addresses without a `0x` prefix, PR [#1183](https://github.com/sila-chain/silajs-monorepo/pull/1183)
- Do not include the tx sender address in the access list in `VM.runTx()` with `reportAccessList=true`, only include the `to` address if storage slots have been touched, PR [#1183](https://github.com/sila-chain/silajs-monorepo/pull/1183)

## 5.2.0 - 2021-03-18

### Berlin HF Support

This release is the first VM release with official `berlin` HF support. All `SilaJS` dependencies are updated with `berlin` enabling versions and support for all SIPs which finally made it into `berlin` has been added, namely:

- [SIP-2565](https://sips.sila.org/SIPS/sip-2565): ModExp gas cost
- [SIP-2718](https://sips.sila.org/SIPS/sip-2718): Typed transactions
- [SIP-2929](https://sips.sila.org/SIPS/sip-2929): Gas cost increases for state access opcodes
- [SIP-2930](https://sips.sila.org/SIPS/sip-2930): Optional Access Lists Typed Transactions

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `VM` instance with a `berlin` HF activated:

```ts
import VM from '@silajs/vm'
import Common from '@silajs/common'
const common = new Common({ chain: 'sila-mainnet', hardfork: 'berlin' })
const vm = new VM({ common })
```

There is a relatively broad set of changes since the last VM version `v5.1.0` introducing support for a first set of to-be-expected `berlin` SIPs, here is a summary:

#### Added Typed Transaction Support (SIP-2718 / SIP-2930)

The VM is now prepared to work with Typed Transactions ([SIP2718](https://sips.sila.org/SIPS/sip-2718)) which have been introduced along the `@silajs/tx` `v3.1.0` release. It now therefore gets possible to pass typed txs to `VM.runTx()` respectively a block containing typed txs to `VM.runBlock()`, see PR [#1048](https://github.com/sila-chain/silajs-monorepo/pull/1048) and PR [#1138](https://github.com/sila-chain/silajs-monorepo/pull/1138).

There is a first concrete tx type 1 including optional access lists added along the `berlin` HF ([SIP2930](https://sips.sila.org/SIPS/sip-2930)). Access lists are now properly detected by the VM and gas costs calculated accordingly.

#### Fixed SIP-2929 Implementation

Our implementation of `SIP-2929` (gas cost increases for state access opcodes) was falling short in the form that warm storage slots / addresses were only tracked per internal message, not on the entire transaction as implied by the SIP. This needed a relatively intense rework along PR [#1124](https://github.com/sila-chain/silajs-monorepo/pull/1124). We are now confident in the implementation and official tests are passing.

Along with this rework a new `StateManager` interface `SIP2929StateManager` has been introduced which inherits from `StateManager` and adds the following methods:

```ts
export interface SIP2929StateManager extends StateManager {
  addWarmedAddress(address: Buffer): void
  isWarmedAddress(address: Buffer): boolean
  addWarmedStorage(address: Buffer, slot: Buffer): void
  isWarmedStorage(address: Buffer, slot: Buffer): boolean
  clearWarmedAccounts(): void
}
```

The `StateManager` base interface and the inherited `SIP2929StateManager` interface will be merged again on the next breaking release.

#### Removed SIP-2315 from Berlin

`SIP-2315` has been removed from the list of SIPs included in `berlin`. This is ensured by using a `Common` dependency version `v2.2.0`+ containing the final list of `Berlin` SIPs and also needed some changes in the VM code, see PR [#1142](https://github.com/sila-chain/silajs-monorepo/pull/1142).

#### SilaJS Libraries - Typed Transactions Readiness

If you are using this library in conjunction with other SilaJS libraries make sure to minimally have the following library versions installed for typed transaction support:

- `@silajs/common` `v2.2.0`
- `@silajs/tx` `v3.1.0`
- `@silajs/block` `v3.2.0`
- `@silajs/blockchain` `v5.2.0`
- `@silajs/vm` `v5.2.0`

### Other Features

- `{ stateRoot, gasUsed, logsBloom, receiptRoot }` have been added to `RunBlockResult` and will be emitted with `afterBlock`, PR [#853](https://github.com/sila-chain/silajs-monorepo/pull/853)
- Added `vm:eei:gas` EEI gas debug logger, PR [#1124](https://github.com/sila-chain/silajs-monorepo/pull/1124)

### Other Fixes

- Fixes VM Node 10 support being broken due to the usage of `globalThis` for browser detection, PR [#1151](https://github.com/sila-chain/silajs-monorepo/pull/1151)
- Fixed `ECRECOVER` precompile to work correctly on networks with very large chain IDs, PR [#1139](https://github.com/sila-chain/silajs-monorepo/pull/1139)

**CI and Test Improvements**

- Benchmark improvements and fixes, PR [#853](https://github.com/sila-chain/silajs-monorepo/pull/853)

### 5.1.0 - 2021-02-22

### Clique/PoA Support

This release introduces Clique/PoA support, see the main PR [#1032](https://github.com/sila-chain/silajs-monorepo/pull/1032) as well as the follow-up PRs [#1074](https://github.com/sila-chain/silajs-monorepo/pull/1074) and PR [#1088](https://github.com/sila-chain/silajs-monorepo/pull/1088). This means that you now can run a VM with blocks or transactions from the main PoA networks `Goerli` and `Rinkeby` and generally can use the VM in a Clique/PoA context.

Here is a simple example:

```ts
import VM from '@silajs/vm'
import Common from '@silajs/common'

const common = new Common({ chain: 'goerli' })
const hardforkByBlockNumber = true
const vm = new VM({ common, hardforkByBlockNumber })

const serialized = Buffer.from('f901f7a06bfee7294bf4457...', 'hex')
const block = Block.fromRLPSerializedBlock(serialized, { hardforkByBlockNumber })
const result = await vm.runBlock(block)
```

All the corresponding internal dependencies have been updated to Clique/PoA supporting versions, namely:

- @silajs/block -> `v3.1.0`
- @silajs/blockchain -> `v5.1.0`
- @silajs/common" -> `v2.1.0`

Note that you need to also use library versions equal or higher than the ones mentioned above when you pass in an instance from one of the libraries to an API call (e.g. `VM.runBlock()`, see example above) to ensure everything is working properly in a Clique/PoA context.

New VM behavior in a Clique/PoA context:

- `VM.runBlock()`: If you do block validation along block runs blocks are now validated to comply with the various Clique/PoA block format specifications (various `extraData` checks e.g.)
- `VM.runBlock()`: There is no assignment of block rewards to the `coinbase` account taking place
- `VM.runTx()`: Tx fees are attributed to the block signer instead of the `coinbase` account
- `COINBASE` opcode: The `COINBASE` opcode returns the block signer instead of the `coinbase` address (Clique specification)

### StateManager Checkpointing Performance

This is the first release which reliably exposes performance gains on all checkpointing operations by integrating the respective `merkle-patricia-trie` [v4.1.0](https://github.com/sila-chain/silajs-monorepo/releases/tag/merkle-patricia-tree%404.1.0) where the checkpointing mechanism has been reworked substantially.

This leads to linearly growing performance gains on all checkpointing operations (in `VM.runBlock()`, `VM.runTx()` as well as along all `message` calls) along with the size of the trie (state) being operated upon. In practice we have seen 10-50x increases when working on blocks from `sila-mainnet` or the other test networks.

We would be happy on some feedback if this integration is noticeable in your execution context! 😀

### New SIPs

#### SIP-2565: ModExp precompile gas cost

This release adds support for [SIP 2565](https://sips.sila.org/SIPS/sip-2565), ModExp precompile gas cost, which is planned to be included in the Berlin hardfork, see PR [#1026](https://github.com/sila-chain/silajs-monorepo/pull/1026).

#### VM Debug Logger

The VM now comes with an integrated debug logger which gives you fine-grained control to display selected log output along the VM execution flow, see PR [#1080](https://github.com/sila-chain/silajs-monorepo/pull/1080). These loggers use the [debug](https://github.com/visionmedia/debug) library and can be activated on the CL with `DEBUG=[Logger Selection] node [Your Script to Run].js` and produce output like the following:

![SilaJS VM Debug Logger](./debug.png?raw=true)

For an overview on the different loggers available see the respective [README section](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#understanding-the-vm).

### Other Features

- The `afterBlock` (`VM.runBlock()`) and `afterTx` (`VM.runTx()`) events now expose the respective block or transaction in the event results, PR [#965](https://github.com/sila-chain/silajs-monorepo/pull/965)
- New `hardforkByBlockNumber` VM constructor option for `VM.runBlock()` runs (see also corresponding `Block` option), PR [#966](https://github.com/sila-chain/silajs-monorepo/pull/966) and [#967](https://github.com/sila-chain/silajs-monorepo/pull/967) (option renamed along release PR)
- Added new optional `maxBlocks` option to `VM.runBlockchain()`, PR [#1025](https://github.com/sila-chain/silajs-monorepo/pull/1025)
- `VM.runBlockchain()` now returns the number of actual blocks run (needs `Blockchain` `v5.1.0` or higher, `void` kept in `TypeScript` function signature for backwards-compatibility), PR [#1065](https://github.com/sila-chain/silajs-monorepo/pull/1065)
- New option `skipBlockGasLimitValidation` to disable the block gas limit check in `VM.runTx()`, PR [#1039](https://github.com/sila-chain/silajs-monorepo/pull/1039)
- Added type definition `Log` for logs in `TxReceipt` items returned (result of `VM.runBlocks()` and `afterBlock` event), PR [#1084](https://github.com/sila-chain/silajs-monorepo/pull/1084)

### Bug Fixes

- **Consensus**: fixed `Frontier` consensus bug along `CREATE` with not enough gas, PR [#1081](https://github.com/sila-chain/silajs-monorepo/pull/1081)
- Update opcodes along HF switches, added a dedicated `tangerineWhistle` opcode list (no need for calls to `VM._updateOpcodes()` on HF switches manually any more), PR [#1101](https://github.com/sila-chain/silajs-monorepo/pull/1101) and [#1112](https://github.com/sila-chain/silajs-monorepo/pull/1112)
- Use `common` from VM when creating default blocks in `VM.runCall()` and `VM.runCode()`, PR [#1011](https://github.com/sila-chain/silajs-monorepo/pull/1011)
- Fixed a bug when the result of the `MODEXP` opcode is 0, PR [#1026](https://github.com/sila-chain/silajs-monorepo/pull/1026)

### Maintenance

- Updated `run-solidity-contract` example, PR [#1104](https://github.com/sila-chain/silajs-monorepo/pull/1104)
- Updated `sila/tests` submodule to `1fcd4e5` (2021-02-02), PR [#1116](https://github.com/sila-chain/silajs-monorepo/pull/1116)
- Only expose API method on docs, PR [#1119](https://github.com/sila-chain/silajs-monorepo/pull/1119)

## 5.0.0 - 2020-11-24

### New Package Name

**Attention!** This new version is part of a series of SilaJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `silajs-vm` -> `@silajs/vm`

Please update your library references accordingly or install with:

```shell
npm i @silajs/vm
```

### Support for all current Hardforks / HF API Changes

This is the first release of the VM which supports all hardforks currently applied on sila-mainnet starting with the support of the Frontier HF rules all along up to MuirGlacier. 🎉

The following HFs have been added:

- **Spurious Dragon**, PR [#791](https://github.com/sila-chain/silajs-monorepo/pull/791)
- **Tangerine Whistle**, PR [#807](https://github.com/sila-chain/silajs-monorepo/pull/807)
- **DAO**, PR [#843](https://github.com/sila-chain/silajs-monorepo/pull/843)
- **Homestead**, PR [#815](https://github.com/sila-chain/silajs-monorepo/pull/815)
- **Frontier**, PR [#828](https://github.com/sila-chain/silajs-monorepo/pull/828)

A VM with the specific HF rules (on the chain provided) can be instantiated by passing in a `Common` instance:

```ts
import VM from '@silajs/vm'
import Common from '@silajs/common'

const common = new Common({ chain: 'sila-mainnet', hardfork: 'spuriousDragon' })
const vm = new VM({ common })
```

**Breaking**: The default HF from the VM has been updated from `petersburg` to `istanbul`. The HF setting is now automatically taken from the HF set for `Common.DEFAULT_HARDFORK`, see PR [#906](https://github.com/sila-chain/silajs-monorepo/pull/906).

**Breaking**: Please note that the options to directly pass in `chain` and `hardfork` strings have been removed to simplify the API. Providing a `Common` instance is now the only way to change the chain setup, see PR [#863](https://github.com/sila-chain/silajs-monorepo/pull/863)

### Berlin HF Support / HF-independent SIPs

This releases adds support for subroutines (`SIP-2315`) which gets activated under the `berlin` HF setting which can now be used as a `hardfork` instantiation option, see PR [#754](https://github.com/sila-chain/silajs-monorepo/pull/754).

**Attention!** Berlin HF support is still considered experimental and implementations can change on non-major VM releases!

Support for BLS12-381 precompiles (`SIP-2537`) is added as an independent SIP implementation - see PR [#785](https://github.com/sila-chain/silajs-monorepo/pull/785) - since there is still an ongoing discussion on taking this SIP in for Berlin or using a more generalized approach on curve computation with the Sila SAVM (`evm384` by the eWASM team).

Another new SIP added is the `SIP-2929` with gas cost increases for state access opcodes, see PR [#889](https://github.com/sila-chain/silajs-monorepo/pull/889).

These integrations come along with an API addition to the VM to support the activation of specific SIPs, see PR [#856](https://github.com/sila-chain/silajs-monorepo/pull/856), PR [#869](https://github.com/sila-chain/silajs-monorepo/pull/869) and PR [#872](https://github.com/sila-chain/silajs-monorepo/pull/872).

This API can be used as follows:

```ts
import Common from '@silajs/common'
import VM from '@silajs/vm'

const common = new Common({ chain: 'sila-mainnet', sips: [2537] })
const vm = new VM({ common })
```

### API Change: New Major Library Versions

The following `SilaJS` libraries which are used within the VM internally and can be passed in on instantiation have been updated to new major versions.

- `merkle-patricia-tree` `v3` (VM option `state`) -> `merkle-patricia-tree` `v4`, PR [#787](https://github.com/sila-chain/silajs-monorepo/pull/787)
- `silajs-blockchain` `v4`-> `@silajs/blockchain` `v5`, PR [#833](https://github.com/sila-chain/silajs-monorepo/pull/833)
- `silajs-common` `v1` -> `@silajs/common` `v2`

**Breaking**: If you pass in instances of these libraries to the VM please make sure to update these library versions as stated. Please also take a note on the package name changes!

All these libraries are now written in `TypeScript` and use promises instead of callbacks for accessing their APIs.

### New StateManager Interface / StateManager API Changes

There is now a new `TypeScript` interface for the `StateManager`, see PR [#763](https://github.com/sila-chain/silajs-monorepo/pull/763). If you are
using a custom `StateManager` you can use this interface to get better assurance that you are using a `StateManager` which conforms with the current `StateManager` API and will run in the VM without problems.

The integration of this new interface is highly encouraged since this release also comes with `StateManager` API changes. Usage of the old
[silajs-account](https://github.com/sila-chain/silajs/silajs-account) package (this package will be retired) has been replaced by the new
[Account class](https://github.com/sila-chain/silajs/silajs-util/blob/master/docs/modules/_account_.md) from the `silajs-util` package. This affects all `Account` related `StateManager` methods, see PR [#911](https://github.com/sila-chain/silajs-monorepo/pull/911).

The Util package also introduces a new [Address class](https://github.com/sila-chain/silajs/silajs-util/blob/master/docs/modules/_address_.md). This class replaces all current `Buffer` inputs on `StateManager` methods representing an address.

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on PR [#913](https://github.com/sila-chain/silajs-monorepo/pull/913) with an update to `ESLint` from `TSLint` for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see PR [#921](https://github.com/sila-chain/silajs-monorepo/pull/921). This will result in performance benefits for Node.js consumers, see [here](https://github.com/sila-chain/silajs/merkle-patricia-tree/pull/117) for a related discussion.

### Other Changes

**Changes and Refactoring**

- Group opcodes based upon hardfork, PR [#798](https://github.com/sila-chain/silajs-monorepo/pull/798)
- Split opcodes logic into codes, fns, and utils files, PR [#896](https://github.com/sila-chain/silajs-monorepo/pull/896)
- Group precompiles based upon hardfork, PR [#783](https://github.com/sila-chain/silajs-monorepo/pull/783)
- **Breaking:** the `step` event now emits an `silajs-util` [Account](https://github.com/sila-chain/silajs/silajs-util/blob/master/docs/modules/_account_.md) object instead of an [silajs-account](https://github.com/sila-chain/silajs/silajs-account)
  (package retired) object
- **Breaking:** `NewContractEvent` now emits an `address` of type `Address` (see `silajs-util`) instead of a `Buffer`, PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `EVMResult` now returns a `createdAddress` of type `Address` (see `silajs-util`) instead of a `Buffer`, PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `RunTxResult` now returns a `createdAddress` of type `Address` (see `silajs-util`) instead of a `Buffer`, PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `RunCallOpts` now expects `origin`, `caller` and `to` inputs to be of type `Address` (see `silajs-util`) instead of a `Buffer`, PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `RunCodeOpts` now expects `origin`, `caller` and `address` inputs to be of type `Address` (see `silajs-util`) instead of a `Buffer`, PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- Visibility cleanup (Renaming and/or code docs additions) for class members not being part of the API, PR [#925](https://github.com/sila-chain/silajs-monorepo/pull/925)
- Make `memory.ts` use Buffers instead of Arrays, PR [#850](https://github.com/sila-chain/silajs-monorepo/pull/850)
- Use `Map` for `OpcodeList` and `opcode` handlers, PR [#852](https://github.com/sila-chain/silajs-monorepo/pull/852)
- Compare buffers directly, PR [#851](https://github.com/sila-chain/silajs-monorepo/pull/851)
- Moved gas base fees from VM to Common, PR [#806](https://github.com/sila-chain/silajs-monorepo/pull/806)
- Return precompiles on `getPrecompile()` based on hardfork, PR [#783](https://github.com/sila-chain/silajs-monorepo/pull/783)
- Removed `async` dependency, PR [#779](https://github.com/sila-chain/silajs-monorepo/pull/779)
- Updated `silajs-util` to v7, PR [#748](https://github.com/sila-chain/silajs-monorepo/pull/748)

**CI and Test Improvements**

- New benchmarking tool for the VM, CI integration on GitHub actions, PR [#794](https://github.com/sila-chain/silajs-monorepo/pull/794) and PR [#830](https://github.com/sila-chain/silajs-monorepo/pull/830)
- Various updates, fixes and refactoring work on the test runner, PR [#752](https://github.com/sila-chain/silajs-monorepo/pull/752) and PR [#849](https://github.com/sila-chain/silajs-monorepo/pull/849)
- Integrated `silajs-testing` code logic into VM for more flexible future test load optimizations, PR [#808](https://github.com/sila-chain/silajs-monorepo/pull/808)
- Transition VM tests to TypeScript, PR [#881](https://github.com/sila-chain/silajs-monorepo/pull/881) and PR [#882](https://github.com/sila-chain/silajs-monorepo/pull/882)
- On-demand state and blockchain test runs for all hardforks triggered by PR label, PR [#951](https://github.com/sila-chain/silajs-monorepo/pull/951)
- Dropped `silajs-testing` dev dependency, PR [#953](https://github.com/sila-chain/silajs-monorepo/pull/953)

**Bug Fixes**

- Fix `activatePrecompiles`, PR [#797](https://github.com/sila-chain/silajs-monorepo/pull/797)
- Strip zeros when putting contract storage in StateManager, PR [#880](https://github.com/sila-chain/silajs-monorepo/pull/880)
- Two bug fixes along `istanbul` `SSTORE` gas calculation, PR [#870](https://github.com/sila-chain/silajs-monorepo/pull/870)
- Security fixes by `mcl-wasm` package dependency update, PR [#955](https://github.com/sila-chain/silajs-monorepo/pull/955)

## 5.0.0-rc.1 - 2020-11-19

This is the first release candidate towards a final library release, see [beta.2](https://github.com/sila-chain/silajs-monorepo/releases/tag/%40silajs%2Fvm%405.0.0-beta.2) and especially [beta.1](https://github.com/sila-chain/silajs-monorepo/releases/tag/%40silajs%2Fvm%405.0.0-beta.1) release notes for an overview on the full changes since the last publicly released version.

- Security fixes by `mcl-wasm` package dependency update, PR [#955](https://github.com/sila-chain/silajs-monorepo/pull/955)
- On-demand state and blockchain test runs for all hardforks triggered by PR label, PR [#951](https://github.com/sila-chain/silajs-monorepo/pull/951)
- Dropped `silajs-testing` dev dependency, PR [#953](https://github.com/sila-chain/silajs-monorepo/pull/953)

## 5.0.0-beta.2 - 2020-11-12

This is the second beta release towards a final library release, see [beta.1 release notes](https://github.com/sila-chain/silajs-monorepo/releases/tag/%40silajs%2Fvm%405.0.0-beta.1) for an overview on the full changes since the last publicly released version.

- Fixed `SSTORE` gas calculation on `constantinople`, PR [#931](https://github.com/sila-chain/silajs-monorepo/pull/931)
- Visibility cleanup (Renaming and/or code docs additions) for class members not being part of the API, PR [#925](https://github.com/sila-chain/silajs-monorepo/pull/925)

## 5.0.0-beta.1 - 2020-10-22

### New Package Name

**Attention!** This new version is part of a series of SilaJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `silajs-monorepo` -> `@silajs/vm`

Please update your library references accordingly or install with:

```shell
npm i @silajs/vm
```

### Support for all current Hardforks / HF API Changes

This is the first release of the VM which supports all hardforks
currently applied on sila-mainnet starting with the support of the
Frontier HF rules all along up to MuirGlacier. 🎉

The following HFs have been added:

- **Spurious Dragon**,
  PR [#791](https://github.com/sila-chain/silajs-monorepo/pull/791)
- **Tangerine Whistle**,
  PR [#807](https://github.com/sila-chain/silajs-monorepo/pull/807)
- **DAO**,
  PR [#843](https://github.com/sila-chain/silajs-monorepo/pull/843)
- **Homestead**,
  PR [#815](https://github.com/sila-chain/silajs-monorepo/pull/815)
- **Frontier**,
  PR [#828](https://github.com/sila-chain/silajs-monorepo/pull/828)

A VM with the specific HF rules (on the chain provided) can be instantiated
by passing in a `Common` instance:

```ts
import VM from '@silajs/vm'
import Common from '@silajs/common'

const common = new Common({ chain: 'sila-mainnet', hardfork: 'spuriousDragon' })
const vm = new VM({ common })
```

**Breaking**: The default HF from the VM has been updated from `petersburg` to `istanbul`.
The HF setting is now automatically taken from the HF set for `Common.DEFAULT_HARDFORK`,
see PR [#906](https://github.com/sila-chain/silajs-monorepo/pull/906).

**Breaking**: Please note that the options to directly pass in
`chain` and `hardfork` strings have been removed to simplify the API.
Providing a `Common` instance is now the only way to change
the chain setup, see PR [#863](https://github.com/sila-chain/silajs-monorepo/pull/863)

### Berlin HF Support / HF-independent SIPs

This releases adds support for subroutines (`SIP-2315`) which gets
activated under the `berlin` HF setting which can now be used
as a `hardfork` instantiation option, see
PR [#754](https://github.com/sila-chain/silajs-monorepo/pull/754).

**Attention!** Berlin HF support is still considered experimental
and implementations can change on non-major VM releases!

Support for BLS12-381 precompiles (`SIP-2537`) is added as an independent SIP
implementation - see PR [#785](https://github.com/sila-chain/silajs-monorepo/pull/785) -
since there is still an ongoing discussion on taking this SIP in for Berlin or
using a more generalized approach on curve computation with the Sila SAVM
(`evm384` by the eWASM team).

Another new SIP added is the `SIP-2929` with gas cost increases for state access
opcodes, see PR [#889](https://github.com/sila-chain/silajs-monorepo/pull/889).

These integrations come along with an API addition to the VM to support the activation
of specific SIPs, see PR [#856](https://github.com/sila-chain/silajs-monorepo/pull/856),
PR [#869](https://github.com/sila-chain/silajs-monorepo/pull/869) and
PR [#872](https://github.com/sila-chain/silajs-monorepo/pull/872).

This API can be used as follows:

```ts
import Common from '@silajs/common'
import VM from '@silajs/vm'

const common = new Common({ chain: 'sila-mainnet', sips: [2537] })
const vm = new VM({ common })
```

### API Change: New Major Library Versions

The following `SilaJS` libraries which are used within the VM internally
and can be passed in on instantiation have been updated to new major versions.

- `merkle-patricia-tree` `v3` (VM option `state`) -> `merkle-patricia-tree` `v4`,
  PR [#787](https://github.com/sila-chain/silajs-monorepo/pull/787)
- `silajs-blockchain` `v4`-> `@silajs/blockchain` `v5`,
  PR [#833](https://github.com/sila-chain/silajs-monorepo/pull/833)
- `silajs-common` `v1` -> `@silajs/common` `v2`

**Breaking**: If you pass in instances of these libraries to the VM please make sure to
update these library versions as stated. Please also take a note on the
package name changes!

All these libraries are now written in `TypeScript` and use promises instead of
callbacks for accessing their APIs.

### New StateManager Interface / StateManager API Changes

There is now a new `TypeScript` interface for the `StateManager`, see
PR [#763](https://github.com/sila-chain/silajs-monorepo/pull/763). If you are
using a custom `StateManager` you can use this interface to get better
assurance that you are using a `StateManager` which conforms with the current
`StateManager` API and will run in the VM without problems.

The integration of this new interface is highly encouraged since this release
also comes with `StateManager` API changes. Usage of the old
[silajs-account](https://github.com/sila-chain/silajs/silajs-account) package
(this package will be retired) has been replaced by the new
[Account class](https://github.com/sila-chain/silajs/silajs-util/blob/master/docs/modules/_account_.md)
from the `silajs-util` package. This affects all `Account` related
`StateManager` methods, see PR [#911](https://github.com/sila-chain/silajs-monorepo/pull/911).

The Util package also introduces a new
[Address class](https://github.com/sila-chain/silajs/silajs-util/blob/master/docs/modules/_address_.md).
This class replaces all current `Buffer` inputs on `StateManager` methods representing an address.

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on
PR [#913](https://github.com/sila-chain/silajs-monorepo/pull/913) with an update to `ESLint` from `TSLint`
for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce
a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see
PR [#921](https://github.com/sila-chain/silajs-monorepo/pull/921). This will result
in performance benefits for Node.js consumers, see [here](https://github.com/sila-chain/silajs/merkle-patricia-tree/pull/117) for a related discussion.

### Other Changes

**Changes and Refactoring**

- Group opcodes based upon hardfork,
  PR [#798](https://github.com/sila-chain/silajs-monorepo/pull/798)
- Split opcodes logic into codes, fns, and utils files,
  PR [#896](https://github.com/sila-chain/silajs-monorepo/pull/896)
- Group precompiles based upon hardfork,
  PR [#783](https://github.com/sila-chain/silajs-monorepo/pull/783)
- **Breaking:** the `step` event now emits an `silajs-util`
  [Account](https://github.com/sila-chain/silajs/silajs-util/blob/master/docs/modules/_account_.md)
  object instead of an [silajs-account](https://github.com/sila-chain/silajs/silajs-account)
  (package retired) object
- **Breaking:** `NewContractEvent` now emits an `address` of
  type `Address` (see `silajs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `EVMResult` now returns a `createdAddress` of
  type `Address` (see `silajs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `RunTxResult` now returns a `createdAddress` of
  type `Address` (see `silajs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `RunCallOpts` now expects `origin`, `caller` and
  `to` inputs to be of
  type `Address` (see `silajs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- **Breaking:** `RunCodeOpts` now expects `origin`, `caller` and
  `address` inputs to be of
  type `Address` (see `silajs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/sila-chain/silajs-monorepo/pull/919)
- Make `memory.ts` use Buffers instead of Arrays,
  PR [#850](https://github.com/sila-chain/silajs-monorepo/pull/850)
- Use `Map` for `OpcodeList` and `opcode` handlers,
  PR [#852](https://github.com/sila-chain/silajs-monorepo/pull/852)
- Compare buffers directly,
  PR [#851](https://github.com/sila-chain/silajs-monorepo/pull/851)
- Moved gas base fees from VM to Common,
  PR [#806](https://github.com/sila-chain/silajs-monorepo/pull/806)
- Return precompiles on `getPrecompile()` based on hardfork,
  PR [#783](https://github.com/sila-chain/silajs-monorepo/pull/783)
- Removed `async` dependency,
  PR [#779](https://github.com/sila-chain/silajs-monorepo/pull/779)
- Updated `silajs-util` to v7,
  PR [#748](https://github.com/sila-chain/silajs-monorepo/pull/748)

**CI and Test Improvements**

- New benchmarking tool for the VM, CI integration on GitHub actions,
  PR [#794](https://github.com/sila-chain/silajs-monorepo/pull/794) and
  PR [#830](https://github.com/sila-chain/silajs-monorepo/pull/830)
- Various updates, fixes and refactoring work on the test runner,
  PR [#752](https://github.com/sila-chain/silajs-monorepo/pull/752) and
  PR [#849](https://github.com/sila-chain/silajs-monorepo/pull/849)
- Integrated `silajs-testing` code logic into VM for more
  flexible future test load optimizations,
  PR [#808](https://github.com/sila-chain/silajs-monorepo/pull/808)
- Transition VM tests to TypeScript,
  PR [#881](https://github.com/sila-chain/silajs-monorepo/pull/881) and
  PR [#882](https://github.com/sila-chain/silajs-monorepo/pull/882)

**Bug Fixes**

- Fix `activatePrecompiles`,
  PR [#797](https://github.com/sila-chain/silajs-monorepo/pull/797)
- Strip zeros when putting contract storage in StateManager,
  PR [#880](https://github.com/sila-chain/silajs-monorepo/pull/880)
- Two bug fixes along `istanbul` `SSTORE` gas calculation,
  PR [#870](https://github.com/sila-chain/silajs-monorepo/pull/870)

## [4.2.0] - 2020-05-06

**Additions**

- Add `codeAddress` to VMs `step` event,
  PR [#651](https://github.com/sila-chain/silajs-monorepo/pull/651)
- Support for `skipNonce` and `skipBalance` tx options in `runBlock`,
  PR [#663](https://github.com/sila-chain/silajs-monorepo/pull/663)
- Add `init()` method to prevent race conditions,
  PR [#665](https://github.com/sila-chain/silajs-monorepo/pull/665)

**Removals**

- Remove `PStateManager` (`StateManager` now uses Promises by default),
  PR [#719](https://github.com/sila-chain/silajs-monorepo/pull/719)

**Bug Fixes**

- Explicitly duplicate EVMs stack items to ensure these do not get accidentally modified internally,
  PR [#733](https://github.com/sila-chain/silajs-monorepo/pull/733)

**Other changes**

- Refactor opcodes,
  PR [#664](https://github.com/sila-chain/silajs-monorepo/pull/664)

## [4.1.3] - 2020-01-09

This release fixes a critical bug preventing the `MuirGlacier` release `4.1.2`
working properly, an update is mandatory if you want a working installation.

**Bug Fixes**

- Fixed `getOpcodesForHF()` opcode selection for any HF > Istanbul,
  PR [#647](https://github.com/sila-chain/silajs-monorepo/pull/647)

**Test Related Changes**

- Switched from `Coveralls` to `Codecov` (monorepo preparation, coverage
  reports on PRs),
  PR [#646](https://github.com/sila-chain/silajs-monorepo/pull/646)
- Added nightly `StateTests` runs,
  PR [#639](https://github.com/sila-chain/silajs-monorepo/pull/639)
- Run consensus tests on `MuirGlacier`,
  PR [#648](https://github.com/sila-chain/silajs-monorepo/pull/648)

[4.1.3]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%404.1.2...%40silajs%2Fvm%404.1.3

## [4.1.2] - 2019-12-19 [DEPRECATED]

**Deprecation Notice**: This is a broken release containing a critical bug
affecting all installations using the `MuirGlacier` HF option. Please update
to the `4.1.3` release.

Release adds support for the `MuirGlacier` hardfork by updating relevant
dependencies:

- `silajs-tx`:
  [v2.1.2](https://github.com/sila-chain/silajs/silajs-tx/releases/tag/v2.1.2)
- `silajs-block`:
  [v2.2.2](https://github.com/sila-chain/silajs/silajs-block/releases/tag/v2.2.2)
- `silajs-blockchain`:
  [v4.0.3](https://github.com/sila-chain/silajs/silajs-blockchain/releases/tag/v4.0.3)
- `silajs-common`:
  [v1.5.0](https://github.com/sila-chain/silajs/silajs-common/releases/tag/v1.5.0)

Other changes:

- Upgraded `silajs-util` to `v6.2.0`,
  PR [#621](https://github.com/sila-chain/silajs-monorepo/pull/621)
- Removed outdated cb param definition in `runBlockchain`,
  PR [#623](https://github.com/sila-chain/silajs-monorepo/pull/623)
- Properly output zero balance in `examples/run-transactions-complete`,
  PR [#624](https://github.com/sila-chain/silajs-monorepo/pull/624)

[4.1.2]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%404.1.1...%40silajs%2Fvm%404.1.2

## [4.1.1] - 2019-11-19

First stable `Istanbul` release passing all `StateTests` and `BlockchainTests`
from the official Sila test suite
[v7.0.0-beta.1](https://github.com/sila-chain/tests/releases/tag/v7.0.0-beta.1).
Test suite conformance have been reached along work on
PR [#607](https://github.com/sila-chain/silajs-monorepo/pull/607) (thanks @s1na!)
and there were several fixes along the way, so it is strongly recommended that
you upgrade from the first `beta` `Istanbul` release `v4.1.0`.

**Istanbul Related Fixes**

- Refund counter has been moved from the `EEI` to the `SAVM` module,
  PR [#612](https://github.com/sila-chain/silajs-monorepo/pull/612), `gasRefund`
  is re-added to the `execResult` in the `SAVM` module at the end of message
  execution in `SAVM` to remain (for the most part) backwards-compatible in the
  release
- Fixed `blake2f` precompile for rounds > `0x4000000`
- Fixed issues causing `RevertPrecompiled*` test failures
- Fixed an issue where the `RIPEMD` precompile has to remain _touched_ even
  when the call reverts and be considered for deletion,
  see [SIP issue #716](https://github.com/sila-chain/SIPs/issues/716) for context
- Updated `silajs-block` to `v2.2.1`
- Updated `silajs-blockchain` to `v4.0.2`
- Limited `silajs-util` from `^6.1.0` to `~6.1.0`
- Hardfork-related fixes in test runners and test utilities

**Other Changes**

- Introduction of a new caching mechanism to cache calls towards `promisify`
  being present in hot paths (performance optimization),
  PR [#600](https://github.com/sila-chain/silajs-monorepo/pull/600)
- Renamed some missing `result.return` to `result.returnValue` on `SAVM`
  execution in examples,
  PR [#604](https://github.com/sila-chain/silajs-monorepo/pull/604)
- Improved event documentation,
  PR [#601](https://github.com/sila-chain/silajs-monorepo/pull/601)

[4.1.1]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%404.1.0...%40silajs%2Fvm%404.1.1

## [4.1.0] - 2019-09-12

This is the first feature-complete `Istanbul` release, containing implementations
for all 6 SIPs, see the HF meta SIP [SIP-1679](https://sips.sila.org/SIPS/sip-1679)
for an overview. Beside this release contains further unrelated features as
well as bug fixes.

Note that `Istanbul` support is still labeled as `beta`. All implementations
have only basic test coverage since the official Sila consensus tests are
not yet merged. There might be also last minute changes to SIPs during the
testing period.

**Istanbul Summary**

See the VM `Istanbul` hardfork meta issue
[#501](https://github.com/sila-chain/silajs-monorepo/issues/501) for a summary
on all the changes.

Added SIPs:

- [SIP-152](https://sips.sila.org/SIPS/sip-152): Blake 2b `F` precompile,
  PR [#584](https://github.com/sila-chain/silajs-monorepo/pull/584)
- [SIP-1108](https://sips.sila.org/SIPS/sip-1108): Reduce `alt_bn128`
  precompile gas costs,  
  PR [#540](https://github.com/sila-chain/silajs-monorepo/pull/540)
  (already released in `v4.0.0`)
- [SIP-1344](https://sips.sila.org/SIPS/sip-1344): Add ChainID Opcode,
  PR [#572](https://github.com/sila-chain/silajs-monorepo/pull/572)
- [SIP-1884](https://sips.sila.org/SIPS/sip-1884): Trie-size-dependent
  Opcode Repricing,
  PR [#581](https://github.com/sila-chain/silajs-monorepo/pull/581)
- [SIP-2200](https://sips.sila.org/SIPS/sip-2200): Rebalance net-metered
  SSTORE gas costs,
  PR [#590](https://github.com/sila-chain/silajs-monorepo/pull/590)

**Other Features**

- Two new event types `beforeMessage` and `afterMessage`, emitting a `Message`
  before and an `EVMResult` after running a `Message`, see also the
  [updated section](https://github.com/sila-chain/silajs-monorepo#vms-tracing-events)
  in the `README` on this,
  PR [#577](https://github.com/sila-chain/silajs-monorepo/pull/577)

**Bug Fixes**

- Transaction error strings should not contain multiple consecutive whitespace
  characters, this has been fixed,
  PR [#578](https://github.com/sila-chain/silajs-monorepo/pull/578)
- Fixed `vm.stateManager.generateCanonicalGenesis()` to produce a correct
  genesis block state root (in particular for the `Goerli` testnet),
  PR [#589](https://github.com/sila-chain/silajs-monorepo/pull/589)

**Refactoring / Docs**

- Preparation for separate lists of opcodes for the different HFs,
  PR [#582](https://github.com/sila-chain/silajs-monorepo/pull/582),
  see also follow-up
  PR [#592](https://github.com/sila-chain/silajs-monorepo/pull/592) making this
  list a property of the VM instance
- Clarification in the docs for the behavior of the `activatePrecompiles`
  VM option,
  PR [#595](https://github.com/sila-chain/silajs-monorepo/pull/595)

[4.1.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%404.0.0...%40silajs%2Fvm%404.1.0

## [4.0.0] - 2019-08-06

First `TypeScript` based VM release, other highlights:

- New Call and Code Loop Structure / SAVM Encapsulation
- EEI for Environment Communication
- Istanbul Process Start
- Promise-based API

See [v4.0.0-beta.1](https://github.com/sila-chain/silajs-monorepo/releases/tag/v4.0.0-beta.1)
release for full release notes.

**Changes since last beta**

- Simplification of execution results,
  PR [#551](https://github.com/sila-chain/silajs-monorepo/pull/551)
- Fix error propagation in `Cache.flush()` method from `StateManager`,
  PR [#562](https://github.com/sila-chain/silajs-monorepo/pull/562)
- `StateManager` storage key length validation (now throws on addresses not
  having a 32-byte length),
  PR [#565](https://github.com/sila-chain/silajs-monorepo/pull/565)

[4.0.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%404.0.0...%40silajs%2Fta.1...v4.0.0

## [4.0.0-beta.1] - 2019-06-19

Since changes in this release are pretty deep reaching and broadly distributed,
we will first drop out one or several `beta` releases until we are confident on
both external API as well as inner structural changes. See
[v4 branch](https://github.com/sila-chain/silajs-monorepo/pull/479) for some
major entry point into the work on the release.

It is highly recommended that you do some testing of your library against this
and following `beta` versions and give us some feedback!

These will be the main release notes for the `v4` feature updates, subsequent
`beta` releases and the final release will just publish the delta changes and
point here for reference.

Breaking changes in the release notes are preceded with `[BREAKING]`, do a
search for an overview.

The outstanding work of [@s1na](https://github.com/s1na) has to be mentioned
here. He has done the very large portion of the coding and without him this
release wouldn't have been possible. Thanks Sina! 🙂

So what's new?

### TypeScript

This is the first `TypeScript` release of the VM (yay! 🎉).

`TypeScript` handles `ES6` transpilation
[a bit differently](https://github.com/Microsoft/TypeScript/issues/2719) (at the
end: cleaner) than `babel` so `require` syntax of the library slightly changes to:

```javascript
const VM = require('silajs-monorepo').default
```

The library now also comes with **type declaration files** distributed along
with the package published.

##### Relevant PRs

- Preparation, migration of `Bloom`, `Stack` and `Memory`,
  PR [#495](https://github.com/sila-chain/silajs-monorepo/pull/495)
- `StateManager` migration,
  PR [#496](https://github.com/sila-chain/silajs-monorepo/pull/496)
- Migration of precompiles, opcode list, `EEI`, `Message`, `TxContext` to
  `TypeScript`, PR [#497](https://github.com/sila-chain/silajs-monorepo/pull/497)
- Migration of `SAVM` (old: `Interpreter`) and exceptions,
  PR [#504](https://github.com/sila-chain/silajs-monorepo/pull/504)
- Migration of `Interpreter` (old: `Loop`),
  PR [#505](https://github.com/sila-chain/silajs-monorepo/pull/505)
- Migration of `opFns` (opcode implementations),
  PR [#506](https://github.com/sila-chain/silajs-monorepo/pull/506)
- Migration of the main `index.js` `VM` class,
  PR [#507](https://github.com/sila-chain/silajs-monorepo/pull/507)
- Migration of `VM.runCode()`,
  PR [#508](https://github.com/sila-chain/silajs-monorepo/pull/508)
- Migration of `VM.runCall()`,
  PR [#510](https://github.com/sila-chain/silajs-monorepo/pull/510)
- Migration of `VM.runTx()`,
  PR [#511](https://github.com/sila-chain/silajs-monorepo/pull/511)
- Migration of `VM.runBlock()`,
  PR [#512](https://github.com/sila-chain/silajs-monorepo/pull/512)
- Migration of `VM.runBlockchain()`,
  PR [#517](https://github.com/sila-chain/silajs-monorepo/pull/517)
- `TypeScript` finalization PR, config switch,
  PR [#518](https://github.com/sila-chain/silajs-monorepo/pull/518)
- Doc generation via `TypeDoc`,
  PR [#522](https://github.com/sila-chain/silajs-monorepo/pull/522)

### SAVM Modularization and Structural Refactoring

##### New Call and Code Loop Structure / SAVM Encapsulation

This release switches to a new class based and promisified structure for
working down VM calls and running through code loops, and encapsulates this
logic to be bound to the specific `SAVM` (so the classical Sila Virtual Machine)
implementation in the
[savm](https://github.com/sila-chain/silajs-monorepo/tree/master/src/savm) module,
opening the way for a future parallel `eWASM` additional implementation.

This new logic is mainly handled by the two new classes `SAVM` (old: `Interpreter`)
and `Interpreter` (old: `Loop`),
see PR [#483](https://github.com/sila-chain/silajs-monorepo/pull/483)
for the initial work on this. The old `VM.runCall()` and `VM.runCode()`
methods are just kept as being wrappers and will likely be deprecated on future
releases once the inner API structure further stabilizes.

This new structure should make extending the VM by subclassing and
adopting functionality much easier, e.g. by changing opcode functionality or adding
custom onces by using an own `Interpreter.getOpHandler()` implementation. You are
highly encouraged to play around, see what you can do and give us feedback on
possibilities and limitations.

#### EEI for Environment Communication

For interacting with the blockchain environment there has been introduced a
dedicated `EEI` (Sila Environment Interface) module closely resembling the
respective
[EEI spec](https://github.com/ewasm/design/blob/master/eth_interface.md), see
PR [#486](https://github.com/sila-chain/silajs-monorepo/pull/486) for the initial
work.

This makes handling of environmental data by the VM a lot cleaner and transparent
and should as well allow for much easier extension and modification.

##### Changes

- Detached precompiles from the VM,
  PR [#492](https://github.com/sila-chain/silajs-monorepo/pull/492)
- Subdivided `runState`, refactored `Interpreter` (old: `Loop`),
  PR [#498](https://github.com/sila-chain/silajs-monorepo/pull/498)
- [BREAKING] Dropped `emitFreeLogs` flag, to replace it is suggested to
  implement by inheriting `Interpreter` (old: `Loop`),
  PR [#498](https://github.com/sila-chain/silajs-monorepo/pull/498)
- Split `SAVM.executeMessage()` with `SAVM.executeCall()` and
  `SAVM.executeCreate()` for `call` and `create` specific logic
  (old names: `Interpreter.[METHOD_NAME]()`),
  PR [#499](https://github.com/sila-chain/silajs-monorepo/pull/499)
- Further simplification of `Interpreter`/`SAVM`
  (old: `Loop`/`Interpreter`) structure,
  PR [#506](https://github.com/sila-chain/silajs-monorepo/pull/506)
- [BREAKING] Dropped `VM.runJit()` in favor of direct handling in
  `SAVM` (old: `Interpreter`),
  officially not part of the external API but mentioning just in case,
  PR [#515](https://github.com/sila-chain/silajs-monorepo/pull/515)
- Removed `StorageReader`, moved logic to `StateManager`,
  [#534](https://github.com/sila-chain/silajs-monorepo/pull/534)

### Istanbul Process Start

With this release we start the `Istanbul` hardfork integration process and
have activated the `istanbul` `hardfork` option for the constructor.

This is meant to be used experimentation and reference implementations, we have made
a start with integrating draft [SIP-1108](https://sips.sila.org/SIPS/sip-1108)
`Istanbul` candidate support reducing the gas costs for `alt_bn128` precompiles,
see PR [#539](https://github.com/sila-chain/silajs-monorepo/issues/539) for
implementation details.

Note that this is still very early in the process since no SIP in a final
state is actually accepted for being included into `Istanbul` on the time of
release. The `v4` release series will be kept as an experimental series
during the process with breaking changes introduced along the way without too
much notice, so be careful and tighten the VM dependency if you want to give
your users the chance for some early experimentation with some specific
implementation state.

Once scope of `Istanbul` as well as associated SIPs are finalized a stable
`Istanbul` VM version will be released as a subsequent major release.

### Code Modernization and Version Updates

The main API with the `v4` release switches from being `callback` based to
using promises,
see PR [#546](https://github.com/sila-chain/silajs-monorepo/pull/546).

Here is an example for changed API call `runTx`.

Old `callback`-style invocation:

```javascript
vm.runTx(
  {
    tx: tx,
  },
  function (err, result) {
    if (err) {
      // Handle errors appropriately
    }
    // Do something with the result
  },
)
```

Promisified usage:

```javascript
try {
  let result = await vm.runTx({ tx: tx })
  // Do something with the result
} catch (err) {
  // handle errors appropriately
}
```

##### Code Modernization Changes

- Promisified internal usage of async opcode handlers,
  PR [#491](https://github.com/sila-chain/silajs-monorepo/pull/491)
- Promisified `runTx` internals,
  PR [#493](https://github.com/sila-chain/silajs-monorepo/pull/493)
- Promisified `runBlock` internals, restructure, reduced shared global state,
  PR [#494](https://github.com/sila-chain/silajs-monorepo/pull/494)

##### Version Updates

- Updated `silajs-account` from `2.x` to `3.x`, part of
  PR [#496](https://github.com/sila-chain/silajs-monorepo/pull/496)

##### Features

- The VM now also supports a
  [Common](https://github.com/sila-chain/silajs/silajs-common)
  class instance for chain and HF setting,
  PRs [#525](https://github.com/sila-chain/silajs-monorepo/pull/525) and
  [#526](https://github.com/sila-chain/silajs-monorepo/pull/526)

##### Bug Fixes

- Fixed error message in `runTx()`,
  PR [#523](https://github.com/sila-chain/silajs-monorepo/pull/523)
- Changed default hardfork in `StateManager` to `petersburg`,
  PR [#524](https://github.com/sila-chain/silajs-monorepo/pull/524)
- Replaced `Object.assign()` calls and fixed type errors,
  PR [#529](https://github.com/sila-chain/silajs-monorepo/pull/529)

#### Development

- Significant blockchain test speed improvements,
  PR [#536](https://github.com/sila-chain/silajs-monorepo/pull/536)

[4.0.0-beta.1]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%403.0.0...%40silajs%2Fvm%404.0.0-beta.1

## [3.0.0] - 2019-03-29

This release comes with a modernized `ES6`-class structured code base, some
significant local refactoring work regarding how `Stack` and `Memory`
are organized within the VM and it finalizes a first round of module structuring
now having separate folders for `bloom`, `savm` and `state` related code. The
release also removes some rarely used parts of the API (`hookedVM`, `VM.deps`).

All this is to a large extend preparatory work for a `v4.0.0` release which will
follow in the next months with `TypeScript` support and more system-wide
refactoring work leading to a more modular and expandable VM and providing the
ground for future `eWASM` integration. If you are interested in the release
process and want to take part in the refactoring discussion see the associated
issue [#455](https://github.com/sila-chain/silajs-monorepo/issues/455).

**VM Refactoring/Breaking Changes**

- New `Memory` class for savm memory manipulation,
  PR [#442](https://github.com/sila-chain/silajs-monorepo/pull/442)
- Refactored `Stack` manipulation in savm,
  PR [#460](https://github.com/sila-chain/silajs-monorepo/pull/460)
- Dropped `createHookedVm` (BREAKING), being made obsolete by the
  new `StateManager` API,
  PR [#451](https://github.com/sila-chain/silajs-monorepo/pull/451)
- Dropped `VM.deps` attribute (please require dependencies yourself if you
  used this),
  PR [#478](https://github.com/sila-chain/silajs-monorepo/pull/478)
- Removed `fakeBlockchain` class and associated tests,
  PR [#466](https://github.com/sila-chain/silajs-monorepo/pull/466)
- The `petersburg` hardfork rules are now run as default
  (before: `byzantium`),
  PR [#485](https://github.com/sila-chain/silajs-monorepo/pull/485)

**Modularization**

- Renamed `vm` module to `savm`, move `precompiles` to `savm` module,
  PR [#481](https://github.com/sila-chain/silajs-monorepo/pull/481)
- Moved `stateManager`, `storageReader` and `cache` to `state` module,
  [#443](https://github.com/sila-chain/silajs-monorepo/pull/443)
- Replaced static VM `logTable` with dynamic inline version in `EXP` opcode,
  [#450](https://github.com/sila-chain/silajs-monorepo/pull/450)

**Code Modernization/ES6**

- Converted `VM` to `ES6` class,
  PR [#478](https://github.com/sila-chain/silajs-monorepo/pull/478)
- Migrated `stateManager` and `storageReader` to `ES6` class syntax,
  PR [#452](https://github.com/sila-chain/silajs-monorepo/pull/452)

**Bug Fixes**

- Fixed a bug where `stateManager.setStateRoot()` didn't clear
  the `_storageTries` cache,
  PR [#445](https://github.com/sila-chain/silajs-monorepo/issues/445)
- Fixed longer output than return length in `CALL` opcode,
  PR [#454](https://github.com/sila-chain/silajs-monorepo/pull/454)
- Use `BN.toArrayLike()` instead of `BN.toBuffer()` (browser compatibility),
  PR [#458](https://github.com/sila-chain/silajs-monorepo/pull/458)
- Fixed tx value overflow 256 bits,
  PR [#471](https://github.com/sila-chain/silajs-monorepo/pull/471)

**Maintenance/Optimization**

- Use `BN` reduction context in `MODEXP` precompile,
  PR [#463](https://github.com/sila-chain/silajs-monorepo/pull/463)

**Documentation**

- Fixed API doc types for `Bloom` filter methods,
  PR [#439](https://github.com/sila-chain/silajs-monorepo/pull/439)

**Testing**

- New Karma browser testing for the API tests,
  PRs [#461](https://github.com/sila-chain/silajs-monorepo/pull/461),
  [#468](https://github.com/sila-chain/silajs-monorepo/pull/468)
- Removed unused parts and tests within the test setup,
  PR [#437](https://github.com/sila-chain/silajs-monorepo/pull/437)
- Fixed a bug using `--json` trace flag in the tests,
  PR [#438](https://github.com/sila-chain/silajs-monorepo/pull/438)
- Complete switch to Petersburg on tests, fix coverage,
  PR [#448](https://github.com/sila-chain/silajs-monorepo/pull/448)
- Added test for `StateManager.dumpStorage()`,
  PR [#462](https://github.com/sila-chain/silajs-monorepo/pull/462)
- Fixed `ecmul_0-3_5616_28000_96` (by test setup adoption),
  PR [#473](https://github.com/sila-chain/silajs-monorepo/pull/473)

[3.0.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.6.0...%40silajs%2Fvm%403.0.0

## [2.6.0] - 2019-02-07

**Petersburg Support**

Support for the `Petersburg` (aka `constantinopleFix`) hardfork by integrating
`Petersburg` ready versions of associated libraries, see also
PR [#433](https://github.com/sila-chain/silajs-monorepo/pull/433):

- `silajs-common` (chain and HF logic and helper functionality) [v1.1.0](https://github.com/sila-chain/silajs/silajs-common/releases/tag/v1.1.0)
- `silajs-blockchain` [v3.4.0](https://github.com/sila-chain/silajs/silajs-blockchain/releases/tag/v3.4.0)
- `silajs-block` [v2.2.0](https://github.com/sila-chain/silajs/silajs-block/releases)

To instantiate the VM with `Petersburg` HF rules set the `opts.hardfork`
constructor parameter to `petersburg`. This will run the VM on the new
Petersburg rules having removed the support for
[SIP 1283](https://sips.sila.org/SIPS/sip-1283).

**Goerli Readiness**

The VM is now also ready to execute on blocks from the final version of the
[Goerli](https://github.com/goerli/testnet) cross-client testnet and can
therefore be instantiated with `opts.chain` set to `goerli`.

**Bug Fixes**

- Fixed mixed `sync`/`async` functions in `cache`,
  PR [#422](https://github.com/sila-chain/silajs-monorepo/pull/422)
- Fixed a bug in `setStateroot` and caching by clearing the `stateManager` cache
  after setting the state root such that stale values are not returned,
  PR [#420](https://github.com/sila-chain/silajs-monorepo/pull/420)
- Fixed cache access on the hooked VM (_deprecated_),
  PR [#434](https://github.com/sila-chain/silajs-monorepo/pull/434)

**Refactoring**

Following changes might be relevant for you if you are hotfixing/monkey-patching
on parts of the VM:

- Moved `bloom` to its own directory,
  PR [#429](https://github.com/sila-chain/silajs-monorepo/pull/429)
- Moved `opcodes`, `opFns` and `logTable` to `lib/vm`,
  PR [#425](https://github.com/sila-chain/silajs-monorepo/pull/425)
- Converted `Bloom` to `ES6` class,
  PR [#428](https://github.com/sila-chain/silajs-monorepo/pull/428)
- Converted `Cache` to `ES6` class, added unit tests,
  PR [427](https://github.com/sila-chain/silajs-monorepo/pull/427)

[2.6.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.5.1...%40silajs%2Fvm%402.6.0

## [2.5.1] - 2019-01-19

### Features

- Added `memoryWordCount` to the `step` event object,
  PR [#405](https://github.com/sila-chain/silajs-monorepo/pull/405)

### Bug Fixes

- Fixed a bug which caused an overwrite of the passed state trie (`opts.state`)
  when instantiating the library with the `opts.activatePrecompiles` option,
  PR [#415](https://github.com/sila-chain/silajs-monorepo/pull/415)
- Fixed error handling in `runCode` (in case `loadContract` fails),
  PR [#408](https://github.com/sila-chain/silajs-monorepo/pull/408)
- Fixed a bug in the `StateManager.generateGenesis()` function,
  PR [#400](https://github.com/sila-chain/silajs-monorepo/pull/400)

### Tests

- Upgraded `silajs-blockchain` and `level` for test runs,
  PR [#414](https://github.com/sila-chain/silajs-monorepo/pull/414)
- Fixed issue when running code coverage on PRs from forks,
  PR [#402](https://github.com/sila-chain/silajs-monorepo/pull/402)

[2.5.1]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.5.0...%40silajs%2Fvm%402.5.1

## [2.5.0] - 2018-11-21

This is the first release of the VM with full support for all `Constantinople` SIPs. It further comes along with huge improvements on consensus conformity and introduces the `Beta` version of a new `StateManager` API.

### Constantinople Support

For running the VM with `Constantinople` hardfork rules, set the [option](https://github.com/sila-chain/silajs-monorepo/blob/master/docs/index.md#vm) in the `VM` constructor `opts.hardfork` to `constantinople`. Supported hardforks are `byzantium` and `constantinople`, `default` setting will stay on `byzantium` for now but this will change in a future release.

Changes related to Constantinople:

- SIP 1283 `SSTORE`, see PR [#367](https://github.com/sila-chain/silajs-monorepo/pull/367)
- SIP 1014 `CREATE2`, see PR [#329](https://github.com/sila-chain/silajs-monorepo/pull/329)
- SIP 1052 `EXTCODEHASH`, see PR [#324](https://github.com/sila-chain/silajs-monorepo/pull/324)
- Constantinople ready versions of [silajs-block](https://github.com/sila-chain/silajs/silajs-block/releases/tag/v2.1.0) and [silajs-blockchain](https://github.com/sila-chain/silajs/silajs-blockchain/releases/tag/v3.3.0) dependencies (difficulty bomb delay), see PRs [#371](https://github.com/sila-chain/silajs-monorepo/pull/371), [#325](https://github.com/sila-chain/silajs-monorepo/pull/325)

### Consensus Conformity

This release is making a huge leap forward regarding consensus conformity, and even if you are not interested in `Constantinople` support at all, you should upgrade just for this reason. Some context: we couldn't run blockchain tests for a long time on a steady basis due to performance constraints and when we re-triggered a test run after quite some time with PR [#341](https://github.com/sila-chain/silajs-monorepo/pull/341) the result was a bit depressing with over 300 failing tests. Thanks to joined efforts from the community and core team members we could bring this down far quicker than expected and this is the first release for a long time which practically comes with complete consensus conformity - with just three recently added tests failing (see `skipBroken` list in `test/tester.js`) and otherwise passing all blockchain tests and all state tests for both `Constantinople` and `Byzantium` rules. 🏆 🏆 🏆

Consensus Conformity related changes:

- Reset `selfdestruct` on `REVERT`, see PR [#392](https://github.com/sila-chain/silajs-monorepo/pull/392)
- Undo `Bloom` filter changes from PR [#295](https://github.com/sila-chain/silajs-monorepo/pull/295), see PR [#384](https://github.com/sila-chain/silajs-monorepo/pull/384)
- Fixes broken `BLOCKHASH` opcode, see PR [#381](https://github.com/sila-chain/silajs-monorepo/pull/381)
- Fix failing blockchain test `GasLimitHigherThan2p63m1`, see PR [#380](https://github.com/sila-chain/silajs-monorepo/pull/380)
- Stop adding `account` to `cache` when checking if it is empty, see PR [#375](https://github.com/sila-chain/silajs-monorepo/pull/375)

### State Manager Interface

The `StateManager` (`lib/stateManager.js`) - providing a high-level interface to account and contract data from the underlying state trie structure - has been completely reworked and there is now a close-to-being finalized API (currently marked as `Beta`) coming with its own [documentation](https://github.com/sila-chain/silajs-monorepo/blob/master/docs/stateManager.md).

This comes along with larger refactoring work throughout more-or-less the whole code base and the `StateManager` now completely encapsulates the trie structure and the cache backend used, see issue [#268](https://github.com/sila-chain/silajs-monorepo/issues/268) and associated PRs for reference. This will make it much easier in the future to bring along an own state manager serving special needs (optimized for memory and performance, run on mobile,...) by e.g. using a different trie implementation, cache or underlying storage or database backend.

We plan to completely separate the currently still integrated state manager into its own repository in one of the next releases, this will then be a breaking `v3.0.0` release. Discussion around a finalized interface (we might e.g. drop all genesis-related methods respectively methods implemented in the `DefaultStateManager`) is still ongoing and you are very much invited to jump in and articulate your needs, just take e.g. the issue mentioned above as an entry point.

Change related to the new `StateManager` interface:

- `StateManager` interface simplification, see PR [#388](https://github.com/sila-chain/silajs-monorepo/pull/388)
- Make `StateManager` cache and trie private, see PR [#385](https://github.com/sila-chain/silajs-monorepo/pull/385)
- Remove vm accesses to `StateManager` `trie` and `cache`, see PR [#376](https://github.com/sila-chain/silajs-monorepo/pull/376)
- Remove explicit direct cache interactions, see PR [#366](https://github.com/sila-chain/silajs-monorepo/pull/366)
- Remove contract specific commit, see PR [#335](https://github.com/sila-chain/silajs-monorepo/pull/335)
- Fixed incorrect references to `trie` in tests, see PR [#345](https://github.com/sila-chain/silajs-monorepo/pull/345)
- Added `StateManager` API documentation, see PR [#393](https://github.com/sila-chain/silajs-monorepo/pull/393)

### New Features

- New `emitFreeLogs` option, allowing any contract to emit an unlimited quantity of events without modifying the block gas limit (default: `false`) which can be used in debugging contexts, see PRs [#378](https://github.com/sila-chain/silajs-monorepo/pull/378), [#379](https://github.com/sila-chain/silajs-monorepo/pull/379)

### Testing and Documentation

Beyond the reintegrated blockchain tests there is now a separate test suite to test the API of the library, see `test/api`. This should largely reduce the risk of introducing new bugs on the API level on future changes, generally ease the development process by being able to develop against the specific tests and also allows using the tests as a reference for examples on how to use the API.

On the documentation side the API documentation has also been consolidated and there is now a unified and auto-generated [API documentation](https://github.com/sila-chain/silajs-monorepo/blob/master/docs/index.md) (previously being manually edited (and too often forgotten) in `README`).

- Added API tests for `index.js`, `StateManager`, see PR [#364](https://github.com/sila-chain/silajs-monorepo/pull/364)
- Added API Tests for `runJit` and `fakeBlockchain`, see PR [#331](https://github.com/sila-chain/silajs-monorepo/pull/331)
- Added API tests for `runBlockchain`, see PR [#336](https://github.com/sila-chain/silajs-monorepo/pull/336)
- Added `runBlock` API tests, see PR [#360](https://github.com/sila-chain/silajs-monorepo/pull/360)
- Added `runTx` API tests, see PR [#352](https://github.com/sila-chain/silajs-monorepo/pull/352)
- Added API Tests for the `Bloom` module, see PR [#330](https://github.com/sila-chain/silajs-monorepo/pull/330)
- New consistent auto-generated [API documentation](https://github.com/sila-chain/silajs-monorepo/blob/master/docs/index.md), see PR [#377](https://github.com/sila-chain/silajs-monorepo/pull/377)
- Blockchain tests now run by default on CI, see PR [#374](https://github.com/sila-chain/silajs-monorepo/pull/374)
- Switched from `istanbul` to `nyc`, see PR [#334](https://github.com/sila-chain/silajs-monorepo/pull/334)
- Usage of `sealEngine` in blockchain tests, see PR [#373](https://github.com/sila-chain/silajs-monorepo/pull/373)
- New `tap-spec` option to get a formatted test run result summary, see [README](https://github.com/sila-chain/silajs-monorepo#running-tests-with-a-reporterformatter), see PR [#363](https://github.com/sila-chain/silajs-monorepo/pull/363)
- Updates/fixes on the JSDoc comments, see PRs [#362](https://github.com/sila-chain/silajs-monorepo/pull/362), [#361](https://github.com/sila-chain/silajs-monorepo/pull/361)

### Bug Fixes and Maintenance

Some bug fix and maintenance updates:

- Fix error handling in `fakeBlockChain`, see PR [#320](https://github.com/sila-chain/silajs-monorepo/pull/320)
- Update of `silajs-util` to [v6.0.0](https://github.com/sila-chain/silajs/silajs-util/releases/tag/v6.0.0), see PR [#369](https://github.com/sila-chain/silajs-monorepo/pull/369)

### Thank You

Special thanks to:

- @mattdean-digicatapult for his indefatigable work on the new StateManager interface and for fixing a large portion of the failing blockchain tests
- @rmeissner for the work on Constantinople
- @vpulim for jumping in so quickly and doing a reliable `SSTORE` implementation within 4 days
- @s1na for the new API test suite

Beyond this release contains contributions from the following people:
@jwasinger, @Agusx1211, @HolgerD77, @danjm, @whymarrh, @seesemichaelj, @kn

Thank you all very much, and thanks @axic for keeping an ongoing eye on overall library quality!

[2.5.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.4.0...%40silajs%2Fvm%402.5.0

## [2.4.0] - 2018-07-27

With the `2.4.x` release series we now start to gradually add `Constantinople` features with the
bitwise shifting instructions from [SIP 145](https://sips.sila.org/SIPS/sip-145)
making the start being introduced in the `v2.4.0` release.

Since both the scope of the `Constantinople` hardfork as well as the state of at least some of the SIPs
to be included are not yet finalized, this is only meant for `EXPERIMENTAL` purposes, e.g. for developer
tools to give users early access and make themselves familiar with dedicated features.

Once scope and SIPs from `Constantinople` are final we will target a `v2.5.0` release which will officially
introduce `Constantinople` support with all the changes bundled together.

Note that from this release on we also introduce new `chain` (default: `sila-mainnet`) and `hardfork`
(default: `byzantium`) initialization parameters, which make use of our new [silajs-common](https://github.com/sila-chain/silajs/silajs-common) library and in the future will allow
for parallel hardfork support from `Byzantium` onwards.

Since `hardfork` default might be changed or dropped in future releases, you might want to explicitly
set this to `byzantium` on your next update to avoid future unexpected behavior.

All the changes from this release:

**FEATURES/FUNCTIONALITY**

- Improved chain and fork support, see PR [#304](https://github.com/sila-chain/silajs-monorepo/pull/304)
- Support for the `Constantinople` bitwise shifting instructions `SHL`, `SHR` and `SAR`, see PR [#251](https://github.com/sila-chain/silajs-monorepo/pull/251)
- New `newContract` event which can be used to do interrupting tasks on contract/address creation, see PR [#306](https://github.com/sila-chain/silajs-monorepo/pull/306)
- Alignment of behavior of bloom filter hashing to go along with sila-mainnet compatible clients _BREAKING_, see PR [#295](https://github.com/sila-chain/silajs-monorepo/pull/295)

**UPDATES/TESTING**

- Usage of the latest `rustbn.js` API, see PR [#312](https://github.com/sila-chain/silajs-monorepo/pull/312)
- Some cleanup in precompile error handling, see PR [#318](https://github.com/sila-chain/silajs-monorepo/pull/318)
- Some cleanup for `StateManager`, see PR [#266](https://github.com/sila-chain/silajs-monorepo/pull/266)
- Renaming of `util.sha3` usages to `util.keccak256` and bump `silajs-util` to `v5.2.0` (you should do to if you use `silajs-util`)
- Parallel testing of the`Byzantium` and `Constantinople` state tests, see PR [#317](https://github.com/sila-chain/silajs-monorepo/pull/317)
- For lower build times our CI configuration now runs solely on `CircleCI` and support for `Travis` have been dropped, see PR [#316](https://github.com/sila-chain/silajs-monorepo/pull/316)

**BUG FIXES**

- Programmatic runtime errors in the VM execution context (within an opcode) are no longer absorbed and displayed as a VMError but explicitly thrown, allowing for easier discovery of implementation bugs, see PR [#307](https://github.com/sila-chain/silajs-monorepo/pull/307)
- Fix of the `Bloom.check()` method not working properly, see PR [#311](https://github.com/sila-chain/silajs-monorepo/pull/311)
- Fix a bug when `REVERT` is used within a `CREATE` context, see PR [#297](https://github.com/sila-chain/silajs-monorepo/pull/297)
- Fix a bug in `FakeBlockChain` error handing, see PR [#320](https://github.com/sila-chain/silajs-monorepo/pull/320)

[2.4.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.3.5...%40silajs%2Fvm%402.4.0

## [2.3.5] - 2018-04-25

- Fixed `BYTE` opcode return value bug, PR [#293](https://github.com/sila-chain/silajs-monorepo/pull/293)
- Clean up touched-accounts management in `StateManager`, PR [#287](https://github.com/sila-chain/silajs-monorepo/pull/287)
- New `stateManager.copy()` function, PR [#276](https://github.com/sila-chain/silajs-monorepo/pull/276)
- Updated Circle CI configuration to 2.0 format, PR [#292](https://github.com/sila-chain/silajs-monorepo/pull/292)

[2.3.5]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.3.4...%40silajs%2Fvm%402.3.5

## [2.3.4] - 2018-04-06

- Support of external statemanager in VM constructor (experimental), PR [#264](https://github.com/sila-chain/silajs-monorepo/pull/264)
- `ES5` distribution on npm for better toolchain compatibility, PR [#281](https://github.com/sila-chain/silajs-monorepo/pull/281)
- `allowUnlimitedContractSize` VM option for debugging purposes, PR [#282](https://github.com/sila-chain/silajs-monorepo/pull/282)
- Added `gasRefund` to transaction results, PR [#284](https://github.com/sila-chain/silajs-monorepo/pull/284)
- Test coverage / coveralls support for the library, PR [#270](https://github.com/sila-chain/silajs-monorepo/pull/270)
- Properly calculate totalgas for large return values, PR [#275](https://github.com/sila-chain/silajs-monorepo/pull/275)
- Improve iterateVm check output after step hook, PR [#279](https://github.com/sila-chain/silajs-monorepo/pull/279)

[2.3.4]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.3.3...%40silajs%2Fvm%402.3.4

## [2.3.3] - 2018-02-02

- Reworked memory expansion/access for opcodes, PR [#174](https://github.com/sila-chain/silajs-monorepo/pull/174) (fixes consensus bugs on
  large numbers >= 53 bit for opcodes using memory location)
- Keep stack items as bn.js instances (arithmetic performance increases), PRs [#159](https://github.com/sila-chain/silajs-monorepo/pull/159), [#254](https://github.com/sila-chain/silajs-monorepo/pull/254) and [#256](https://github.com/sila-chain/silajs-monorepo/pull/256)
- More consistent VM error handling, PR [#219](https://github.com/sila-chain/silajs-monorepo/pull/219)
- Validate stack items after operations, PR [#222](https://github.com/sila-chain/silajs-monorepo/pull/222)
- Updated `silajs-util` dependency from `4.5.0` to `5.1.x`, PR [#241](https://github.com/sila-chain/silajs-monorepo/pull/241)
- Fixed child contract deletion bug, PR [#246](https://github.com/sila-chain/silajs-monorepo/pull/246)
- Fixed a bug associated with direct stack usage, PR [#240](https://github.com/sila-chain/silajs-monorepo/pull/240)
- Fix error on large return fees, PR [#235](https://github.com/sila-chain/silajs-monorepo/pull/235)
- Various bug fixes

[2.3.3]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.3.2...%40silajs%2Fvm%402.3.3

## [2.3.2] - 2017-10-29

- Better handling of `rustbn.js` exceptions
- Fake (default if non-provided) blockchain fixes
- Testing improvements (separate skip lists)
- Minor optimizations and bug fixes

[2.3.2]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.3.1...%40silajs%2Fvm%402.3.2

## [2.3.1] - 2017-10-11

- `Byzantium` compatible
- New opcodes `REVERT`, `RETURNDATA` and `STATICCALL`
- Precompiles for curve operations and bigint mod exp
- Transaction return data in receipts
- For detailed list of changes see PR [#161](https://github.com/sila-chain/silajs-monorepo/pull/161)
- For a `Spurious Dragon`/`SIP 150` compatible version of this library install latest version of `2.2.x`

[2.3.1]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.2.2...%40silajs%2Fvm%402.3.1

## [2.3.0] - Version Skipped due to faulty npm release

## [2.2.2] - 2017-09-19

- Fixed [JS number issues](https://github.com/sila-chain/silajs-monorepo/pull/168)
  and [certain edge cases](https://github.com/sila-chain/silajs-monorepo/pull/188)
- Fixed various smaller bugs and improved code consistency
- Some VM speedups
- Testing improvements
- Narrowed down dependencies for library not to break after Byzantium release

[2.2.2]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.2.1...%40silajs%2Fvm%402.2.2

## [2.2.1] - 2017-08-04

- Fixed bug prevent the library to be used in the browser

[2.2.1]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.2.0...%40silajs%2Fvm%402.2.1

## [2.2.0] - 2017-07-28

- `Spurious Dragon` & `SIP 150` compatible
- Detailed list of changes in pull requests [#147](https://github.com/sila-chain/silajs-monorepo/pull/147) and [#143](https://github.com/sila-chain/silajs-monorepo/pull/143)
- Removed `enableHomestead` option when creating a [ new VM object](https://github.com/sila-chain/silajs-monorepo#new-vmstatetrie-blockchain) (pre-Homestead fork rules not supported any more)

[2.2.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.1.0...%40silajs%2Fvm%402.2.0

## [2.1.0] - 2017-06-28

- Homestead compatible
- update state test runner for General State Tests

[2.1.0]: https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.0.1...%40silajs%2Fvm%402.1.0

## Older releases:

- [2.0.1](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%402.0.0...%40silajs%2Fvm%402.0.1) - 2016-10-31
- [2.0.0](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.4.0...%40silajs%2Fvm%402.0.0) - 2016-09-26
- [1.4.0](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.3.0...%40silajs%2Fvm%401.4.0) - 2016-05-20
- [1.3.0](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.2.2...%40silajs%2Fvm%401.3.0) - 2016-04-02
- [1.2.2](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.2.1...%40silajs%2Fvm%401.2.2) - 2016-03-31
- [1.2.1](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.2.0...%40silajs%2Fvm%401.2.1) - 2016-03-03
- [1.2.0](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.1.0...%40silajs%2Fvm%401.2.0) - 2016-02-27
- [1.1.0](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.0.4...%40silajs%2Fvm%401.1.0) - 2016-01-09
- [1.0.4](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.0.3...%40silajs%2Fvm%401.0.4) - 2015-12-18
- [1.0.3](https://github.com/sila-chain/silajs-monorepo/compare/%40silajs%2Fvm%401.0.0...%40silajs%2Fvm%401.0.3) - 2015-11-27
- 1.0.0 - 2015-10-06
