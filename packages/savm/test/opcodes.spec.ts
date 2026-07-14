import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../src/index.ts'

describe('SAVM -> getActiveOpcodes()', () => {
  const DIFFICULTY_PREVRANDAO = 0x44
  const CHAINID = 0x46 //istanbul opcode

  it('should not expose opcodes from a follow-up HF (istanbul -> petersburg)', async () => {
    const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Petersburg })
    const savm = await createEVM({ common })
    assert.strictEqual(
      savm.getActiveOpcodes().get(CHAINID),
      undefined,
      'istanbul opcode not exposed (HF: < istanbul (petersburg)',
    )
  })

  it('should expose opcodes when HF is active (>= istanbul)', async () => {
    let common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Istanbul })
    let savm = await createEVM({ common })
    assert.strictEqual(
      savm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'istanbul opcode exposed (HF: istanbul)',
    )

    common = new Common({ chain: SilaMainnet, hardfork: Hardfork.MuirGlacier })
    savm = await createEVM({ common })
    assert.strictEqual(
      savm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'istanbul opcode exposed (HF: > istanbul (muirGlacier)',
    )
  })

  it('should switch DIFFICULTY opcode name to PREVRANDAO when >= Merge HF', async () => {
    let common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Istanbul })
    let savm = await createEVM({ common })
    assert.strictEqual(
      savm.getActiveOpcodes().get(DIFFICULTY_PREVRANDAO)!.name,
      'DIFFICULTY',
      'Opcode x44 named DIFFICULTY pre-Merge',
    )

    common = new Common({ chain: SilaMainnet, hardfork: Hardfork.SilaParis })
    savm = await createEVM({ common })
    assert.strictEqual(
      savm.getActiveOpcodes().get(DIFFICULTY_PREVRANDAO)!.name,
      'PREVRANDAO',
      'Opcode x44 named PREVRANDAO post-Merge',
    )
  })

  it('should update opcodes on a hardfork change', async () => {
    const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.Istanbul })
    const savm = await createEVM({ common })

    common.setHardfork(Hardfork.Byzantium)
    assert.strictEqual(
      savm.getActiveOpcodes().get(CHAINID),
      undefined,
      'opcode not exposed after HF change (-> < istanbul)',
    )

    common.setHardfork(Hardfork.Istanbul)
    assert.strictEqual(
      savm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'opcode exposed after HF change (-> istanbul)',
    )
  })
})
