import { Attribute } from '../domain/attribute'
import { Price } from '../domain/price'
import { UniqueEntityID } from '../domain/common/UniqueEntityID'
import { Product, ProductProps } from '../domain/product'
import { PaymentOption, PaymentOptionsEnum } from '../domain/paymentOption'
import { Package } from '../domain/package'

export const buildProductFixture = (props?: ProductProps, id?: string): Product => {
  const productProps: ProductProps = {
    storeId: '79280902-7b77-414f-bd39-f1c61275e170',
    name: 'IPhone 13',
    description: "Apple's phone",
    dimensions: null,
    discounts: [],
    images: [],
    package: Package.create({ unit: 'cellphone', value: 1 }).getValue(),
    price: Price.create({ currency: 'USD', value: 130000 }).getValue(),
    stock: 100,
    sku: null,
    attributes: [Attribute.create({ key: 'color', text: 'Color', values: ['green', 'red', 'black'] }).getValue()],
    paymentOptions: [PaymentOption.create({ value: PaymentOptionsEnum.SUPPLIER_ARRANGEMENT }).getValue()],
    createdAt: new Date('2022-06-25T15:27:48.922Z'),
    updatedAt: new Date('2022-06-25T15:27:48.922Z'),
    ...props,
  }

  const result = Product.create(productProps, new UniqueEntityID(id))
  return result.getValue()
}
