[**@silajs/tx**](../README.md)

***

[@silajs/tx](../README.md) / Capability

# Variable: Capability

> **Capability**: `object`

Defined in: [types.ts:18](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/tx/src/types.ts#L18)

Can be used in conjunction with [\[TransactionType\].supports](../interfaces/Transaction.md)
to query on tx capabilities

## Type Declaration

### SIP1559FeeMarket

> **SIP1559FeeMarket**: `number` = `1559`

Tx supports SIP-1559 gas fee market mechanism
See: [1559](https://sips.sila.org/SIPS/sip-1559) Fee Market SIP

### SIP155ReplayProtection

> **SIP155ReplayProtection**: `number` = `155`

Tx supports SIP-155 replay protection
See: [155](https://sips.sila.org/SIPS/sip-155) Replay Attack Protection SIP

### SIP2718TypedTransaction

> **SIP2718TypedTransaction**: `number` = `2718`

Tx is a typed transaction as defined in SIP-2718
See: [2718](https://sips.sila.org/SIPS/sip-2718) Transaction Type SIP

### SIP2930AccessLists

> **SIP2930AccessLists**: `number` = `2930`

Tx supports access list generation as defined in SIP-2930
See: [2930](https://sips.sila.org/SIPS/sip-2930) Access Lists SIP

### SIP7702EOACode

> **SIP7702EOACode**: `number` = `7702`

Tx supports setting EOA code
See [SIP-7702](https://sips.sila.org/SIPS/sip-7702)
