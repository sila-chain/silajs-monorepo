[**@silajs/util**](../README.md)

***

[@silajs/util](../README.md) / isDebugEnabled

# Function: isDebugEnabled()

> **isDebugEnabled**(`namespace`): `boolean`

Defined in: [packages/util/src/env.ts:8](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/util/src/env.ts#L8)

Safely checks if debug logging is enabled for the given namespace string.
Works in Node.js, browser main thread, web workers, and service workers.

Uses `globalThis.process` to avoid ReferenceError in environments where
`process` is not a declared global (e.g., web workers, service workers).

## Parameters

### namespace

`string`

## Returns

`boolean`
