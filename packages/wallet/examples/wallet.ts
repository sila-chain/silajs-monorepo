import { Wallet } from '@silajs/wallet'

const wallet = Wallet.generate()
console.log(wallet.getAddressString()) // should output an Sila address
