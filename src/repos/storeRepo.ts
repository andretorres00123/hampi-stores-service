import { Store } from '../domain/store'
import { StoreRepoImpl } from './implementations/storeRepoImpl'
import { documentClient } from './utils'

export interface StoreRepo {
  createStore(store: Store): Promise<void>
  storeExists(workspace: string): Promise<boolean>
  getStoreByWorkspace(workspace: string): Promise<Store | null>
}

export const storeRepo = new StoreRepoImpl(documentClient)
