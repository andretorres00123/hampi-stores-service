import { AppError } from '../../helpers/core/AppError'
import { Result } from '../../helpers/core/Result'
import { StoreRepo } from '../../repos/storeRepo'
import { Either, left, right } from '../../helpers/core/Either'
import { CreateStoreDTO } from './createStoreDTO'
import { CreateStoreErrors } from './createStoreErrors'

export type CreateStoreResponse = Either<
  CreateStoreErrors.StoreAlreadyExistsError | AppError.UnexpectedError,
  Result<void>
>

export class CreateStore implements UseCase<CreateStoreDTO, CreateStoreResponse> {
  private storeRepo: StoreRepo

  constructor(storeRepo: StoreRepo) {
    this.storeRepo = storeRepo
  }

  async execute(request: CreateStoreDTO): Promise<CreateStoreResponse> {
    try {
      if (await this.storeRepo.storeExists(request.workspace)) {
        return left(new CreateStoreErrors.StoreAlreadyExistsError(request.workspace))
      }
      // TODO: Save store in Dynamo
      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
