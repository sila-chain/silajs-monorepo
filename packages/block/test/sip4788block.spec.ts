import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { bytesToHex } from '@silajs/util'
import { assert, describe, it } from 'vitest'

import { createBlock, createBlockHeader } from '../src/index.ts'

describe('SIP4788 header tests', () => {
  it('should work', () => {
    const earlyCommon = new Common({ chain: SilaMainnet, hardfork: Hardfork.Istanbul })
    const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaCancun, sips: [4788] })

    assert.throws(
      () => {
        createBlockHeader(
          {
            parentBeaconBlockRoot: new Uint8Array(32),
          },
          {
            common: earlyCommon,
          },
        )
      },
      'A parentBeaconBlockRoot for a header can only be provided with SIP4788 being activated',
      undefined,
      'should throw when setting parentBeaconBlockRoot with SIP4788 not being activated',
    )

    assert.throws(
      () => {
        createBlockHeader(
          {
            blobGasUsed: 1n,
          },
          {
            common: earlyCommon,
          },
        )
      },
      'blob gas used can only be provided with SIP4844 activated',
      undefined,
      'should throw when setting blobGasUsed with SIP4844 not being activated',
    )
    assert.doesNotThrow(() => {
      createBlockHeader(
        {
          excessBlobGas: 0n,
          blobGasUsed: 0n,
          parentBeaconBlockRoot: new Uint8Array(32),
        },
        {
          common,
          skipConsensusFormatValidation: true,
        },
      )
    }, 'correctly instantiates an SIP4788 block header')

    const block = createBlock(
      {
        header: createBlockHeader({}, { common }),
      },
      { common, skipConsensusFormatValidation: true },
    )
    assert.strictEqual(
      block.toJSON().header?.parentBeaconBlockRoot,
      bytesToHex(new Uint8Array(32)),
      'JSON output includes excessBlobGas',
    )
  })
})
