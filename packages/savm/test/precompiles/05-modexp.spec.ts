import { Common, SilaMainnet } from '@silajs/common'
import { bytesToHex, hexToBytes } from '@silajs/util'
import { assert, beforeAll, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'

import { testData } from './modexp-testdata.ts'

import type { PrefixedHexString } from '@silajs/util'
import type { SAVM } from '../../src/index.ts'
import type { PrecompileFunc } from '../../src/precompiles/types.ts'

const fuzzerTests = testData.data as PrefixedHexString[][]
describe('Precompiles: MODEXP', () => {
  let common: Common
  let savm: SAVM
  let addressStr: string
  let MODEXP: PrecompileFunc
  beforeAll(async () => {
    common = new Common({ chain: SilaMainnet })
    savm = await createEVM({
      common,
    })
    addressStr = '0000000000000000000000000000000000000005'
    MODEXP = getActivePrecompiles(common).get(addressStr)!
  })

  let n = 0
  for (const [input, expect] of fuzzerTests) {
    n++
    it(`MODEXP edge cases (issue 3168) - case ${n}`, async () => {
      const result = await MODEXP({
        data: hexToBytes(input),
        gasLimit: BigInt(0xffff),
        common,
        _EVM: savm,
      })
      const output = bytesToHex(result.returnValue)
      assert.strictEqual(output, expect)
    })
  }

  it('should correctly right-pad data if input length is too short', async () => {
    const gas = BigInt(0xffff)
    const result = await MODEXP({
      data: hexToBytes('0x41'),
      gasLimit: gas,
      common,
      _EVM: savm,
    })
    assert.strictEqual(result.executionGasUsed, gas)
  })
})
