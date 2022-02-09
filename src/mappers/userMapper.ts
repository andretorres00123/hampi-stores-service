import { User } from '../domain/user'
export interface RawUser {
  PK: string
  SK: string
  email: string
  displayName: string
  createdAt?: string
  updatedAt?: string
}

export class UserMapper {
  public static mapToPersistence(user: User): RawUser {
    const userId = user.id.toString()
    return {
      PK: `USER#${userId}`,
      SK: `USER#${userId}`,
      email: user.props.email,
      displayName: user.props.displayName,
      createdAt: user.props.createdAt?.toISOString(),
      updatedAt: user.props.updatedAt?.toISOString(),
    }
  }
}
