import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { hexToBytes } from '@silajs/util'
import { assert, describe, it } from 'vitest'

import { EVMError, type InterpreterStep } from '@silajs/savm'
import { createVM } from '../../../src/index.ts'

describe('SIP 3855 tests', () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Chainstart, sips: [3855] })
  const commonNoEIP3855 = new Common({
    chain: SilaMainnet,
    hardfork: Hardfork.Chainstart,
    sips: [],
  })

  it('should correctly use push0 opcode', async () => {
    const vm = await createVM({ common })
    let stack: bigint[]
    const handler = (e: InterpreterStep) => {
      stack = e.stack
    }
    vm.savm.events!.on('step', handler)

    const result = await vm.savm.runCode!({
      code: hexToBytes('0x5F00'),
      gasLimit: BigInt(10),
    })

    assert.strictEqual(stack!.length, 1)
    assert.strictEqual(stack![0], BigInt(0))
    assert.strictEqual(result.executionGasUsed, common.param('push0Gas'))
    vm.savm.events!.removeListener('step', handler)
  })

  it('should correctly use push0 to create a stack with stack limit length', async () => {
    const vm = await createVM({ common })
    let stack: bigint[] = []
    const handler = (e: InterpreterStep) => {
      stack = e.stack
    }
    vm.savm.events!.on('step', handler)

    const depth = Number(common.param('stackLimit'))

    const result = await vm.savm.runCode!({
      code: hexToBytes(`0x${'5F'.repeat(depth)}00`),
      gasLimit: BigInt(10000),
    })

    assert.strictEqual(stack.length, depth)
    for (const elem of stack) {
      if (elem !== BigInt(0)) {
        assert.fail('stack element is not 0')
      }
    }
    assert.strictEqual(result.executionGasUsed, common.param('push0Gas')! * BigInt(depth))
    vm.savm.events!.removeListener('step', handler)
  })

  it('should correctly use push0 to create a stack with stack limit + 1 length', async () => {
    const vm = await createVM({ common })

    const depth = Number(common.param('stackLimit')!) + 1

    const result = await vm.savm.runCode!({
      code: hexToBytes(`0x${'5F'.repeat(depth)}`),
      gasLimit: BigInt(10000),
    })

    assert.strictEqual(result.exceptionError?.error, EVMError.errorMessages.STACK_OVERFLOW)
  })

  it('push0 is not available if SIP3855 is not activated', async () => {
    const vm = await createVM({ common: commonNoEIP3855 })

    const result = await vm.savm.runCode!({
      code: hexToBytes('0x5F'),
      gasLimit: BigInt(10000),
    })

    assert.strictEqual(result.exceptionError!.error, EVMError.errorMessages.INVALID_OPCODE)
  })
})
