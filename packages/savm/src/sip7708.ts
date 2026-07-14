import {
  type Address,
  SYSTEM_ADDRESS_BYTES,
  bigIntToBytes,
  hexToBytes,
  setLengthLeft,
} from '@silajs/util'
import type { Log } from './types.ts'

/**
 * SIP-7708 system address (canonical `SYSTEM_ADDRESS_BYTES` from `@silajs/util`).
 *
 * @remarks Experimental (SilaAmsterdam): may change on patch releases.
 */
export const SIP7708_SYSTEM_ADDRESS = SYSTEM_ADDRESS_BYTES

/**
 * SIP-7708: `keccak256('Transfer(address,address,uint256)')`.
 * Matches the SRC-20 Transfer event signature.
 *
 * @remarks Experimental (SilaAmsterdam): may change on patch releases.
 */
export const SIP7708_TRANSFER_TOPIC = hexToBytes(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
)

/**
 * SIP-7708: `keccak256('Burn(address,uint256)')`.
 * LOG2 topic for burn logs on same-tx selfdestruct and account removal.
 *
 * @remarks Experimental (SilaAmsterdam): may change on patch releases.
 */
export const SIP7708_BURN_TOPIC = hexToBytes(
  '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
)

/**
 * Creates an SIP-7708 SIL transfer log (used for CALL/CREATE value transfers).
 * Logs are emitted from the system address with `Transfer(address,address,uint256)` topics.
 *
 * @remarks Experimental (SilaAmsterdam): may change on patch releases.
 */
export function createEIP7708TransferLog(from: Address, to: Address, value: bigint): Log {
  const fromTopic = setLengthLeft(from.bytes, 32)
  const toTopic = setLengthLeft(to.bytes, 32)
  const data = setLengthLeft(bigIntToBytes(value), 32)
  return [SIP7708_SYSTEM_ADDRESS, [SIP7708_TRANSFER_TOPIC, fromTopic, toTopic], data]
}

/**
 * Creates an SIP-7708 burn log (LOG2) for a burned account balance.
 *
 * @remarks Experimental (SilaAmsterdam): may change on patch releases.
 */
export function createEIP7708BurnLog(account: Address, value: bigint): Log {
  const accountTopic = setLengthLeft(account.bytes, 32)
  const data = setLengthLeft(bigIntToBytes(value), 32)
  return [SIP7708_SYSTEM_ADDRESS, [SIP7708_BURN_TOPIC, accountTopic], data]
}
