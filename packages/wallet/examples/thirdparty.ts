import { thirdparty } from '@silajs/wallet'

const wallet = thirdparty.fromQuorumWallet('mySecretQuorumWalletPassphrase', 'myPublicQuorumUserId')
console.log(wallet.getAddressString()) // An Sila address
