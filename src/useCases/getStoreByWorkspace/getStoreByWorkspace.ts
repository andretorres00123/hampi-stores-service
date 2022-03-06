import { Store } from '../../domain/store'
import { AppError } from '../../helpers/core/AppError'
import { Result } from '../../helpers/core/Result'
import { Either, left, right } from '../../helpers/core/Either'
import { GetStoreByWorkspaceDTO } from './getStoreByWorkspaceDTO'
import { StoreRepo } from '../../repos/storeRepo'
import { GetStoreByWorkspaceErrors } from './getStoreByWorkspaceErrors'

export type GetStoreByWorkspaceResponse = Either<
  GetStoreByWorkspaceErrors.StoreNotFoundError | AppError.UnexpectedError,
  Result<Store>
>

export class GetStoreByWorkspace implements UseCase<GetStoreByWorkspaceDTO, GetStoreByWorkspaceResponse> {
  private storeRepo: StoreRepo

  constructor(storeRepo: StoreRepo) {
    this.storeRepo = storeRepo
  }

  async execute(request: GetStoreByWorkspaceDTO): Promise<GetStoreByWorkspaceResponse> {
    try {
      const storeResult = await this.storeRepo.getStoreByWorkspace(request.workspace)
      if (!storeResult) {
        return left(new GetStoreByWorkspaceErrors.StoreNotFoundError(request.workspace))
      }

      return right(Result.ok(storeResult))
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
