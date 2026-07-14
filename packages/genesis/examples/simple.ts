import { Chain } from '@silajs/common' // or directly use chain ID
import { getGenesis } from '@silajs/genesis'

const sila-mainnetGenesis = getGenesis(Chain.SilaMainnet)
console.log(
  `This balance for account 0x000d836201318ec6899a67540690382780743280 in this chain's genesis state is ${parseInt(
    sila-mainnetGenesis!['0x000d836201318ec6899a67540690382780743280'] as string,
  )}`,
)
