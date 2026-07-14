import { bench, describe } from 'vitest'
import { SilaMainnet } from '../../src/chains.ts'
import { Common } from '../../src/common.ts'
import { Hardfork } from '../../src/enums.ts'

describe('Common _buildParamsCache Benchmark', () => {
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaShanghai, sips: [4844] })

  bench('_buildParamsCache', () => {
    // @ts-expect-error - accessing protected method for benchmarking
    common._buildParamsCache()
  })
})
