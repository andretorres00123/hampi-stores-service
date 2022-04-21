import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace FileUploadedErrors {
  export class NotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'File not found',
      } as UseCaseError)
    }
  }
}
