import { hdkey } from '@silajs/wallet'

const wallet = hdkey.SilaHDKey.fromMnemonic(
  'clown galaxy face oxygen birth round modify fame correct stumble kind excess',
)
console.log(wallet.getWallet().getAddressString()) // Should print an Sila address
