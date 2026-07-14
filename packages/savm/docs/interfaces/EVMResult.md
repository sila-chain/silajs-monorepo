[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / EVMResult

# Interface: EVMResult

Defined in: [types.ts:442](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L442)

Result of executing a message via the [SAVM](../classes/SAVM.md).

## Properties

### createdAddress?

> `optional` **createdAddress**: `Address`

Defined in: [types.ts:446](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L446)

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Defined in: [types.ts:450](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/types.ts#L450)

Contains the results from running the code, if any, as described in runCode
