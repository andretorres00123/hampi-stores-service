import { Result } from '../../helpers/core/Result'
import { UseCaseError } from '../../helpers/core/UseCaseError'

export namespace GetStoreByWorkspaceErrors {
  export class StoreNotFoundError extends Result<UseCaseError> {
    constructor(workspace: string) {
      super(false, {
        message: `The "${workspace}" workspace does not exists`,
      } as UseCaseError)
    }
  }
}
