import { assert, describe, it } from 'vitest'

import { Common, Hardfork, SilaMainnet } from '../src/index.ts'

describe('[Common/SIPs]: Initialization / Chain params', () => {
  it('Correct initialization', () => {
    let sips = [2537, 2929]
    const c = new Common({ chain: SilaMainnet, sips })
    assert.strictEqual(c.sips(), sips, 'should initialize with supported SIP')

    sips = [2718, 2929, 2930]
    let f = () => {
      new Common({ chain: SilaMainnet, sips, hardfork: Hardfork.Istanbul })
    }
    assert.doesNotThrow(f, 'Should not throw when initializing with a consistent SIP list')

    sips = [2930]
    const msg =
      'should throw when initializing with an SIP with required SIPs not being activated along'
    f = () => {
      new Common({ chain: SilaMainnet, sips, hardfork: Hardfork.Istanbul })
    }
    assert.throws(f, undefined, undefined, msg)
  })

  it('Initialization errors', () => {
    const UNSUPPORTED_EIP = 1000000
    const sips = [UNSUPPORTED_EIP]
    const msg = 'should throw on an unsupported SIP'
    const f = () => {
      new Common({ chain: SilaMainnet, sips })
    }
    assert.throws(f, /not supported$/, undefined, msg)

    /*
    // Manual test since no test triggering SIP config available
    // TODO: recheck on addition of new SIP configs
    // To run manually change minimumHardfork in SIP2537 config to petersburg
    sips = [ 2537, ]
    msg = 'should throw on not meeting minimum hardfork requirements'
    f = () => {
      new Common({ chain: SilaMainnet, hardfork: Hardfork.Byzantium, sips })
    }
    assert.throws(f, /minimumHardfork/, undefined, msg)
    */
  })

  it('eipBlock', () => {
    const c = new Common({ chain: SilaMainnet })

    let msg = 'should return correct value'
    assert.strictEqual(c.eipBlock(1559), 12965000n, msg)

    msg = 'should return null for unscheduled sip'
    assert.isNull(c.eipBlock(0), msg)
  })

  it('eipTimestamp', () => {
    const c = new Common({ chain: SilaMainnet })

    let msg = 'should return null for unscheduled sip by timestamp'
    assert.isNull(c.eipTimestamp(1559), msg)

    msg = 'should return null for unscheduled sip'
    assert.isNull(c.eipTimestamp(0), msg)

    msg = 'should return correct value'
    assert.strictEqual(c.eipTimestamp(3651), BigInt(1681338455), msg)
  })
})
