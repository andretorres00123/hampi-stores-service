import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace GetFileByIdErrors {
  export class NotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Not found`,
      } as UseCaseError)
    }
  }
}
