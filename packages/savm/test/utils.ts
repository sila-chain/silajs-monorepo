import path from 'path'
import { Account } from '@silajs/util'

export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

/**
 * Returns a single file from the sila-tests git submodule
 * @param file
 */
export function getSingleFile(file: string) {
  // TODO: Evaluate if we can get rid of the require, either by switching to async imports or to the createRequire module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(path.resolve('../sila-tests'), file))
}
