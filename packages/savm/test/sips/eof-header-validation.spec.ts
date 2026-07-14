import path from 'path'
import { hexToBytes } from '@silajs/util'
import * as dir from 'node-dir'
import { assert, describe, it } from 'vitest'

import { EOFContainerMode, validateEOF } from '../../src/eof/container.ts'
import { ContainerSectionType } from '../../src/eof/verify.ts'
import { createEVM } from '../../src/index.ts'

import { getCommon } from './eof-utils.ts'

// Rename this test dir to the location of EOF header tests
// To test, use `npx vitest run ./scripts/eof-header-validation.spec.ts
const testDir = path.resolve('../sila-tests/EOFTests')

async function getEVM() {
  const common = getCommon()
  const savm = createEVM({
    common,
  })
  return savm
}

await new Promise<void>((resolve, reject) => {
  const finishedCallback = (err: Error | undefined) => {
    if (err) {
      reject(err)
      return
    }
    resolve()
  }
  const fileCallback = async (
    err: Error | undefined,
    content: string | Uint8Array,
    fileName: string,
    next: Function,
  ) => {
    if (err) {
      reject(err)
      return
    }
    const name = path.parse(fileName).name
    describe(`EOF Header validation tests - ${name}`, async () => {
      const testData = JSON.parse(content as string)
      const savm = await getEVM()
      for (const key in testData) {
        it(`Test ${key}`, () => {
          const input = testData[key as keyof typeof testData]
          for (const testKey in input.vectors) {
            const test = input.vectors[testKey]

            const code = hexToBytes(test.code)

            const expected = test.results.SilaOsaka.result
            const _exception = test.results.SilaOsaka.exception

            let containerSectionType: ContainerSectionType = ContainerSectionType.RuntimeCode
            let eofContainerMode: EOFContainerMode = EOFContainerMode.Default

            if (test.containerKind !== undefined) {
              if (test.containerKind === 'INITCODE') {
                containerSectionType = ContainerSectionType.InitCode
                eofContainerMode = EOFContainerMode.Initmode
              } else {
                throw new Error('unknown container kind: ' + test.containerKind)
              }
            }

            if (expected === true) {
              validateEOF(code, savm, containerSectionType, eofContainerMode)
            } else {
              assert.throws(() => {
                // TODO verify that the correct error is thrown
                validateEOF(code, savm, containerSectionType, eofContainerMode)
              })
            }
          }
        })
      }
    })

    next()
  }
  dir.readFiles(
    testDir,
    {
      match: /.json$/,
    },
    fileCallback,
    finishedCallback,
  )
})
