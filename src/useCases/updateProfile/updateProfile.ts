import { UserRepo } from '../../repos/userRepo'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { Result } from '../../helpers/core/Result'
import { UpdateProfileDTO } from './updateProfileDTO'
import { UpdateProfileErrors } from './updateProfileErrors'
import { User, UserProps } from '../../domain/user'
import { FileObject } from '../../domain/fileObject'

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

      const newUserProps: UserProps = { ...user.props, ...request, profilePicture: undefined }

      if (request.profilePicture) {
        const fileObjectResult = FileObject.create(request.profilePicture)
        if (fileObjectResult.isFailure) {
          return left(new UpdateProfileErrors.InvalidProperty(fileObjectResult.errorValue()))
        }
        newUserProps.profilePicture = fileObjectResult.getValue()
      }

      const newUserResult = User.create(newUserProps, user.id)
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
