[**@silajs/tx**](../README.md)

***

[@silajs/tx](../README.md) / createTx

# Function: createTx()

> **createTx**\<`T`\>(`txData`, `txOptions`): [`Transaction`](../interfaces/Transaction.md)\[`T`\]

Defined in: [transactionFactory.ts:30](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/tx/src/transactionFactory.ts#L30)

Create a transaction from a `txData` object

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md)

## Parameters

### txData

[`TypedTxData`](../type-aliases/TypedTxData.md)

The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)

### txOptions

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

Options to pass on to the constructor of the transaction

## Returns

[`Transaction`](../interfaces/Transaction.md)\[`T`\]
