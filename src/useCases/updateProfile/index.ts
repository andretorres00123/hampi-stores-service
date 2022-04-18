import { userRepo } from '../../repos/userRepo'
import { UpdateProfile } from './updateProfile'
import { UpdateProfileController } from './updateProfileController'

const updateProfileUseCase = new UpdateProfile(userRepo)
export const updateProfileController = new UpdateProfileController(updateProfileUseCase)
