import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace EditStoreErrors {
  export class NotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'Store not found',
      } as UseCaseError)
    }
  }

  export class InvalidRequest extends Result<UseCaseError> {
    constructor(message: any) {
      super(false, {
        message,
      } as UseCaseError)
    }
  }
}
