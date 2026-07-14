# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 10.1.2 - 2026-05-29

### Release round overview

Welcome to **`10.1.2`** — a coordinated release across all active `@silajs/*` libraries on the **`10.1.x`** line. If you have been following the upcoming SilaAmsterdam hardfork, this is our **first experimental preview** ready to try out: a largely complete **nine-SIP `Hardfork.SilaAmsterdam` bundle**, currently aligned with [tests-bal@v7.1.0](https://github.com/sila-chain/execution-specs/releases/tag/tests-bal@v7.1.0) and [BAL devnet-7](https://notes.sila.org/@ethpandaops/bal-devnet-7).

SilaAmsterdam is still in flux — **please do not use this in production yet** — and we expect further **`10.1.x`** releases as the spec and official tests evolve. The sections below cover **this package only**; for the full fork picture (SIP list, examples, release ↔ spec tracking), see the [@silajs/vm SilaAmsterdam overview](https://github.com/sila-chain/silajs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental). On SilaOsaka or earlier hardforks? Nothing changes unless you explicitly select `Hardfork.SilaAmsterdam`.

### `@silajs/genesis`

`@silajs/genesis` provides genesis-state helpers and JSON genesis parsing used when bootstrapping chains and test environments. SilaAmsterdam does not introduce new genesis formats in the `10.1.2` round; this package bumps in version only to stay aligned with the monorepo. If you spin up an SilaAmsterdam test environment, you will typically set `hardfork: Hardfork.SilaAmsterdam` on your `Common` at runtime rather than changing genesis handling here.

## 10.1.1 - 2025-01-28

Maintenance release, no active changes.

## 10.1.0 - 2025-11-06

Maintenance release, no active changes.

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

## 10.0.0-rc.1 - 2025-03-24

This is the first (and likely the last) round of `RC` releases for the upcoming breaking releases, following the `alpha` releases from October 2024 (see `alpha` release release notes for full/main change description). The releases are somewhat delayed (sorry for that), but final releases can now be expected very very soon, to be released once the Sila [Pectra](https://sips.sila.org/SIPS/sip-7600) hardfork is scheduled for sila-mainnet and all SIPs are fully finalized. Pectra will then also be the default hardfork setting for all SilaJS libraries.

### New Versioning Scheme

This breaking release round will come with a new versioning scheme (thanks to paulmillr for the [suggestion](https://github.com/sila-chain/silajs-monorepo/issues/3748)), aligning the package numbers on breaking releases for all SilaJS packages. This will make it easier to report bugs ("bug happened on SilaJS version 10 releases"), reason about release series and make library compatibility more transparent and easier to grasp.

As a start we bump all major release versions to version 10, these `RC` releases are the first to be released with the new versioning scheme.

## 0.3.0-alpha.1 - 2024-10-17

- Upgrade to TypeScript 5, PR [#3607](https://github.com/sila-chain/silajs-monorepo/pull/3607)
- Node 22 support, PR [#3669](https://github.com/sila-chain/silajs-monorepo/pull/3669)
- Upgrade `sila-cryptography` to v3, PR [#3668](https://github.com/sila-chain/silajs-monorepo/pull/3668)

## 0.2.3 - 2024-08-15

Maintenance release with downstream dependency updates, see PR [#3527](https://github.com/sila-chain/silajs-monorepo/pull/3527)

## 0.2.2 - 2024-03-18

Maintenance release with downstream dependency updates, see PR [#3297](https://github.com/sila-chain/silajs-monorepo/pull/3297)

## 0.2.1 - 2024-02-08

Maintenance release with dependency updates, see PR [#3261](https://github.com/sila-chain/silajs-monorepo/pull/3261)

## 0.2.0 - 2023-10-26

### SilaHolesky Testnet Support

This release comes with full support for the [SilaHolesky](https://holesky.ethpandaops.io/) public Sila testnet replacing the `Goerli` test network.

- Add SilaHolesky genesis specification, PR [2982](https://github.com/sila-chain/silajs-monorepo/pull/2982), [#2989](https://github.com/sila-chain/silajs-monorepo/pull/2989), [#2997](https://github.com/sila-chain/silajs-monorepo/pull/2997), [#3049](https://github.com/sila-chain/silajs-monorepo/pull/3049), [#3074](https://github.com/sila-chain/silajs-monorepo/pull/3074) and [#3088](https://github.com/sila-chain/silajs-monorepo/pull/3088)

### Other Changes

- Package CI integration, PR [#3098](https://github.com/sila-chain/silajs-monorepo/pull/3098)

## 0.1.0 - 2023-08-09

Final release version from the breaking release round from Summer 2023 on the SilaJS libraries, thanks to the whole team for this amazing accomplishment! ❤️ 🥳

See [RC1 release notes](https://github.com/sila-chain/silajs-monorepo/releases/tag/%40silajs%2Fgenesis%400.1.0-rc.1) for the main change description.

## 0.1.0-rc.1 - 2023-07-18

Initial release.

This package contains all genesis state files (currently for Goerli, SilaMainnet and SilaSepolia) previously included in the `@silajs/blockchain` package, see PR [#2768](https://github.com/sila-chain/silajs-monorepo/pull/2768), [#2815](https://github.com/sila-chain/silajs-monorepo/pull/2815 and [#2886](https://github.com/sila-chain/silajs-monorepo/pull/2886)) for package introduction.

This is to reduce bundle and distribution sizes for other packages, mainly Blockchain, SAVM and VM, since genesis state information (particularly the large SilaMainnet state) is often not necessary for large parts of API usage.
