import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { Attribute } from './attribute'
import { Entity } from './common/Entity'
import { UniqueEntityID } from './common/UniqueEntityID'
import { FileObject } from './fileObject'
import { Package } from './package'
import { PaymentOption } from './paymentOption'
import { Price } from './price'

export interface ProductProps {
  storeId: string
  name: string
  description: string
  dimensions?: null | string
  discounts: string[]
  images: FileObject[]
  package?: null | Package
  price: Price
  stock?: null | number
  sku?: string | null // store's unique code
  attributes?: null | Attribute[]
  paymentOptions: PaymentOption[]
  createdAt?: Date
  updatedAt?: Date
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: UniqueEntityID) {
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

  public static create(props: ProductProps, id?: UniqueEntityID): Result<Product> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.storeId, argumentName: 'storeId' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.images, argumentName: 'images' },
      { argument: props.paymentOptions, argumentName: 'paymentOptions' },
    ]

    let guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)
    if (!guardResult.succeeded) {
      return Result.fail<Product>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyStringBulk(guardArgs)
    if (!guardResult.succeeded) {
      return Result.fail<Product>(guardResult.message as string)
    }

    return Result.ok<Product>(new Product(props, id))
  }
}
