import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Store } from '../../domain/store'
import { RawStore, StoreMapper } from '../../mappers/storeMapper'
import { StoreRepo } from '../storeRepo'

export class StoreRepoImpl implements StoreRepo {
  private dbClient: DocumentClient

  constructor(dbClient: DocumentClient) {
    this.dbClient = dbClient
  }

  async storeExists(workspace: string): Promise<boolean> {
    const { Items } = await this.dbClient
      .query({
        TableName: process.env.HAMPI_APP_TABLE || '',
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :workspace AND GSI1SK = :workspace',
        ExpressionAttributeValues: {
          ':workspace': `STORE#${workspace}`,
        },
      })
      .promise()

    if (!Items || !Items[0]) {
      // If there is no result, the workspace is unique
      return false
    }

    return true
  }

  async getStoreByWorkspace(workspace: string): Promise<Store | null> {
    const { Items } = await this.dbClient
      .query({
        TableName: process.env.HAMPI_APP_TABLE || '',
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :workspace AND GSI1SK = :workspace',
        ExpressionAttributeValues: {
          ':workspace': `STORE#${workspace}`,
        },
      })
      .promise()

    if (!Items || !Items[0]) {
      return null
    }

    return StoreMapper.mapToDomain(Items[0] as RawStore)
  }

  async getStoreByIdAndOwner(id: string, ownerId: string): Promise<Store | null> {
    const { Items } = await this.dbClient
      .query({
        TableName: process.env.HAMPI_APP_TABLE || '',
        KeyConditionExpression: 'PK = :pk AND SK = :sk',
        ExpressionAttributeValues: {
          ':sk': `STORE#${id}`,
          ':pk': `USER#${ownerId}`,
        },
      })
      .promise()

    if (!Items || !Items[0]) {
      return null
    }

    return StoreMapper.mapToDomain(Items[0] as RawStore)
  }

  async createStore(store: Store): Promise<void> {
    store.updateTimestamps()
    const rawStore = StoreMapper.mapToPersistence(store)
    await this.dbClient
      .put({
        TableName: process.env.HAMPI_APP_TABLE || '',
        Item: rawStore,
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      })
      .promise()
  }

  async updateStore(store: Store): Promise<void> {
    store.updateTimestamps()
    const rawStore = StoreMapper.mapToPersistence(store)

    await this.dbClient
      .update({
        TableName: process.env.HAMPI_APP_TABLE || '',
        Key: {
          PK: rawStore.PK,
          SK: rawStore.SK,
        },
        UpdateExpression:
          'set displayName = :displayName, city = :city, #state = :state, profilePicture = :profilePicture, phone = :phone, whatsappUrl = :whatsappUrl, locationAddress = :locationAddress, locationUrl = :locationUrl, description = :description, coverPicture = :coverPicture, categories = :categories, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':displayName': rawStore.displayName || '',
          ':city': rawStore.city,
          ':state': rawStore.state,
          ':profilePicture': rawStore.profilePicture || null,
          ':phone': rawStore.phone || null,
          ':whatsappUrl': rawStore.whatsappUrl || null,
          ':locationAddress': rawStore.locationAddress || null,
          ':locationUrl': rawStore.locationUrl || null,
          ':description': rawStore.description || null,
          ':coverPicture': rawStore.coverPicture || null,
          ':categories': rawStore.categories,
          ':updatedAt': rawStore.updatedAt,
        },
        ExpressionAttributeNames: {
          '#state': 'state',
        },
        ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
      })
      .promise()
  }

  async getStoresByOwnerId(ownerId: string): Promise<Store[]> {
    const { Items } = await this.dbClient
      .query({
        TableName: process.env.HAMPI_APP_TABLE || '',
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `USER#${ownerId}`,
        },
      })
      .promise()

    if (!Items || !Items[0]) {
      return []
    }
    // Necessary because the last element is the user itself (because single table design)
    Items.pop()

    return Items.map((item) => StoreMapper.mapToDomain(item as RawStore))
  }
}
