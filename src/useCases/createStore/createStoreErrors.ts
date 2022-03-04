import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace CreateStoreErrors {
  export class StoreAlreadyExistsError extends Result<UseCaseError> {
    constructor(workspace: string) {
      super(false, {
        message: `The ${workspace} workspace already exists`,
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
