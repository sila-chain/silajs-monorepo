import { assert, describe, it } from 'vitest'

import { createEVM, paramsEVM } from '../src/index.ts'

// TODO: This whole file was missing for quite some time and now (July 2024)
// has been side introduced along another PR. We should add basic initialization
// tests for options and the like.
describe('initialization', () => {
  it('basic initialization', async () => {
    const savm = await createEVM()
    const msg = 'should use the correct parameter defaults'
    assert.isFalse(savm.allowUnlimitedContractSize, msg)
  })

  it('SAVM parameter customization', async () => {
    let savm = await createEVM()
    assert.strictEqual(
      savm.common.param('bn254AddGas'),
      BigInt(150),
      'should use default SAVM parameters',
    )

    const params = JSON.parse(JSON.stringify(paramsEVM))
    params['1679']['bn254AddGas'] = 100 // 150
    savm = await createEVM({ params })
    assert.strictEqual(
      savm.common.param('bn254AddGas'),
      BigInt(100),
      'should use custom parameters provided',
    )
  })
})
