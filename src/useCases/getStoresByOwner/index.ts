import { storeRepo } from '../../repos/storeRepo'
import { GetStoresByOwnerId } from './getStoresByOwnerId'
import { GetStoresByOwnerIdController } from './getStoresByOwnerIdController'

const getStoresByOwnerId = new GetStoresByOwnerId(storeRepo)
export const getStoresByOwnerIdController = new GetStoresByOwnerIdController(getStoresByOwnerId)
