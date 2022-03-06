import { Category } from '../domain/category'
import { UniqueEntityID } from '../domain/common/UniqueEntityID'
import { Store } from '../domain/store'

export interface RawStore {
  PK: string
  SK: string
  GSI1PK: string
  GSI1SK: string
  workspace: string
  country: string
  city: string
  state: string
  ownerId: string
  categories: string[]
  displayName?: string
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

export interface StoreDTO {
  id: string
  workspace: string
  country: string
  city: string
  state: string
  ownerId: string
  categories: string[]
  displayName?: string
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
      state: store.props.state,
      categories: store.props.categories.map((category) => category.name),
      ownerId: store.props.ownerId.toString(),
      createdAt: store.props.createdAt?.toISOString(),
      updatedAt: store.props.updatedAt?.toISOString(),
    }
  }

  public static mapToDomain(rawData: RawStore): Store {
    const storeResult = Store.create(
      {
        ...rawData,
        ownerId: new UniqueEntityID(rawData.ownerId),
        categories: rawData.categories.map((category) => Category.create({ name: category }).getValue()),
        createdAt: rawData.createdAt ? new Date(rawData.createdAt) : undefined,
        updatedAt: rawData.updatedAt ? new Date(rawData.updatedAt) : undefined,
      },
      new UniqueEntityID(rawData.SK.replace('STORE#', '')),
    )

    if (storeResult.isFailure) {
      throw Error(`Error in Store Mapper: ${storeResult.errorValue()}`)
    }

    return storeResult.getValue()
  }

  public static mapToDTO(store: Store): StoreDTO {
    return {
      ...store.props,
      id: store.id.toString(),
      ownerId: store.id.toString(),
      categories: store.props.categories.map(({ name }) => name),
      createdAt: store.props.createdAt?.toISOString(),
      updatedAt: store.props.updatedAt?.toISOString(),
    }
  }
}
