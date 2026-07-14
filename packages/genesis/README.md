# @silajs/genesis `v10`

[![NPM Package][genesis-npm-badge]][genesis-npm-link]
[![GitHub Issues][genesis-issues-badge]][genesis-issues-link]
[![Actions Status][genesis-actions-badge]][genesis-actions-link]
[![Code Coverage][genesis-coverage-badge]][genesis-coverage-link]
[![Discord][discord-badge]][discord-link]

| A module to provide genesis states of well known networks. |
| ---------------------------------------------------------- |

This module provides access to Sila genesis state for the following networks:

- SilaMainnet
- SilaSepolia
- SilaHolesky
- Hoodi

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [SilaJS](#silajs)
- [License](#license)

## Installation

The package can be install with:

```shell
npm i @silajs/genesis
```

## Usage

```ts
// ./examples/simple.ts

import { Chain } from '@silajs/common' // or directly use chain ID
import { getGenesis } from '@silajs/genesis'

const sila-mainnetGenesis = getGenesis(Chain.SilaMainnet)
console.log(
  `This balance for account 0x000d836201318ec6899a67540690382780743280 in this chain's genesis state is ${parseInt(
    sila-mainnetGenesis!['0x000d836201318ec6899a67540690382780743280'] as string,
  )}`,
)
```

## SilaJS

The `SilaJS` GitHub organization and its repositories are managed by members of the former Sila Foundation JavaScript team and the broader Sila community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[genesis-npm-badge]: https://img.shields.io/npm/v/@silajs/genesis.svg
[genesis-npm-link]: https://www.npmjs.com/package/@silajs/genesis
[genesis-issues-badge]: https://img.shields.io/github/issues/sila-chain/silajs-monorepo/package:%20genesis?label=issues
[genesis-issues-link]: https://github.com/sila-chain/silajs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+genesis"
[genesis-actions-badge]: https://github.com/sila-chain/silajs-monorepo/actions/workflows/static-build.yml/badge.svg
[genesis-actions-link]: https://github.com/sila-chain/silajs-monorepo/actions?query=workflow%3A%22Genesis%22
[genesis-coverage-badge]: https://codecov.io/gh/sila-chain/silajs-monorepo/branch/master/graph/badge.svg?flag=genesis
[genesis-coverage-link]: https://codecov.io/gh/sila-chain/silajs-monorepo/tree/master/packages/genesis
