import { type PrefixedHexString, hexToBytes } from '@silajs/util'
import { assert, describe, it } from 'vitest'

import { default as testData } from '../../../sila-tests/EOFTests/SIP5450/validInvalid.json' with {
  type: 'json',
}
import { validateEOF } from '../../src/eof/container.ts'
import { createEVM } from '../../src/index.ts'

import { getCommon } from './eof-utils.ts'

async function getEVM() {
  const common = getCommon()
  const savm = createEVM({
    common,
  })
  return savm
}

describe('SIP 5450 tests', async () => {
  const savm = await getEVM()
  for (const key in testData.validInvalid.vectors) {
    it(`Container validation tests ${key}`, () => {
      const input = testData.validInvalid.vectors[key as keyof typeof testData.validInvalid.vectors]
      const code = hexToBytes(input.code as PrefixedHexString)

      const expected = input.results.SilaOsaka.result

      if (expected === true) {
        validateEOF(code, savm)
      } else {
        assert.throws(() => {
          // TODO verify that the correct error is thrown
          validateEOF(code, savm)
        })
      }
    })
  }
})
