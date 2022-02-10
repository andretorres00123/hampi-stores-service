import log from 'lambda-log'
import { Result } from './Result'
import { UseCaseError } from './UseCaseError'

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(error: unknown) {
      super(false, {
        message: 'An unexpected error occurred.',
        error,
      } as unknown as UseCaseError)
      log.error('[AppError]: An unexpected error occurred', { error })
    }
  }

  export class Unauthorized extends Result<UseCaseError> {
    public constructor() {
      super(false, {
        message: 'Unauthorized',
      } as UseCaseError)
    }
  }

  export class Forbidden extends Result<UseCaseError> {
    public constructor() {
      super(false, {
        message: 'Forbidden',
      } as UseCaseError)
    }
  }
}
