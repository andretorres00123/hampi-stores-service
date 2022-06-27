import { Product } from '../domain/product'
import { FileObjectMapper } from './fileObjectMapper'

export class ProductMapper {
  static mapToPersistence(product: Product): RawProduct {
    const productId = product.id.toString()

    return {
      PK: `STORE#${product.props.storeId}`,
      SK: `PRODUCT#${productId}`,
      storeId: product.props.storeId,
      name: product.props.name,
      description: product.props.description,
      dimensions: product.props.dimensions,
      discounts: product.props.discounts,
      images:
        (product.props.images
          .map(FileObjectMapper.mapToPersistence)
          .filter((image) => image?.id) as FileObjectPersistence[]) || [],
      package: product.props.package?.props || null,
      price: product.props.price.props,
      stock: Number.isInteger(product.props.stock) ? product.props.stock : null,
      sku: product.props.sku || null,
      attributes: product.props.attributes ? product.props.attributes.map((attri) => attri.props) : null,
      paymentOptions: product.props.paymentOptions.map((payment) => payment.props),
      createdAt: product.props.createdAt?.toISOString(),
      updatedAt: product.props.updatedAt?.toISOString(),
    }
  }
}
