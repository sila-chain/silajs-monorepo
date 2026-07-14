import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-sil-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  // Instantiate `common`
  const common = new Common({
    chain: SilaMainnet,
    hardfork: Hardfork.SilaCancun,
    customCrypto: { kzg },
  })

  console.log(common.customCrypto.kzg) // should output the KZG API as an object
}

void main()
