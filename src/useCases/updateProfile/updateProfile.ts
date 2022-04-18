import { UserRepo } from '../../repos/userRepo'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { Result } from '../../helpers/core/Result'
import { UpdateProfileDTO } from './updateProfileDTO'
import { UpdateProfileErrors } from './updateProfileErrors'
import { User } from '../../domain/user'

export type UpdateProfileResponse = Either<
  UpdateProfileErrors.NotFound | UpdateProfileErrors.InvalidProperty | AppError.UnexpectedError,
  Result<void>
>

export class UpdateProfile implements UseCase<UpdateProfileDTO, UpdateProfileResponse> {
  private userRepo: UserRepo

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo
  }

  async execute(request: UpdateProfileDTO): Promise<UpdateProfileResponse> {
    try {
      const user = await this.userRepo.getUserById(request.userId)

      if (!user) {
        return left(new UpdateProfileErrors.NotFound())
      }

      // TODO handle pictureUrl
      const newUserResult = User.create({ ...user.props, ...request, pictureUrl: undefined }, user.id)
      if (newUserResult.isFailure) {
        return left(new UpdateProfileErrors.InvalidProperty(newUserResult.errorValue()))
      }

      const newUser = newUserResult.getValue()
      await this.userRepo.updateUser(newUser)

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
