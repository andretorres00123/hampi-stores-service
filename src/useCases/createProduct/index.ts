import { productsRepo } from '../../repos/productsRepo'
import { storeRepo } from '../../repos/storeRepo'
import { CreateProduct } from './createProduct'
import { CreateProductController } from './createProductController'

const createProductUseCase = new CreateProduct(productsRepo, storeRepo)
export const createProductController = new CreateProductController(createProductUseCase)
