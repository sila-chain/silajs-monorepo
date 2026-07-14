import * as SIP2930 from './sip2930.ts'

import {
  SilaJSErrorWithoutCode,
  MAX_INTEGER,
  MAX_UINT64,
  bytesToBigInt,
  validateNoLeadingZeroes,
} from '@silajs/util'
import type { SIP7702CompatibleTx } from '../types.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: SIP7702CompatibleTx): bigint {
  const sip2930Cost = SIP2930.getDataGas(tx)
  const sip7702Cost = BigInt(
    tx.authorizationList.length * Number(tx.common.param('perEmptyAccountCost')),
  )
  return sip2930Cost + sip7702Cost
}

/**
 * Checks if the authorization list is valid. Throws if invalid.
 * @param tx - Transaction whose authorization list should be validated
 */
export function verifyAuthorizationList(tx: SIP7702CompatibleTx) {
  const authorizationList = tx.authorizationList
  if (authorizationList.length === 0) {
    throw SilaJSErrorWithoutCode('Invalid SIP-7702 transaction: authorization list is empty')
  }

  for (const item of authorizationList) {
    if (item.length !== 6) {
      throw SilaJSErrorWithoutCode(
        'Invalid SIP-7702 transaction: authorization list item should have 6 elements',
      )
    }

    for (const member of item) {
      // This checks if the `member` is a list, not bytes
      // This checks that the authority list does not have any embedded lists in it
      if (Array.isArray(member)) {
        throw SilaJSErrorWithoutCode(
          'Invalid SIP-7702 transaction: authority list element is a list, not bytes',
        )
      }
    }

    const [chainId, address, nonce, yParity, r, s] = item

    validateNoLeadingZeroes({ yParity, r, s, nonce, chainId })

    if (address.length !== 20) {
      throw SilaJSErrorWithoutCode(
        'Invalid SIP-7702 transaction: address length should be 20 bytes',
      )
    }

    if (bytesToBigInt(chainId) > MAX_INTEGER) {
      throw SilaJSErrorWithoutCode('Invalid SIP-7702 transaction: chainId exceeds 2^256 - 1')
    }

    if (bytesToBigInt(nonce) > MAX_UINT64) {
      throw SilaJSErrorWithoutCode('Invalid SIP-7702 transaction: nonce exceeds 2^64 - 1')
    }

    const yParityBigInt = bytesToBigInt(yParity)
    if (yParityBigInt >= BigInt(2 ** 8)) {
      throw SilaJSErrorWithoutCode(
        'Invalid SIP-7702 transaction: yParity should be fit within 1 byte (0 - 255)',
      )
    }

    if (bytesToBigInt(r) > MAX_INTEGER) {
      throw SilaJSErrorWithoutCode('Invalid SIP-7702 transaction: r exceeds 2^256 - 1')
    }

    if (bytesToBigInt(s) > MAX_INTEGER) {
      throw SilaJSErrorWithoutCode('Invalid SIP-7702 transaction: s exceeds 2^256 - 1')
    }
  }
}
