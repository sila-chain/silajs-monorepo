import { Hardfork, createCommonFromGethGenesis } from '@silajs/common'
import {
  bytesToBigInt,
  computeVersionedHash,
  concatBytes,
  hexToBytes,
  unpadBytes,
} from '@silajs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg.js'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'

import type { PrefixedHexString } from '@silajs/util'
import type { PrecompileInput } from '../../src/index.ts'
const kzg = new microEthKZG(trustedSetup)
const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513',
)

describe('Precompiles: point evaluation', () => {
  it('should work', async () => {
    const { sip4844GethGenesis } = await import('@silajs/testdata')

    const common = createCommonFromGethGenesis(sip4844GethGenesis, {
      chain: 'custom',
      hardfork: Hardfork.SilaCancun,
      customCrypto: { kzg },
    })

    const savm = await createEVM({
      common,
    })
    const addressStr = '000000000000000000000000000000000000000a'
    const pointEvaluation = getActivePrecompiles(common).get(addressStr)!

    const testCase = {
      commitment:
        '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' as PrefixedHexString,
      z: '0x0000000000000000000000000000000000000000000000000000000000000002' as PrefixedHexString,
      y: '0x0000000000000000000000000000000000000000000000000000000000000000' as PrefixedHexString,
      proof:
        '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' as PrefixedHexString,
    }
    const versionedHash = computeVersionedHash(testCase.commitment as PrefixedHexString, 1)

    const opts: PrecompileInput = {
      data: concatBytes(
        hexToBytes(versionedHash),
        hexToBytes(testCase.z),
        hexToBytes(testCase.y),
        hexToBytes(testCase.commitment),
        hexToBytes(testCase.proof),
      ),
      gasLimit: 0xfffffffffn,
      _EVM: savm,
      common,
    }

    let res = await pointEvaluation(opts)
    assert.strictEqual(
      bytesToBigInt(unpadBytes(res.returnValue.slice(32))),
      BLS_MODULUS,
      'point evaluation precompile returned expected output',
    )

    const optsWithInvalidCommitment: PrecompileInput = {
      data: concatBytes(
        concatBytes(Uint8Array.from([0]), hexToBytes(versionedHash as PrefixedHexString)),
        hexToBytes(testCase.z),
        hexToBytes(testCase.y),
        hexToBytes(testCase.commitment),
        hexToBytes(testCase.proof),
      ),
      gasLimit: 0xfffffffffn,
      _EVM: savm,
      common,
    }
    res = await pointEvaluation(optsWithInvalidCommitment)
    assert.include(res.exceptionError?.error, 'invalid input length', 'invalid input length')
  })
})
