import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../../domain/user'
import { UserMapper } from '../../mappers/userMapper'
import { UserRepo } from '../userRepo'

export class UserRepoImpl implements UserRepo {
  private dbClient: DocumentClient

  constructor(dbClient: DocumentClient) {
    this.dbClient = dbClient
  }

  async createUser(user: User): Promise<void> {
    user.updateTimestamps()
    const rawUser = UserMapper.mapToPersistence(user)
    await this.dbClient.put({
      TableName: process.env.HAMPI_APP_TABLE || '',
      Item: rawUser,
    })
  }
}
