import { UniqueEntityID } from '../../domain/common/UniqueEntityID'
import { User } from '../../domain/user'
import { AppError } from '../../helpers/core/AppError'
import { Either, left, right } from '../../helpers/core/Either'
import { Result } from '../../helpers/core/Result'
import { UserRepo } from '../../repos/userRepo'
import { SignUpDTO } from './signUpDTO'
import { SignUpErrors } from './signUpErrors'

export type SignUpResponse = Either<SignUpErrors.InputError | AppError.UnexpectedError, Result<void>>

export class SignUp implements UseCase<SignUpDTO, SignUpResponse> {
  private userRepo: UserRepo

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo
  }

  async execute(request: SignUpDTO): Promise<SignUpResponse> {
    try {
      const userResult = User.create({
        email: request.email,
        displayName: request.displayName,
      }, new UniqueEntityID(request.userId))

      if (userResult.isFailure) {
        return left(new SignUpErrors.InputError(userResult.errorValue()))
      }

      const user = userResult.getValue()
      await this.userRepo.createUser(user)

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
