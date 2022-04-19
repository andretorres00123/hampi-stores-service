import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { Entity } from './common/Entity'
import { UniqueEntityID } from './common/UniqueEntityID'
import { File } from './file'

export type PREFERED_LANGUAGES = 'ES' | 'EN'

export interface UserProps {
  email: string
  displayName?: string
  phone?: string
  preferredLanguage?: PREFERED_LANGUAGES
  isEmailVerified?: boolean
  pictureUrl?: File
  createdAt?: Date
  updatedAt?: Date
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get id(): UniqueEntityID {
    return this._id
  }

  public updateTimestamps(): void {
    const now = new Date()
    if (!this.props.createdAt) {
      this.props.createdAt = now
    }
    this.props.updatedAt = now
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardArgs: IGuardArgument[] = [{ argument: props.email, argumentName: 'email' }]

    let guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)
    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(guardArgs)
    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message as string)
    }

    if (props.preferredLanguage && props.preferredLanguage !== 'EN' && props.preferredLanguage !== 'ES') {
      return Result.fail<User>('Invalid preferred language')
    }

    return Result.ok<User>(new User(props, id))
  }
}
