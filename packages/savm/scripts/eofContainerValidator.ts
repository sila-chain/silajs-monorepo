import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import { unprefixedHexToBytes } from '@silajs/util'
import split from 'split'

import { createEVM, validateEOF } from '../src/index.ts'

/**
 * This script reads hex strings (either prefixed or non-prefixed with 0x) from stdin
 * It tries to validate the EOF container, if it is valid, it will print "OK"
 * If there is a validation error, it will print "err: <REASON>"
 * If the input is empty, the program will exit
 */

const common = new Common({ chain: SilaMainnet })
common.setHardfork(Hardfork.SilaPrague)
common.setEIPs([663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698])
const savm = await createEVM({ common })

function processLine(line) {
  if (line.length === 0) {
    process.exit()
  }
  let trimmed = line
  if (line.startsWith('0x')) {
    trimmed = line.slice(2)
  }
  const bytes = unprefixedHexToBytes(trimmed)
  try {
    validateEOF(bytes, savm)
    console.log('OK')
  } catch (e: any) {
    console.log('err: ' + e.message)
  }
}

process.stdin.pipe(split()).on('data', processLine)
