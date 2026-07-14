[**@silajs/savm**](../README.md)

***

[@silajs/savm](../README.md) / validateEOF

# Function: validateEOF()

> **validateEOF**(`input`, `savm`, `containerMode`, `eofMode`): [`EOFContainer`](../classes/EOFContainer.md)

Defined in: [eof/container.ts:476](https://github.com/sila-chain/silajs-monorepo/blob/master/packages/savm/src/eof/container.ts#L476)

This method validates the EOF. It also performs deeper validation of the body, such as stack/opcode validation
This is ONLY necessary when trying to deploy contracts from a transaction: these can submit containers which are invalid
Since all deployed EOF containers are valid by definition, `validateEOF` does not need to be called each time an EOF contract is called

## Parameters

### input

`Uint8Array`

Full container buffer

### savm

[`SAVM`](../classes/SAVM.md)

SAVM, to read opcodes from

### containerMode

`ContainerSectionType` = `ContainerSectionType.RuntimeCode`

Container mode to validate on

### eofMode

`EOFContainerMode` = `EOFContainerMode.Default`

EOF mode to run in

## Returns

[`EOFContainer`](../classes/EOFContainer.md)

The decoded EOF container
