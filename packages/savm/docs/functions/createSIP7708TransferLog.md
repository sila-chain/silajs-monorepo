[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / createEIP7708TransferLog

# Function: createEIP7708TransferLog()

> **createEIP7708TransferLog**(`from`, `to`, `value`): [`Log`](../type-aliases/Log.md)

Defined in: [sip7708.ts:43](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/sip7708.ts#L43)

Creates an SIP-7708 SIL transfer log (used for CALL/CREATE value transfers).
Logs are emitted from the system address with `Transfer(address,address,uint256)` topics.

## Parameters

### from

`Address`

### to

`Address`

### value

`bigint`

## Returns

[`Log`](../type-aliases/Log.md)

## Remarks

Experimental (SilaAmsterdam): may change on patch releases.
