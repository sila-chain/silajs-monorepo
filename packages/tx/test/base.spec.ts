import { Common, Hardfork, SilaMainnet } from '@silajs/common'
import {
  SECP256K1_ORDER,
  bytesToBigInt,
  equalsBytes,
  hexToBytes,
  privateToPublic,
  utf8ToBytes,
} from '@silajs/util'
import { assert, describe, it } from 'vitest'

import {
  AccessList2930Tx,
  Capability,
  FeeMarket1559Tx,
  LegacyTx,
  TransactionType,
  create1559FeeMarketTxFromBytesArray,
  createAccessList2930Tx,
  createAccessList2930TxFromBytesArray,
  createAccessList2930TxFromRLP,
  createFeeMarket1559Tx,
  createFeeMarket1559TxFromRLP,
  createLegacyTx,
  createLegacyTxFromBytesArray,
  createLegacyTxFromRLP,
  paramsTx,
} from '../src/index.ts'

import { sip1559TxsData } from './testData/sip1559txs.ts'
import { sip2930TxsData } from './testData/sip2930txs.ts'
import { txsData } from './testData/txs.ts'

import type { AccessList2930TxData, FeeMarketEIP1559TxData, LegacyTxData } from '../src/index.ts'

describe('[BaseTransaction]', () => {
  // SIP-2930 is not enabled in Common by default (2021-03-06)
  const common = new Common({ chain: SilaMainnet, hardfork: Hardfork.London })

  const legacyTxs: LegacyTx[] = []
  for (const tx of txsData.slice(0, 4)) {
    legacyTxs.push(createLegacyTx(tx.data as LegacyTxData, { common }))
  }

  const sip2930Txs: AccessList2930Tx[] = []
  for (const tx of sip2930TxsData) {
    sip2930Txs.push(createAccessList2930Tx(tx.data as AccessList2930TxData, { common }))
  }

  const sip1559Txs: FeeMarket1559Tx[] = []
  for (const tx of sip1559TxsData) {
    sip1559Txs.push(createFeeMarket1559Tx(tx.data as FeeMarketEIP1559TxData, { common }))
  }

  const zero = new Uint8Array(0)
  const txTypes = [
    {
      class: LegacyTx,
      name: 'LegacyTx',
      type: TransactionType.Legacy,
      values: Array(6).fill(zero),
      txs: legacyTxs,
      fixtures: txsData,
      activeCapabilities: [],
      create: {
        txData: createLegacyTx,
        rlp: createLegacyTxFromRLP,
        bytesArray: createLegacyTxFromBytesArray,
      },
      notActiveCapabilities: [
        Capability.SIP1559FeeMarket,
        Capability.SIP2718TypedTransaction,
        Capability.SIP2930AccessLists,
        9999,
      ],
    },
    {
      class: AccessList2930Tx,
      name: 'AccessList2930Tx',
      type: TransactionType.AccessListEIP2930,
      values: [new Uint8Array([1])].concat(Array(7).fill(zero)),
      txs: sip2930Txs,
      fixtures: sip2930TxsData,
      activeCapabilities: [Capability.SIP2718TypedTransaction, Capability.SIP2930AccessLists],
      create: {
        txData: createAccessList2930Tx,
        rlp: createAccessList2930TxFromRLP,
        bytesArray: createAccessList2930TxFromBytesArray,
      },
      notActiveCapabilities: [Capability.SIP1559FeeMarket, 9999],
    },
    {
      class: FeeMarket1559Tx,
      name: 'FeeMarket1559Tx',
      type: TransactionType.FeeMarketEIP1559,
      values: [new Uint8Array([1])].concat(Array(8).fill(zero)),
      txs: sip1559Txs,
      fixtures: sip1559TxsData,
      activeCapabilities: [
        Capability.SIP1559FeeMarket,
        Capability.SIP2718TypedTransaction,
        Capability.SIP2930AccessLists,
      ],
      create: {
        txData: createFeeMarket1559Tx,
        rlp: createFeeMarket1559TxFromRLP,
        bytesArray: create1559FeeMarketTxFromBytesArray,
      },
      notActiveCapabilities: [9999],
    },
  ]

  it('Initialization', () => {
    for (const txType of txTypes) {
      let tx = txType.create.txData({}, { common })
      assert.strictEqual(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`,
      )
      assert.isFrozen(tx, `${txType.name}: tx should be frozen by default`)

      const initCommon = new Common({
        chain: SilaMainnet,
        hardfork: Hardfork.London,
      })
      tx = txType.create.txData({}, { common: initCommon })
      assert.strictEqual(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`,
      )

      initCommon.setHardfork(Hardfork.Byzantium)
      assert.strictEqual(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should stay on correct HF if outer common HF changes`,
      )

      tx = txType.create.txData({}, { common, freeze: false })
      assert.isNotFrozen(
        tx,
        `${txType.name}: tx should not be frozen when freeze deactivated in options`,
      )

      const params = JSON.parse(JSON.stringify(paramsTx))
      params['1']['txGas'] = 30000 // 21000
      tx = txType.create.txData({}, { common, params })
      assert.strictEqual(
        tx.common.param('txGas'),
        BigInt(30000),
        'should use custom parameters provided',
      )

      // Perform the same test as above, but now using a different construction method. This also implies that passing on the
      // options object works as expected.
      tx = txType.create.txData({}, { common, freeze: false })
      const rlpData = tx.serialize()

      tx = txType.create.rlp(rlpData, { common })
      assert.strictEqual(
        tx.type,
        txType.type,
        `${txType.name}: fromSerializedTx() -> should initialize correctly`,
      )

      assert.isFrozen(tx, `${txType.name}: tx should be frozen by default`)

      tx = txType.create.rlp(rlpData, { common, freeze: false })
      assert.isNotFrozen(
        tx,
        `${txType.name}: tx should not be frozen when freeze deactivated in options`,
      )

      tx = txType.create.bytesArray(txType.values as any, { common })
      assert.isFrozen(tx, `${txType.name}: tx should be frozen by default`)

      tx = txType.create.bytesArray(txType.values as any, { common, freeze: false })
      assert.isNotFrozen(
        tx,
        `${txType.name}: tx should not be frozen when freeze deactivated in options`,
      )
    }
  })

  it('createWithdrawalFromBytesArray()', () => {
    let rlpData: any = legacyTxs[0].raw()
    rlpData[0] = hexToBytes('0x0')
    try {
      createLegacyTxFromBytesArray(rlpData)
      assert.fail('should have thrown when nonce has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('nonce cannot have leading zeroes'),
        'should throw with nonce with leading zeroes',
      )
    }
    rlpData[0] = hexToBytes('0x')
    rlpData[6] = hexToBytes('0x0')
    try {
      createLegacyTxFromBytesArray(rlpData)
      assert.fail('should have thrown when v has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('v cannot have leading zeroes'),
        'should throw with v with leading zeroes',
      )
    }
    rlpData = sip2930Txs[0].raw()
    rlpData[3] = hexToBytes('0x0')
    try {
      createAccessList2930TxFromBytesArray(rlpData)
      assert.fail('should have thrown when gasLimit has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('gasLimit cannot have leading zeroes'),
        'should throw with gasLimit with leading zeroes',
      )
    }
    rlpData = sip1559Txs[0].raw()
    rlpData[2] = hexToBytes('0x0')
    try {
      create1559FeeMarketTxFromBytesArray(rlpData)
      assert.fail('should have thrown when maxPriorityFeePerGas has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('maxPriorityFeePerGas cannot have leading zeroes'),
        'should throw with maxPriorityFeePerGas with leading zeroes',
      )
    }
  })

  it('serialize()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.isDefined(
          txType.create.rlp(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`,
        )
        assert.isDefined(
          txType.create.rlp(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`,
        )
      }
    }
  })

  it('supports()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        for (const activeCapability of txType.activeCapabilities) {
          assert.isDefined(
            tx.supports(activeCapability),
            `${txType.name}: should recognize all supported capabilities`,
          )
        }
        for (const notActiveCapability of txType.notActiveCapabilities) {
          assert.isFalse(
            tx.supports(notActiveCapability),
            `${txType.name}: should reject non-active existing and not existing capabilities`,
          )
        }
      }
    }
  })

  it('raw()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.isDefined(
          txType.create.bytesArray(tx.raw() as any, { common }),
          `${txType.name}: should do roundtrip raw() -> createWithdrawalFromBytesArray()`,
        )
      }
    }
  })

  it('verifySignature()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.strictEqual(tx.verifySignature(), true, `${txType.name}: signature should be valid`)
      }
    }
  })

  it('verifySignature() -> invalid', () => {
    for (const txType of txTypes) {
      for (const txFixture of txType.fixtures.slice(0, 4)) {
        // set `s` to a single zero
        txFixture.data.s = '0x' + '0'
        const tx = txType.create.txData((txFixture as any).data, { common })
        assert.strictEqual(
          tx.verifySignature(),
          false,
          `${txType.name}: signature should not be valid`,
        )
        assert.include(
          tx.getValidationErrors(),
          'Invalid Signature',
          `${txType.name}: should return an error string about not verifying signatures`,
        )
        assert.isFalse(tx.isValid(), `${txType.name}: should not validate correctly`)
      }
    }
  })

  it('sign()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          assert.isDefined(tx.sign(hexToBytes(`0x${privateKey}`)), `${txType.name}: should sign tx`)
        }

        assert.throws(
          () => tx.sign(utf8ToBytes('invalid')),
          undefined,
          undefined,
          `${txType.name}: should fail with invalid PK`,
        )
      }
    }
  })

  it('isSigned() -> returns correct values', () => {
    for (const txType of txTypes) {
      const txs = [
        ...txType.txs,
        // add unsigned variants
        ...txType.txs.map((tx) =>
          //@ts-expect-error Not sure why this is now throwing
          txType.create.txData({
            ...tx,
            v: undefined,
            r: undefined,
            s: undefined,
          }),
        ),
      ]
      for (const tx of txs) {
        assert.strictEqual(
          tx.isSigned(),
          tx.v !== undefined && tx.r !== undefined && tx.s !== undefined,
          'isSigned() returns correctly',
        )
      }
    }
  })

  it('getSenderAddress()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey, sendersAddress } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          assert.strictEqual(
            signedTx.getSenderAddress().toString(),
            `0x${sendersAddress}`,
            `${txType.name}: should get sender's address after signing it`,
          )
        }
      }
    }
  })

  it('getSenderPublicKey()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          const txPubKey = signedTx.getSenderPublicKey()
          const pubKeyFromPriv = privateToPublic(hexToBytes(`0x${privateKey}`))
          assert.isTrue(
            equalsBytes(txPubKey, pubKeyFromPriv),
            `${txType.name}: should get sender's public key after signing it`,
          )
        }
      }
    }
  })

  it('getSenderPublicKey() -> should throw if s-value is greater than secp256k1n/2', () => {
    // SIP-2: All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    // Reasoning: https://sila.stackexchange.com/a/55728
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          let signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          signedTx = JSON.parse(JSON.stringify(signedTx)) // deep clone
          // @ts-expect-error -- Assign to read-only property
          signedTx.s = SECP256K1_ORDER + BigInt(1)
          assert.throws(
            () => {
              signedTx.getSenderPublicKey()
            },
            undefined,
            undefined,
            'should throw when s-value is greater than secp256k1n/2',
          )
        }
      }
    }
  })

  it('verifySignature()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          assert.isTrue(signedTx.verifySignature(), `${txType.name}: should verify signing it`)
        }
      }
    }
  })

  it('initialization with defaults', () => {
    const bufferZero = hexToBytes('0x')
    const tx = createLegacyTx({
      nonce: undefined,
      gasLimit: undefined,
      gasPrice: undefined,
      to: undefined,
      value: undefined,
      data: undefined,
      v: undefined,
      r: undefined,
      s: undefined,
    })
    assert.strictEqual(tx.v, undefined)
    assert.strictEqual(tx.r, undefined)
    assert.strictEqual(tx.s, undefined)
    assert.deepEqual(tx.to, undefined)
    assert.strictEqual(tx.value, bytesToBigInt(bufferZero))
    assert.deepEqual(tx.data, bufferZero)
    assert.strictEqual(tx.gasPrice, bytesToBigInt(bufferZero))
    assert.strictEqual(tx.gasLimit, bytesToBigInt(bufferZero))
    assert.strictEqual(tx.nonce, bytesToBigInt(bufferZero))
  })
})
