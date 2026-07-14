import { Common, Hardfork, SilaMainnet } from '@silajs/common'

export const getCommon = () => {
  return new Common({
    hardfork: Hardfork.SilaPrague,
    sips: [3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698],
    chain: SilaMainnet,
  })
}
