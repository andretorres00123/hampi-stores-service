import { Product } from '../domain/product'
import { ProductsRepoImpl } from './implementations/productsRepoImpl'
import { documentClient } from './utils'

export interface ProductsRepo {
  createProduct(product: Product): Promise<void>
}

export const productsRepo = new ProductsRepoImpl(documentClient)
