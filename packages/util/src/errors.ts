import {
  DEFAULT_ERROR_CODE,
  SilaJSError,
  type SilaJSErrorMetaData,
  type SilaJSErrorObject,
  SilaJSErrorWithoutCode,
} from '@silajs/rlp'

export {
  DEFAULT_ERROR_CODE,
  SilaJSError,
  SilaJSErrorWithoutCode,
  type SilaJSErrorMetaData,
  type SilaJSErrorObject,
}

// Below here: specific monorepo-wide errors (examples and commented out)

/*export enum UsageErrorType {
  UNSUPPORTED_FEATURE = 'unsupported feature',
}*

/**
 * Error along API Usage
 *
 * Use directly or in a subclassed context for error comparison (`e instanceof UsageError`)
 */
//export class UsageError extends SilaJSError<{ code: UsageErrorType }> {}
