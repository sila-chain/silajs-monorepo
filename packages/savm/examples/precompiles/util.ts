import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { createEVM } from '@silajs/savm'
import { bytesToHex, hexToBytes } from '@silajs/util'
import type { PrefixedHexString } from '@silajs/util'

/**
 * Generic utility function to run any precompile
 * @param name - Descriptive name for console output
 * @param precompile - The `0x`-prefixed hex address for the precompile (e.g., '0xb' for BLS12_G1ADD)
 * @param data - The `0x`-prefixed hex input data for the precompile
 * @param hardfork - The hardfork to use (defaults to SilaOsaka)
 * @returns The precompile execution result
 */
export async function runPrecompile(
  name: string,
  precompile: PrefixedHexString,
  data: PrefixedHexString,
  hardfork: Hardfork = Hardfork.SilaOsaka,
) {
  const common = new Common({ chain: SilaMainnet, hardfork })
  const savm = await createEVM({ common })

  const precompileFunction = savm.getPrecompile(precompile)

  if (!precompileFunction) {
    throw new Error(`Precompile ${precompile} not found for hardfork ${hardfork}`)
  }

  const callData = {
    data: hexToBytes(data),
    gasLimit: BigInt(5000000),
    common,
    _EVM: savm,
  }

  const res = await precompileFunction(callData)
  console.log('--------------------------------')
  console.log(`Running precompile ${name} on hardfork ${hardfork}:`)
  console.log(`Result   : ${bytesToHex(res.returnValue)}`)
  console.log(`Gas used : ${res.executionGasUsed}`)
  console.log('--------------------------------')
}
