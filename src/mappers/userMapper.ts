import { UniqueEntityID } from '../domain/common/UniqueEntityID'
import { PREFERED_LANGUAGES, User } from '../domain/user'
import { FileObjectMapper } from './fileObjectMapper'

export interface RawUser {
  PK: string
  SK: string
  email: string
  displayName?: string | null
  phone?: string | null
  preferredLanguage?: PREFERED_LANGUAGES
  profilePicture?: FileObjectDTO | null
  createdAt?: string
  updatedAt?: string
}

export interface UserDTO {
  id: string
  email: string
  displayName?: string | null
  phone?: string | null
  preferredLanguage?: PREFERED_LANGUAGES
  profilePicture: FileObjectDTO | null
  createdAt: string
  updatedAt: string
}

export class UserMapper {
  public static mapToPersistence(user: User): RawUser {
    const userId = user.id.toString()
    return {
      PK: `USER#${userId}`,
      SK: `USER#${userId}`,
      email: user.props.email,
      displayName: user.props.displayName || null,
      phone: user.props.phone || null,
      preferredLanguage: user.props.preferredLanguage || 'EN',
      profilePicture: FileObjectMapper.mapToPersistence(user.profilePicture),
      createdAt: user.props.createdAt?.toISOString(),
      updatedAt: user.props.updatedAt?.toISOString(),
    }
  }

  public static mapToDomain(rawUser: RawUser): User {
    const userId = rawUser.PK.replace('USER#', '')
    // TODO handle pictureUrl
    const userResult = User.create(
      {
        ...rawUser,
        displayName: rawUser.displayName || '',
        phone: rawUser.phone || '',
        profilePicture: rawUser.profilePicture ? FileObjectMapper.mapToDomain(rawUser.profilePicture) : undefined,
        createdAt: new Date(rawUser.createdAt as string),
        updatedAt: new Date(rawUser.updatedAt as string),
      },
      new UniqueEntityID(userId),
    )

    if (userResult.isFailure) {
      throw new Error(`Error mapping user to Domain: ${userResult.errorValue()}`)
    }
    return userResult.getValue()
  }

  public static mapToDTO(user: User): UserDTO {
    return {
      id: user.id.toString(),
      email: user.props.email,
      displayName: user.props.displayName,
      phone: user.props.phone,
      preferredLanguage: user.props.preferredLanguage,
      profilePicture: user.profilePicture ? FileObjectMapper.mapToDTO(user.profilePicture) : null,
      createdAt: user.props.createdAt?.toISOString() as string,
      updatedAt: user.props.updatedAt?.toISOString() as string,
    }
  }
}
