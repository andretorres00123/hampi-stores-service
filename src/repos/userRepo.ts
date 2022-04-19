import { User } from '../domain/user'
import { UserRepoImpl } from './implementations/userRepoImpl'
import { documentClient } from './utils'

export interface UserRepo {
  createUser(user: User): Promise<void>
  updateUser(user: User): Promise<void>
  getUserById(userId: string): Promise<User | null>
}

export const userRepo = new UserRepoImpl(documentClient)
