[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / activeCostPerStateByte

# Function: activeCostPerStateByte()

> **activeCostPerStateByte**(`common`, `_blockGasLimit?`): `bigint`

Defined in: [sip8037.ts:14](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/sip8037.ts#L14)

SIP-8037 cost-per-state-byte. Under the v7 fixtures the value is a flat
constant (sourced from the `costPerStateByte` common parameter) rather than
the earlier draft's block-gas-limit-derived value. The helper is kept so
callers do not need to know whether the value is constant or derived; a
future spec revision could re-introduce a derivation here.

## Parameters

### common

`Common`

### \_blockGasLimit?

`bigint`

## Returns

`bigint`

## Remarks

Experimental (SilaAmsterdam): may change on patch releases.
