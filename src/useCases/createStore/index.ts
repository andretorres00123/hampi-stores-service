import { storeRepo } from '../../repos/storeRepo'
import { CreateStore } from './createStore'
import { CreateStoreController } from './createStoreController'

const createStoreUseCase = new CreateStore(storeRepo)
export const createStoreController = new CreateStoreController(createStoreUseCase)
