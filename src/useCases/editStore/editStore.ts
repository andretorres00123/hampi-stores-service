import { Result } from '../../helpers/core/Result'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { EditStoreDTO } from './editStoreDTO'
import { StoreRepo } from '../../repos/storeRepo'
import { EditStoreErrors } from './editStoreErrors'
import { Store } from '../../domain/store'
import { UniqueEntityID } from '../../domain/common/UniqueEntityID'
import { Category } from '../../domain/category'
import { getFileObject } from '../utils/utils'

export type EditStoreResponse = Either<
  EditStoreErrors.NotFound | EditStoreErrors.InvalidRequest | AppError.UnexpectedError,
  Result<void>
>

export class EditStore implements UseCase<EditStoreDTO, EditStoreResponse> {
  private storeRepo: StoreRepo

  constructor(storeRepo: StoreRepo) {
    this.storeRepo = storeRepo
  }

  async execute(request: EditStoreDTO): Promise<EditStoreResponse> {
    try {
      const store = await this.storeRepo.getStoreByIdAndOwner(request.storeId, request.ownerId)
      if (!store) {
        return left(new EditStoreErrors.NotFound())
      }

      const storeResult = Store.create(
        {
          ...store.props,
          ...request,
          profilePicture: getFileObject(request.profilePicture) ?? store.props.profilePicture,
          coverPicture: getFileObject(request.coverPicture) ?? store.props.coverPicture,
          ownerId: new UniqueEntityID(request.ownerId),
          categories: request.categories?.map((category) => Category.create({ name: category }).getValue()) || [],
        },
        store.id,
      )

      if (storeResult.isFailure) {
        return left(new EditStoreErrors.InvalidRequest(storeResult.errorValue()))
      }

      await this.storeRepo.updateStore(storeResult.getValue())

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
