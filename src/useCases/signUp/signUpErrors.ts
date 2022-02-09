import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace SignUpErrors {
  export class InputError extends Result<UseCaseError> {
    constructor(error: unknown) {
      super(false, {
        message: error,
      } as UseCaseError)
    }
  }
}
