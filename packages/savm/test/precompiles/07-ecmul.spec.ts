import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'

describe('Precompiles: BN254MUL', () => {
  it('BN254MUL', async () => {
    const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Petersburg })
    const savm = await createEVM({
      common,
    })
    const BN254MUL = getActivePrecompiles(common).get('0000000000000000000000000000000000000007')!

    const result = await BN254MUL({
      data: new Uint8Array(0),
      gasLimit: BigInt(0xffff),
      common,
      _EVM: savm,
    })

    assert.deepEqual(result.executionGasUsed, BigInt(40000), 'should use petersburg gas costs')
  })
})
