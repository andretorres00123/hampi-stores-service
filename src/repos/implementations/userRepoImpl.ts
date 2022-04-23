import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../../domain/user'
import { RawUser, UserMapper } from '../../mappers/userMapper'
import { UserRepo } from '../userRepo'

export class UserRepoImpl implements UserRepo {
  private dbClient: DocumentClient

  constructor(dbClient: DocumentClient) {
    this.dbClient = dbClient
  }

  async createUser(user: User): Promise<void> {
    user.updateTimestamps()
    const rawUser = UserMapper.mapToPersistence(user)
    await this.dbClient
      .put({
        TableName: process.env.HAMPI_APP_TABLE || '',
        Item: rawUser,
      })
      .promise()
  }

  async updateUser(user: User): Promise<void> {
    user.updateTimestamps()
    const rawUser = UserMapper.mapToPersistence(user)
    await this.dbClient
      .update({
        TableName: process.env.HAMPI_APP_TABLE || '',
        Key: {
          PK: rawUser.PK,
          SK: rawUser.SK,
        },
        UpdateExpression:
          'set phone = :phone, displayName = :displayName, preferredLanguage = :preferredLanguage, profilePicture = :profilePicture, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':phone': rawUser.phone,
          ':displayName': rawUser.displayName,
          ':preferredLanguage': rawUser.preferredLanguage,
          ':profilePicture': rawUser.profilePicture,
          ':updatedAt': rawUser.updatedAt,
        },
        ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
      })
      .promise()
  }

  async getUserById(userId: string): Promise<User | null> {
    const result = await this.dbClient
      .get({
        TableName: process.env.HAMPI_APP_TABLE || '',
        Key: {
          PK: `USER#${userId}`,
          SK: `USER#${userId}`,
        },
      })
      .promise()

    if (!result.Item) {
      return null
    }

    return UserMapper.mapToDomain(result.Item as RawUser)
  }
}
