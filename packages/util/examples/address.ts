import { createAddressFromString } from '@silajs/util'

const address = createAddressFromString('0x2f015c60e0be116b1f0cd534704db9c92118fb6a')
console.log(`Sila address ${address.toString()} created`)
