import { RLP } from '@silajs/rlp'
import { BIGINT_0, BIGINT_1, SilaJSErrorWithoutCode, concatBytes } from '@silajs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { txTypeBytes } from '../util/internal.ts'

import { errorMsg } from './legacy.ts'

import type { Input } from '@silajs/rlp'
import type { SIP2718CompatibleTx } from '../types.ts'

/**
 * Gets the hashed message to sign for SIP-2718 transactions
 * @param tx - The SIP-2718 compatible transaction
 * @returns Hashed message to sign
 */
export function getHashedMessageToSign(tx: SIP2718CompatibleTx): Uint8Array {
  const keccakFunction = tx.common.customCrypto.keccak256 ?? keccak_256
  return keccakFunction(tx.getMessageToSign())
}

/**
 * Serializes an SIP-2718 transaction
 * @param tx - The SIP-2718 compatible transaction
 * @param base - Optional base input for RLP encoding
 * @returns Serialized transaction bytes
 */
export function serialize(tx: SIP2718CompatibleTx, base?: Input): Uint8Array {
  return concatBytes(txTypeBytes(tx.type), RLP.encode(base ?? tx.raw()))
}

/**
 * Validates the y-parity value of an SIP-2718 transaction
 * @param tx - The SIP-2718 compatible transaction
 * @throws SilaJSErrorWithoutCode if y-parity is invalid
 */
export function validateYParity(tx: SIP2718CompatibleTx) {
  const { v } = tx
  if (v !== undefined && v !== BIGINT_0 && v !== BIGINT_1) {
    const msg = errorMsg(tx, 'The y-parity of the transaction should either be 0 or 1')
    throw SilaJSErrorWithoutCode(msg)
  }
}
