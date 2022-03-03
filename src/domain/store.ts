import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { Category } from './category'
import { Entity } from './common/Entity'
import { UniqueEntityID } from './common/UniqueEntityID'

export interface StoreProps {
  workspace: string
  country: string
  city: string
  ownerId: UniqueEntityID
  categories: Category[]
  displayName?: string
  profileUrl?: string
  coverUrl?: string
  whatsappUrl?: string
  locationUrl?: string
  locationAddress?: string
  description?: string
  phone?: string
  createdAt?: Date
  updatedAt?: Date
}

export class Store extends Entity<StoreProps> {
  private constructor(props: StoreProps, id?: UniqueEntityID) {
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

  public static create(props: StoreProps, id?: UniqueEntityID): Result<Store> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.workspace, argumentName: 'workspace' },
      { argument: props.country, argumentName: 'country' },
      { argument: props.city, argumentName: 'city' },
      { argument: props.categories, argumentName: 'categories' },
      { argument: props.ownerId, argumentName: 'owner' },
    ]

    let guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)
    if (!guardResult.succeeded) {
      return Result.fail<Store>(guardResult.message as string)
    }

    const stringArgs: IGuardArgument[] = [
      { argument: props.workspace, argumentName: 'workspace' },
      { argument: props.country, argumentName: 'country' },
      { argument: props.city, argumentName: 'city' },
    ]

    guardResult = Guard.againstEmptyStringBulk(stringArgs)
    if (!guardResult.succeeded) {
      return Result.fail<Store>(guardResult.message as string)
    }

    return Result.ok<Store>(new Store(props, id))
  }
}
