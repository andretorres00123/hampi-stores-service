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
  attributes?: null | Attribute
  paymentOptions: PaymentOption[]
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id)
  }
}
