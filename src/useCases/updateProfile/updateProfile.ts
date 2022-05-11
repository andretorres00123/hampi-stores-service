import { UserRepo } from '../../repos/userRepo'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { Result } from '../../helpers/core/Result'
import { UpdateProfileDTO } from './updateProfileDTO'
import { UpdateProfileErrors } from './updateProfileErrors'
import { User, UserProps } from '../../domain/user'
import { FileObject } from '../../domain/fileObject'
import { FileRepo } from '../../repos/fileRepo'
import { BucketService } from '../../services/bucketService'

export type UpdateProfileResponse = Either<
  UpdateProfileErrors.NotFound | UpdateProfileErrors.InvalidProperty | AppError.UnexpectedError,
  Result<void>
>

export class UpdateProfile implements UseCase<UpdateProfileDTO, UpdateProfileResponse> {
  private userRepo: UserRepo
  private fileRepo: FileRepo
  private bucketService: BucketService

  constructor(userRepo: UserRepo, fileRepo: FileRepo, bucketService: BucketService) {
    this.userRepo = userRepo
    this.fileRepo = fileRepo
    this.bucketService = bucketService
  }

  async execute(request: UpdateProfileDTO): Promise<UpdateProfileResponse> {
    try {
      const user = await this.userRepo.getUserById(request.userId)

      if (!user) {
        return left(new UpdateProfileErrors.NotFound())
      }

      const newUserProps = { ...user.props, ...request } as UserProps

      if (request.profilePicture) {
        const fileObjectResult = FileObject.create(request.profilePicture)
        if (fileObjectResult.isFailure) {
          return left(new UpdateProfileErrors.InvalidProperty(fileObjectResult.errorValue()))
        }
        newUserProps.profilePicture = fileObjectResult.getValue()

        if (user.profilePicture && request.profilePicture.id !== user.profilePicture.props.id) {
          await this.fileRepo.deleteFile(user.profilePicture.props.id)
          const { pathname } = new URL(user.profilePicture.props.publicUrl)
          await this.bucketService.deleteObject(pathname.substring(1))
        }
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
