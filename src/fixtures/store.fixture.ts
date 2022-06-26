import { UniqueEntityID } from '../domain/common/UniqueEntityID'
import { Store, StoreProps } from '../domain/store'

export const buildStoreFixture = (props?: StoreProps, id?: string): Store => {
  const storeProps: StoreProps = {
    workspace: 'pepitos',
    country: 'EC',
    city: 'Quito',
    state: 'Pichincha',
    ownerId: new UniqueEntityID(),
    categories: [],
    displayName: "Pepito's",
    createdAt: new Date('2022-06-25T15:27:48.922Z'),
    updatedAt: new Date('2022-06-25T15:27:48.922Z'),
    ...props,
  }

  return Store.create(storeProps, new UniqueEntityID('79280902-7b77-414f-bd39-f1c61275e170' || id)).getValue()
}
