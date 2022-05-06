import { bucketService } from '../../services/bucketService'
import { fileRepo } from '../../repos/fileRepo'
import { userRepo } from '../../repos/userRepo'
import { UpdateProfile } from './updateProfile'
import { UpdateProfileController } from './updateProfileController'

const updateProfileUseCase = new UpdateProfile(userRepo, fileRepo, bucketService)
export const updateProfileController = new UpdateProfileController(updateProfileUseCase)
