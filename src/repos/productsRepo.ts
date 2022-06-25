import { Product } from '../domain/product'

export interface ProductsRepo {
  createProduct(product: Product): Promise<void>
}
