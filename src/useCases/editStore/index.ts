import { storeRepo } from '../../repos/storeRepo'
import { EditStore } from './editStore'
import { EditStoreController } from './editStoreController'

const editStoreUseCase = new EditStore(storeRepo)
export const editStoreController = new EditStoreController(editStoreUseCase)
