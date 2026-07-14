// cspell:ignore xprv xpub
import { mnemonicToSeedSync } from 'sila-cryptography/bip39/index.js'
import { HDKey } from 'sila-cryptography/hdkey.js'

import { SilaJSErrorWithoutCode } from '@silajs/util'
import { Wallet } from './wallet.ts'

export class SilaHDKey {
  private readonly _hdkey: HDKey
  constructor(hdkey: HDKey) {
    this._hdkey = hdkey
  }
  /**
   * Creates an instance based on a seed.
   */
  public static fromMasterSeed(seedBuffer: Uint8Array): SilaHDKey {
    return new SilaHDKey(HDKey.fromMasterSeed(seedBuffer))
  }

  /**
   * Creates an instance based on BIP39 mnemonic phrases
   */
  public static fromMnemonic(mnemonic: string, passphrase?: string): SilaHDKey {
    return SilaHDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic, passphrase))
  }

  /**
   * Create an instance based on a BIP32 extended private or public key.
   */
  public static fromExtendedKey(base58Key: string): SilaHDKey {
    return new SilaHDKey(HDKey.fromExtendedKey(base58Key))
  }

  /**
   * Returns a BIP32 extended private key (xprv)
   */
  public privateExtendedKey(): string {
    if (!this._hdkey.privateExtendedKey) {
      throw SilaJSErrorWithoutCode('This is a public key only wallet')
    }
    return this._hdkey.privateExtendedKey
  }

  /**
   * Return a BIP32 extended public key (xpub)
   */
  public publicExtendedKey(): string {
    return this._hdkey.publicExtendedKey
  }

  /**
   * Derives a node based on a path (e.g. m/44'/0'/0/1)
   */
  public derivePath(path: string): SilaHDKey {
    return new SilaHDKey(this._hdkey.derive(path))
  }

  /**
   * Derive a node based on a child index
   */
  public deriveChild(index: number): SilaHDKey {
    return new SilaHDKey(this._hdkey.deriveChild(index))
  }

  /**
   * Return a `Wallet` instance as seen above
   */
  public getWallet(): Wallet {
    if (this._hdkey.privateKey) {
      return Wallet.fromPrivateKey(this._hdkey.privateKey)
    }
    if (!this._hdkey.publicKey) throw SilaJSErrorWithoutCode('No hdkey')
    return Wallet.fromPublicKey(this._hdkey.publicKey, true)
  }
}
