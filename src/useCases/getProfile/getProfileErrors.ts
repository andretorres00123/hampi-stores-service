import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace GetProfileErrors {
  export class NotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'User not found',
      } as UseCaseError)
    }
  }
}
