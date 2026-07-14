import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { EVMError } from '@silajs/savm'
import { bytesToBigInt, hexToBytes } from '@silajs/util'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../../src/index.ts'

const testCases = [
  { chain: SilaMainnet, hardfork: Hardfork.Istanbul, chainId: BigInt(1) },
  { chain: SilaMainnet, hardfork: Hardfork.Constantinople, err: EVMError.errorMessages.INVALID_OPCODE },
]

// CHAINID PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['46', '60', '00', '53', '60', '01', '60', '00', 'f3']

describe('Istanbul: SIP-1344', () => {
  it('CHAINID', async () => {
    const runCodeArgs = {
      code: hexToBytes(`0x${code.join('')}`),
      gasLimit: BigInt(0xffff),
    }

    for (const testCase of testCases) {
      const { chain, hardfork } = testCase
      const common = new Common({ chain, hardfork })
      const vm = await createVM({ common })
      try {
        const res = await vm.savm.runCode!(runCodeArgs)
        if (testCase.err !== undefined) {
          assert.strictEqual(res.exceptionError?.error, testCase.err)
        } else {
          assert.isTrue(res.exceptionError === undefined)
          assert.strictEqual(testCase.chainId, bytesToBigInt(res.returnValue))
        }
      } catch (e: any) {
        assert.fail(e.message)
      }
    }
  })
})
