import { Store } from '../../domain/store'
import { AppError } from '../../helpers/core/AppError'
import { Result } from '../../helpers/core/Result'
import { Either, left, right } from '../../helpers/core/Either'
import { GetStoresByOwnerIdDTO } from './getStoresByOwnerIdDTO'
import { StoreRepo } from '../../repos/storeRepo'

export type GetStoresByOwnerIdResponse = Either<AppError.UnexpectedError, Result<Store[]>>

export class GetStoresByOwnerId implements UseCase<GetStoresByOwnerIdDTO, GetStoresByOwnerIdResponse> {
  private storeRepo: StoreRepo

  constructor(storeRepo: StoreRepo) {
    this.storeRepo = storeRepo
  }

  async execute(request: GetStoresByOwnerIdDTO): Promise<GetStoresByOwnerIdResponse> {
    try {
      const stores = await this.storeRepo.getStoresByOwnerId(request.ownerId)
      return right(Result.ok(stores))
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
