import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace UpdateProfileErrors {
  export class NotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'User not found',
      } as UseCaseError)
    }
  }

  export class InvalidProperty extends Result<UseCaseError> {
    constructor(error: unknown) {
      super(false, {
        message: error,
      } as UseCaseError)
    }
  }
}
