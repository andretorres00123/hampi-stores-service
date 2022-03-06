import { storeRepo } from '../../repos/storeRepo'
import { GetStoreByWorkspace } from './getStoreByWorkspace'
import { GetStoreByWorkspaceController } from './getStoreByWorkspaceController'

const getStoreByWorkspaceUseCase = new GetStoreByWorkspace(storeRepo)
export const getStoreByWorkspaceController = new GetStoreByWorkspaceController(getStoreByWorkspaceUseCase)
