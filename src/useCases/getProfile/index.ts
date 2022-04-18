import { userRepo } from '../../repos/userRepo'
import { GetProfile } from './getProfile'
import { GetProfileController } from './getProfileController'

const getProfileUseCase = new GetProfile(userRepo)
export const getProfileController = new GetProfileController(getProfileUseCase)
