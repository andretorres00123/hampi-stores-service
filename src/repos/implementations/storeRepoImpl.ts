import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Store } from '../../domain/store'
import { StoreMapper } from '../../mappers/storeMapper'
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
          ':workspace': workspace,
        },
      })
      .promise()

    if (!Items || !Items[0]) {
      // If there is no result, the workspace is unique
      return false
    }

    return true
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
}
