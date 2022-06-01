import { AppError } from '../../helpers/core/AppError'
import { Result } from '../../helpers/core/Result'
import { StoreRepo } from '../../repos/storeRepo'
import { Either, left, right } from '../../helpers/core/Either'
import { CreateStoreDTO } from './createStoreDTO'
import { CreateStoreErrors } from './createStoreErrors'
import { Store } from '../../domain/store'
import { UniqueEntityID } from '../../domain/common/UniqueEntityID'
import { Category } from '../../domain/category'
import { getFileObject } from '../utils/utils'

export type CreateStoreResponse = Either<
  CreateStoreErrors.StoreAlreadyExistsError | CreateStoreErrors.InvalidRequest | AppError.UnexpectedError,
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

      const categories = (request.categories || []).map((category) => Category.create({ name: category }).getValue())
      const storeResult = Store.create({
        ...request,
        categories,
        profilePicture: getFileObject(request.profilePicture),
        coverPicture: getFileObject(request.coverPicture),
        ownerId: new UniqueEntityID(request.ownerId),
      })

      if (storeResult.isFailure) {
        return left(new CreateStoreErrors.InvalidRequest(storeResult.errorValue()))
      }

      const store = storeResult.getValue()

      await this.storeRepo.createStore(store)

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
