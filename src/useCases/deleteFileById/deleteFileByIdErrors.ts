import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace DeleteFileByIdErrors {
  export class NotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'File not found',
      } as UseCaseError)
    }
  }
}
