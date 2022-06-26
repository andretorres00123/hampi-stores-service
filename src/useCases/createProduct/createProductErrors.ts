import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace CreateProductErrors {
  export class BadInputError extends Result<UseCaseError> {
    constructor(message: any) {
      super(false, {
        message,
      } as UseCaseError)
    }
  }
}
