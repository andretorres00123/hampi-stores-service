import { User } from '../domain/user'
import { UserRepoImpl } from './implementations/userRepoImpl'
import { documentClient } from './utils'

export interface UserRepo {
  createUser(user: User): Promise<void>
}

export const userRepo = new UserRepoImpl(documentClient)
