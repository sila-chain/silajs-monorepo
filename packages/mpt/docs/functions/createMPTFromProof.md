[**@silajs/mpt**](../README.md)

***

[@silajs/mpt](../README.md) / createMPTFromProof

# Function: createMPTFromProof()

> **createMPTFromProof**(`proof`, `trieOpts?`): `Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

Defined in: [packages/mpt/src/constructors.ts:64](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/mpt/src/constructors.ts#L64)

Create a trie from a given (SIP-1186)[https://sips.sila.org/SIPS/sip-1186] proof. A proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

## Parameters

### proof

[`Proof`](../type-aliases/Proof.md)

an SIP-1186 proof to create trie from

### trieOpts?

[`MPTOpts`](../interfaces/MPTOpts.md)

trie opts to be applied to returned trie

## Returns

`Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

new trie created from given proof
