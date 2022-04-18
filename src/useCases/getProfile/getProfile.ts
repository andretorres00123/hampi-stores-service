import { User } from '../../domain/user'
import { AppError } from '../../helpers/core/AppError'
import { Result } from '../../helpers/core/Result'
import { Either, left, right } from '../../helpers/core/Either'
import { GetProfileDTO } from './getProfileDTO'
import { UserRepo } from '../../repos/userRepo'
import { GetProfileErrors } from './getProfileErrors'

export type GetProfileResponse = Either<GetProfileErrors.NotFound | AppError.UnexpectedError, Result<User>>

export class GetProfile implements UseCase<GetProfileDTO, GetProfileResponse> {
  private userRepo: UserRepo

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo
  }

  async execute(request: GetProfileDTO): Promise<GetProfileResponse> {
    try {
      const user = await this.userRepo.getUserById(request.userId)

      if (!user) {
        return left(new GetProfileErrors.NotFound())
      }

      return right(Result.ok(user))
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
