import { Store } from '../domain/store'

export interface RawStore {
  PK: string
  SK: string
  GSI1PK: string
  GSI1SK: string
  workspace: string
  country: string
  city: string
  ownerId: string
  categories: string[]
  isplayName?: string
  profileUrl?: string
  coverUrl?: string
  whatsappUrl?: string
  locationUrl?: string
  locationAddress?: string
  description?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

export class StoreMapper {
  public static mapToPersistence(store: Store): RawStore {
    return {
      ...store.props,
      PK: `USER#${store.props.ownerId.toString()}`,
      SK: `STORE#${store.id.toString()}`,
      GSI1PK: `STORE#${store.props.workspace}`,
      GSI1SK: `STORE#${store.props.workspace}`,
      workspace: store.props.workspace,
      country: store.props.country,
      city: store.props.city,
      categories: store.props.categories.map((category) => category.name),
      ownerId: store.props.ownerId.toString(),
      createdAt: store.props.createdAt?.toISOString(),
      updatedAt: store.props.updatedAt?.toISOString(),
    }
  }
}
