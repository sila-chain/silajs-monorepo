import { createBlock } from '@silajs/block'
import { Common, SilaMainnet } from '@silajs/common'
import { keccak256, waitReady } from '@polkadot/wasm-crypto'

const main = async () => {
  // @polkadot/wasm-crypto specific initialization
  await waitReady()

  const common = new Common({ chain: SilaMainnet, customCrypto: { keccak256 } })
  const block = createBlock({}, { common })

  // Method invocations within SilaJS library instantiations where the common
  // instance above is passed will now use the custom keccak_256 implementation
  console.log(block.hash())
}

void main()
