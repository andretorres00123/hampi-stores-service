import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Product } from 'domain/product'
import { ProductMapper } from '../../mappers/productMapper'
import { ProductsRepo } from '../productsRepo'

export class ProductsRepoImpl implements ProductsRepo {
  constructor(private dbClient: DocumentClient) {
    this.dbClient = dbClient
  }

  async createProduct(product: Product): Promise<void> {
    product.updateTimestamps()
    const rawProduct = ProductMapper.mapToPersistence(product)

    await this.dbClient
      .put({
        TableName: process.env.HAMPI_APP_TABLE || '',
        Item: rawProduct,
      })
      .promise()
  }
}
