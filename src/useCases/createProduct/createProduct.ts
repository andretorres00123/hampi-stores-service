import { AppError } from '../../helpers/core/AppError'
import { ProductsRepo } from '../../repos/productsRepo'
import { Either, left, right } from '../../helpers/core/Either'
import { Result } from '../../helpers/core/Result'
import { CreateProductDTO } from './createProductDTO'
import { StoreRepo } from '../../repos/storeRepo'
import { FileObject } from '../../domain/fileObject'
import { CreateProductErrors } from './createProductErrors'
import { Product, ProductProps } from '../../domain/product'
import { Package } from '../../domain/package'
import { Price } from '../../domain/price'
import { Attribute } from '../../domain/attribute'
import { PaymentOption } from '../../domain/paymentOption'

export type CreateProductResponse = Either<
  CreateProductErrors.BadInputError | AppError.Forbidden | AppError.UnexpectedError,
  Result<void>
>

export class CreateProduct implements UseCase<CreateProductDTO, CreateProductResponse> {
  constructor(private productsRepo: ProductsRepo, private storesRepo: StoreRepo) {}

  async execute(request: CreateProductDTO): Promise<CreateProductResponse> {
    try {
      const store = await this.storesRepo.getStoreByIdAndOwner(request.storeId, request.userId)
      if (!store) {
        return left(new AppError.Forbidden())
      }

      // Processing images
      const imagesResults = request.images.map((image) => FileObject.create(image))
      if (imagesResults.some((result) => result.isFailure)) {
        const error = imagesResults.find((result) => result.isFailure)
        return left(new CreateProductErrors.BadInputError(error?.errorValue()))
      }
      const images = imagesResults.map((result) => result.getValue())

      // Processing package
      let packageInstance = null
      if (request.package) {
        const packageResult = Package.create(request.package)
        if (packageResult.isFailure) {
          return left(new CreateProductErrors.BadInputError(packageResult.errorValue()))
        }
        packageInstance = packageResult.getValue()
      }

      // Processing Price
      const priceResult = Price.create(request.price)
      if (priceResult.isFailure) {
        return left(new CreateProductErrors.BadInputError(priceResult.errorValue()))
      }
      const price = priceResult.getValue()

      // Processing Attributes
      let attributes = null
      if (request.attributes) {
        const attributeResults = request.attributes.map((attr) => Attribute.create(attr))
        if (attributeResults.some((result) => result.isFailure)) {
          const error = attributeResults.find((result) => result.isFailure)
          return left(new CreateProductErrors.BadInputError(error?.errorValue()))
        }
        attributes = attributeResults.map((result) => result.getValue())
      }

      // Processing PaymentOptions
      const paymentOptionsResults = request.paymentOptions.map((props) => PaymentOption.create(props))
      if (paymentOptionsResults.some((result) => result.isFailure)) {
        const error = paymentOptionsResults.find((result) => result.isFailure)
        return left(new CreateProductErrors.BadInputError(error?.errorValue()))
      }
      const paymentOptions = paymentOptionsResults.map((result) => result.getValue())

      // Processing Product
      const productResult = Product.create({
        ...request,
        package: packageInstance,
        images,
        price,
        attributes,
        paymentOptions,
      })
      if (productResult.isFailure) {
        return left(new CreateProductErrors.BadInputError(productResult.errorValue()))
      }

      // Saving Product
      const product = productResult.getValue()
      await this.productsRepo.createProduct(product)

      return right(Result.ok())
    } catch (error) {
      return left(new AppError.UnexpectedError(error))
    }
  }
}
