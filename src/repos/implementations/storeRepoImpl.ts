import { DocumentClient } from 'aws-sdk/clients/dynamodb'
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
        FilterExpression: '#active = :value',
        ExpressionAttributeValues: {
          ':workspace': workspace,
          ':value': true,
        },
        ExpressionAttributeNames: {
          '#active': 'active',
        },
      })
      .promise()

    if (!Items || !Items[0]) {
      // If there is no result, the workspace is unique
      return false
    }

    return true
  }
}
