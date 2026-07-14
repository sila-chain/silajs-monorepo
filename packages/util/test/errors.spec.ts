import { assert, describe, it } from 'vitest'

import { DEFAULT_ERROR_CODE, SilaJSError, SilaJSErrorWithoutCode } from '../src/errors.ts'

const TEST_ERROR_CODE = 'TEST_ERROR_CODE'
const TEST_MSG = 'test error message'

describe('SilaJSError', () => {
  it('should create an error with a code', () => {
    const error = new SilaJSError({ code: TEST_ERROR_CODE }, TEST_MSG)
    assert.strictEqual(error.type.code, TEST_ERROR_CODE)
    assert.strictEqual(error.message, TEST_MSG)
    const object = error.toObject()
    assert.strictEqual(object.type.code, TEST_ERROR_CODE)
    assert.strictEqual(object.message, TEST_MSG)
  })

  it('should create an error using the silajs error without code', () => {
    const error = SilaJSErrorWithoutCode(TEST_MSG)
    assert.strictEqual(error.type.code, DEFAULT_ERROR_CODE)
    assert.strictEqual(error.message, TEST_MSG)
    const object = error.toObject()
    assert.strictEqual(object.type.code, DEFAULT_ERROR_CODE)
    assert.strictEqual(object.message, TEST_MSG)
  })
})
