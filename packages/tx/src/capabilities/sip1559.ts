import { SilaJSErrorWithoutCode } from '@silajs/util'

import type { SIP1559CompatibleTx } from '../types.ts'

/**
 * Calculates the total upfront wei cost required for an SIP-1559 compatible transaction.
 * @param tx - Transaction whose costs should be evaluated
 * @param baseFee - Base fee from the parent block used to determine inclusion cost
 * @returns Total wei that must be available to cover gas and value
 */
export function getUpfrontCost(tx: SIP1559CompatibleTx, baseFee: bigint): bigint {
  const prio = tx.maxPriorityFeePerGas
  const maxBase = tx.maxFeePerGas - baseFee
  const inclusionFeePerGas = prio < maxBase ? prio : maxBase
  const gasPrice = inclusionFeePerGas + baseFee
  return tx.gasLimit * gasPrice + tx.value
}

/**
 * Determines the effective priority fee that can be paid to the block proposer.
 * @param tx - Transaction whose priority fee is being computed
 * @param baseFee - Base fee from the parent block; must be payable by the tx
 * @returns The lesser of `maxPriorityFeePerGas` and the remaining fee after base fee deduction
 * @throws SilaJSErrorWithoutCode if the base fee exceeds `maxFeePerGas`
 */
export function getEffectivePriorityFee(
  tx: SIP1559CompatibleTx,
  baseFee: bigint | undefined,
): bigint {
  if (baseFee === undefined || baseFee > tx.maxFeePerGas) {
    throw SilaJSErrorWithoutCode('Tx cannot pay baseFee')
  }

  // The remaining fee for the coinbase, which can take up to this value, capped at `maxPriorityFeePerGas`
  const remainingFee = tx.maxFeePerGas - baseFee

  return tx.maxPriorityFeePerGas < remainingFee ? tx.maxPriorityFeePerGas : remainingFee
}
